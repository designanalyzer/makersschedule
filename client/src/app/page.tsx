'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UnscheduledTask, ScheduledTask, taskService, unscheduledTaskService, ensureTaskColor } from '../services/taskService';
import EditTaskModal from '../components/EditTaskModal';
import AddTaskModal, { TaskInput } from '../components/AddTaskModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../hooks/useTasks';

import AuthGuard from '../components/AuthGuard';
import type { TaskEditInput } from '../services/taskService';

const hours = Array.from({ length: 13 }, (_, i) => 8 + i); // 8:00 to 20:00

function CalendarPage() {
  const { user } = useAuth();
  const { scheduledTasks, unscheduledTasks, loading, updateScheduledTasks, updateUnscheduledTasks } = useTasks();
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [currentMonday, setCurrentMonday] = useState(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });
  const [currentWeek, setCurrentWeek] = useState<Array<{ label: string; date: number; isToday: boolean; fullDate: string }>>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ScheduledTask | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ day: number; hour: number } | undefined>(undefined);
  const [taskErrorMessage, setTaskErrorMessage] = useState<string | null>(null);

  // Calculate current week dates based on currentMonday
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekDays = [];
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentMonday);
      date.setDate(currentMonday.getDate() + i);
      const isToday = date.toDateString() === today.toDateString();
      weekDays.push({
        label: dayLabels[date.getDay()],
        date: date.getDate(),
        isToday,
        fullDate: date.toISOString().slice(0, 10),
      });
    }
    setCurrentWeek(weekDays);
  }, [currentMonday]);

  // Navigation handlers
  const goToPreviousWeek = () => {
    setCurrentMonday(prev => {
      const newMonday = new Date(prev);
      newMonday.setDate(prev.getDate() - 7);
      return newMonday;
    });
  };
  const goToNextWeek = () => {
    setCurrentMonday(prev => {
      const newMonday = new Date(prev);
      newMonday.setDate(prev.getDate() + 7);
      return newMonday;
    });
  };

  // Tasks are now loaded by the useTasks hook
  // No need for manual loading here

  const handleDragStart = (e: React.DragEvent, task: any) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    
    // Set the data in multiple formats for better compatibility
    const taskData = JSON.stringify(task);
    e.dataTransfer.setData('text/plain', taskData);
    e.dataTransfer.setData('application/json', taskData);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Clear all previous visual feedback
    document.querySelectorAll('.calendar-slot').forEach(slot => {
      (slot as HTMLElement).style.backgroundColor = '';
      (slot as HTMLElement).style.borderColor = '';
    });
    
    // Add visual feedback only to the current target
    const target = e.currentTarget as HTMLElement;
    if (target.classList.contains('calendar-slot')) {
      target.style.backgroundColor = '#5CB8E420';
      target.style.borderColor = '#5CB8E4';
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the calendar slot (not entering a child element)
    const target = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement;
    
    if (!target.contains(relatedTarget)) {
      target.style.backgroundColor = '';
      target.style.borderColor = '';
    }
  };

  const handleDrop = async (e: React.DragEvent, day: number, hour: number) => {
    e.preventDefault();
    
    // Check authentication first
    if (!user) {
      console.error('No authenticated user found in handleDrop');
      setTaskErrorMessage('Authentication error. Please refresh the page and try again.');
      return;
    }
    
    // Remove visual feedback
    const target = e.currentTarget as HTMLElement;
    if (target.classList.contains('calendar-slot')) {
      target.style.backgroundColor = '';
      target.style.borderColor = '';
    }
    
    try {
      // Try to get data in multiple formats for better compatibility
      let data = e.dataTransfer.getData('text/plain');
      if (!data) {
        data = e.dataTransfer.getData('application/json');
      }
      if (!data) {
        // Try to get any available data
        for (const type of e.dataTransfer.types) {
          data = e.dataTransfer.getData(type);
          if (data) break;
        }
      }
      
      if (!data) {
        console.error('No data found in dataTransfer');
        console.error('Available types:', e.dataTransfer.types);
        setTaskErrorMessage('No task data found. Please try dragging the task again.');
        return;
      }
      
      let task;
      try {
        task = JSON.parse(data);
      } catch (parseError) {
        console.error('Failed to parse task data:', parseError);
        console.error('Raw data:', data);
        setTaskErrorMessage('Invalid task data. Please try dragging the task again.');
        return;
      }
      
      if (task.day !== undefined) {
        // This is a scheduled task being moved
        const updatedTask = await taskService.moveScheduledTask(task.id, day, hour);
        if (updatedTask) {
          updateScheduledTasks(scheduledTasks.filter(t => t.id !== task.id).concat(ensureTaskColor(updatedTask)));
        }
      } else {
        // Check if this is a project task
        if (task.id && task.id.startsWith('project-')) {
          // Create a new scheduled task from the project task
          const taskData = {
            name: task.name,
            category: task.category,
            color: task.color,
            duration: task.duration,
            day,
            hour,
          };
          
          const newScheduledTask = await taskService.addScheduledTask(taskData);

          if (newScheduledTask) {
            // Mark the project step as completed
            const stepId = task.step_id; // Use the step_id from the task
            if (stepId && task.project_id) {
              try {
                const { data, error } = await supabase
                  .from('goal_steps')
                  .update({ completed: true })
                  .eq('id', stepId)
                  .eq('goal_id', task.project_id);
                
                if (error) {
                  console.error('Error updating goal step:', error);
                } else {
                  console.log('Successfully marked project step as completed');
                }
              } catch (error) {
                console.error('Error marking step as completed:', error);
              }
            }

            // Refresh task lists
            const [scheduled, unscheduled] = await Promise.all([
              taskService.getScheduledTasks(),
              unscheduledTaskService.getUnscheduledTasks()
            ]);
            
            updateScheduledTasks(scheduled.map(ensureTaskColor));
            updateUnscheduledTasks(unscheduled.map(ensureTaskColor));
            
            // Notify sidebar to refresh
            window.dispatchEvent(new CustomEvent('taskMoved'));
          } else {
            console.error('Failed to create scheduled task from project task');
            setTaskErrorMessage('Failed to schedule project task. Please try again.');
          }
        } else {
          // This is a regular unscheduled task being scheduled
          const success = await unscheduledTaskService.moveToScheduled(task, day, hour);
          if (success) {
            // Refresh both task lists
            const [scheduled, unscheduled] = await Promise.all([
              taskService.getScheduledTasks(),
              unscheduledTaskService.getUnscheduledTasks()
            ]);
            
            updateScheduledTasks(scheduled.map(ensureTaskColor));
            updateUnscheduledTasks(unscheduled.map(ensureTaskColor));
            
            // Notify sidebar to refresh
            window.dispatchEvent(new CustomEvent('taskMoved'));
          } else {
            console.error('Failed to move unscheduled task to scheduled');
            setTaskErrorMessage('Failed to schedule task. Please try again.');
          }
        }
      }
      
    } catch (error) {
      console.error('=== DROP EVENT FAILED ===');
      console.error('Error handling drop:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      setTaskErrorMessage('An error occurred while scheduling the task. Please try again.');
    }
    
    setDraggedTask(null);
  };

  const handleRemoveTask = async (taskId: string) => {
    const task = scheduledTasks.find(t => t.id === taskId);
    if (task) {
      const success = await unscheduledTaskService.moveToUnscheduled(task);
      if (success) {
                    // Refresh both task lists
            const [scheduled, unscheduled] = await Promise.all([
              taskService.getScheduledTasks(),
              unscheduledTaskService.getUnscheduledTasks()
            ]);
            
            updateScheduledTasks(scheduled.map(ensureTaskColor));
            updateUnscheduledTasks(unscheduled.map(ensureTaskColor));
      }
    }
  };

  const handleAddTask = async (taskInput: TaskInput) => {
    setTaskErrorMessage(null);
    if (taskInput.day !== undefined && taskInput.hour !== undefined) {
      // Create scheduled task directly
      const newTask = await taskService.addScheduledTask({
        name: taskInput.name,
        category: taskInput.category,
        color: taskInput.color,
        duration: taskInput.duration,
        day: taskInput.day,
        hour: taskInput.hour,
      });

      if (newTask) {
        updateScheduledTasks([...scheduledTasks, ensureTaskColor(newTask)]);
        // Notify sidebar to refresh
        window.dispatchEvent(new CustomEvent('taskAdded'));
      } else {
        setTaskErrorMessage('Failed to add scheduled task. Please try again.');
        console.error('Failed to add scheduled task:', taskInput);
      }
    } else {
      // Create unscheduled task (existing behavior)
      const newTask = await unscheduledTaskService.addUnscheduledTask({
        name: taskInput.name,
        category: taskInput.category,
        color: taskInput.color,
        duration: taskInput.duration,
      });

      if (newTask) {
        updateUnscheduledTasks([...unscheduledTasks, ensureTaskColor(newTask)]);
        // Notify sidebar to refresh
        window.dispatchEvent(new CustomEvent('taskAdded'));
      } else {
        setTaskErrorMessage('Failed to add task. Please try again.');
        console.error('Failed to add task:', taskInput);
      }
    }
  };

  const handleEditTask = async (taskId: string, updates: TaskEditInput) => {
    const updatedTask = await taskService.updateScheduledTask(taskId, updates);
    if (updatedTask) {
      updateScheduledTasks(scheduledTasks.map(task => task.id === taskId ? ensureTaskColor(updatedTask) : task));
    }
  };

  const handleTaskClick = (task: ScheduledTask) => {
    setEditingTask(task);
    setEditModalOpen(true);
  };



  const getTasksForSlot = useCallback((day: number, hour: number) => {
    // Only show tasks that START at this exact hour
    // Multi-hour tasks will span multiple slots from their starting position
    return scheduledTasks.filter(task => task.day === day && task.hour === hour);
  }, [scheduledTasks]);

  const getTaskHeight = (duration: string) => {
    const hours = getDurationInHours(duration);
    // Each hour slot is 64px (h-16), so multiply by 64 for exact pixel height
    return `${hours * 64}px`;
  };

  const getDurationInHours = (duration: string) => {
    switch (duration) {
      case '30 minutes':
        return 0.5;
      case '1 hour':
        return 1;
      case '2 hours':
        return 2;
      case '3 hours':
        return 3;
      case '4 hours':
        return 4;
      case '6 hours':
        return 6;
      case '8 hours':
        return 8;
      default:
        return 1;
    }
  };

  const calculateProgressData = () => {
    const categories = ['deepwork', 'busywork', 'projects'];
    const data = categories.map(category => {
      const tasks = scheduledTasks.filter(task => task.category === category);
      const totalHours = tasks.reduce((sum, task) => sum + getDurationInHours(task.duration), 0);
      
      let color = 'bg-gray-400';
      if (category === 'deepwork') color = 'bg-brand-purple';
      else if (category === 'busywork') color = 'bg-brand-blue';
      else if (category === 'projects') color = 'bg-emerald-500';
      
      return {
        label: category === 'deepwork' ? 'Deep Work' : 
               category === 'busywork' ? 'Busywork' : 
               category === 'projects' ? 'Projects' : category,
        value: totalHours,
        color
      };
    });
    
    return data;
  };

  // Memoize expensive calculations
  const progressData = useMemo(() => calculateProgressData(), [scheduledTasks]);
  
  // Memoize tasks for slots to avoid recalculating on every render
  const tasksForSlots = useMemo(() => {
    const slots: { [key: string]: ScheduledTask[] } = {};
    scheduledTasks.forEach(task => {
      const key = `${task.day}-${task.hour}`;
      if (!slots[key]) slots[key] = [];
      slots[key].push(task);
    });
    return slots;
  }, [scheduledTasks]);

  const handleAddTaskToSlot = async (day: number, hour: number) => {
    setSelectedSlot({ day, hour });
    setAddModalOpen(true);
  };

  function getISOWeekNumber(date: Date) {
    const temp = new Date(date.getTime());
    temp.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    temp.setDate(temp.getDate() + 3 - (temp.getDay() + 6) % 7);
    // January 4 is always in week 1.
    const week1 = new Date(temp.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return (
      1 + Math.round(
        ((temp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
      )
    );
  }

  // Loading state is now handled by the useTasks hook
  // No need for duplicate loading here

  return (
    <div className="flex flex-1">
      {/* Main calendar area */}
      <div className="flex-1 overflow-auto">
        <div className="p-2 space-y-2">
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={goToPreviousWeek}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
            >
              ← Previous Week
            </button>
            <div className="text-lg font-semibold text-gray-900">
              Week {getISOWeekNumber(currentMonday)}
            </div>
            <button
              onClick={goToNextWeek}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
            >
              Next Week →
            </button>
          </div>

          {/* Progress Chart */}
          <div className="bg-white rounded-lg shadow-sm p-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Weekly Progress</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {progressData.slice(0, 3).map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm text-gray-600">{item.value}h</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${item.color}`}
                      style={{ 
                        width: `${Math.min((item.value / 40) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Target: 40 hours per week
            </div>
          </div>

                    {/* Calendar Grid */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <div className="min-w-[720px]">
            {/* Week Header */}
            <div className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-2 bg-gray-50 border-r border-gray-200"></div>
              {currentWeek.map((day, index) => (
                <div 
                  key={index} 
                  className={`p-2 text-center border-r border-gray-200 last:border-r-0 ${
                    day.isToday ? 'bg-brand-blue/10 border-brand-blue/20' : 'bg-gray-50'
                  }`}
                >
                  <div className={`text-sm font-medium ${day.isToday ? 'text-brand-purple' : 'text-gray-900'}`}>
                    {day.label}
                  </div>
                  <div className={`text-xs ${day.isToday ? 'text-brand-blue font-semibold' : 'text-gray-500'}`}>
                    {day.date}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-8">
              {/* Time Column */}
              <div className="border-r border-gray-200">
                {hours.map((hour) => (
                  <div key={hour} className="h-16 border-b border-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">{hour}:00</span>
                  </div>
                ))}
              </div>

              {/* Day Columns */}
              {currentWeek.map((_, dayIndex) => (
                <div key={dayIndex} className="border-r border-gray-200 last:border-r-0">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="h-16 border-b border-gray-200 p-0.5 relative overflow-visible"
                    >
                      <div 
                        className="calendar-slot w-full h-full rounded border border-dashed border-gray-300 hover:border-brand-blue transition-colors duration-200 flex items-center justify-center cursor-pointer relative"
                        onClick={() => handleAddTaskToSlot(dayIndex, hour)}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, dayIndex, hour)}
                        data-day={dayIndex}
                        data-hour={hour}
                        style={{ minHeight: '64px' }}
                      >
                        {/* Show if this slot is occupied by a longer task */}
                        {scheduledTasks.some(task => 
                          task.day === dayIndex && 
                          task.hour < hour && 
                          task.hour + getDurationInHours(task.duration) > hour
                        ) && (
                          <div className="absolute inset-0 bg-gray-100/20 pointer-events-none rounded border-l-2 border-dashed border-gray-300"></div>
                        )}
                        <span className="text-xs text-gray-400">+</span>
                      </div>
                      
                      {/* Display scheduled tasks - only show tasks that start at this exact hour */}
                      {getTasksForSlot(dayIndex, hour).map((task) => {
                        const taskHeight = getTaskHeight(task.duration);
                        
                        return (
                          <div
                            key={task.id}
                            className="absolute rounded-lg px-3 py-2 text-xs font-medium text-gray-700 cursor-move flex flex-col justify-between group shadow-sm"
                            style={{
                              backgroundColor: `${task.color}40`,
                              border: `2px solid ${task.color}`,
                              height: `calc(${taskHeight} - 2px)`, // Subtract border width to prevent overlap
                              width: 'calc(100% - 8px)', // More padding on sides
                              top: '2px', // More padding from top
                              left: '2px', // More padding from left
                              zIndex: 50 // Much higher z-index to ensure tasks appear above ALL slot borders
                            }}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task)}
                            onClick={() => handleTaskClick(task)}
                          >
                            <div className="flex flex-col h-full justify-between">
                              <div className="flex items-center justify-between">
                                <span className="truncate text-xs font-bold leading-none flex-1">{task.name}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveTask(task.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-green-500 ml-1 text-base font-bold px-1 flex-shrink-0"
                                >
                                  ×
                                </button>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs opacity-75 capitalize">
                                  {task.category === 'deepwork' ? 'Deep Work' : 
                                   task.category === 'busywork' ? 'Busywork' : 
                                   task.category === 'projects' ? 'Projects' : task.category}
                                </span>
                                <span className="text-xs opacity-75 font-mono">
                                  {task.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          {taskErrorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
              {taskErrorMessage}
            </div>
          )}
        </div>
      </div>



      {/* Modals */}
      <EditTaskModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        task={editingTask}
        onSave={handleEditTask}
      />

      <AddTaskModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddTask}
        slot={selectedSlot}
      />

      {/* Error Message */}
      {taskErrorMessage && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          {taskErrorMessage}
          <button
            onClick={() => setTaskErrorMessage(null)}
            className="ml-2 text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

// Memoize the calendar page to prevent unnecessary re-renders
const MemoizedCalendarPage = React.memo(CalendarPage);

export default function Page() {
  return (
    <AuthGuard>
      <MemoizedCalendarPage />
    </AuthGuard>
  );
} 