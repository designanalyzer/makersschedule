'use client';

import React, { useState, useEffect, memo } from 'react';
import { usePathname } from 'next/navigation';
import UnscheduledTasksPanel from '../UnscheduledTasksPanel';
import AddProjectSidebar from '../AddProjectSidebar';
import { UnscheduledTask, unscheduledTaskService } from '../../services/taskService';
import { GoalService } from '../../services/goalService';

// Default categories fallback
const defaultCategories = [
  { label: 'Deep Work', value: 'deepwork' },
  { label: 'Busywork', value: 'busywork' },
  { label: 'Projects', value: 'projects' },
];

const COLORS = [
  '#F5FF90', // Bright lime green
  '#E6B800', // Darker golden yellow
  '#EDF5FC', // Light blue
  '#A8D8EA', // Sky blue
  '#F7A072', // Orange
  '#FF6B6B', // Coral red
  '#8367C7', // Purple
  '#6C5CE7', // Electric purple
  '#439A86', // Teal
  '#00B894', // Emerald green
];

interface NewProjectInput {
  name: string;
  description: string;
  category: string;
  timeline: number;
}

function Sidebar() {
  const pathname = usePathname();
  const isProjectsPage = pathname === '/projects';
  const isNotesPage = pathname === '/notes';
  
  const [unscheduledTasks, setUnscheduledTasks] = useState<UnscheduledTask[]>([]);
  const [taskName, setTaskName] = useState('');
  const [categories, setCategories] = useState(defaultCategories);
  const [category, setCategory] = useState(defaultCategories[0].value);
  const [color, setColor] = useState(COLORS[0]);
  const [duration, setDuration] = useState('1 hour');
  const [isLoading, setIsLoading] = useState(false);

  // Load unscheduled tasks and dynamic categories from Supabase on component mount
  useEffect(() => {
    if (!isProjectsPage && !isNotesPage) {
      loadUnscheduledTasks();
      loadDynamicCategories();
    }
  }, [isProjectsPage, isNotesPage]);

  const loadDynamicCategories = async () => {
    try {
      const goalsResponse = await GoalService.getGoals();
      const goals = goalsResponse.data || [];
      const uniqueCategories = [...new Set(goals.map(goal => goal.category))];
      
      const dynamicCategories = uniqueCategories.map(cat => ({
        label: cat.charAt(0).toUpperCase() + cat.slice(1), // Capitalize first letter
        value: cat.toLowerCase()
      }));

      // If we have dynamic categories, use them; otherwise fall back to defaults
      if (dynamicCategories.length > 0) {
        setCategories(dynamicCategories);
        setCategory(dynamicCategories[0].value);
      }
    } catch (error) {
      console.error('Error loading dynamic categories:', error);
      // Keep default categories if there's an error
    }
  };

  // Add a global event listener to refresh tasks when they change
  useEffect(() => {
    if (isProjectsPage || isNotesPage) return;

    const handleTaskChange = () => {
      loadUnscheduledTasks();
    };

    const handleProjectChange = () => {
      loadUnscheduledTasks();
    };

    // Listen for custom events when tasks are moved
    window.addEventListener('taskMoved', handleTaskChange);
    window.addEventListener('taskAdded', handleTaskChange);
    window.addEventListener('projectUpdated', handleProjectChange);
    window.addEventListener('projectAdded', handleProjectChange);

    return () => {
      window.removeEventListener('taskMoved', handleTaskChange);
      window.removeEventListener('taskAdded', handleTaskChange);
      window.removeEventListener('projectUpdated', handleProjectChange);
      window.removeEventListener('projectAdded', handleProjectChange);
    };
  }, [isProjectsPage]);

  const loadUnscheduledTasks = async () => {
    try {
      // Load both regular unscheduled tasks and project tasks
      const [regularTasks, projectTasks] = await Promise.all([
        unscheduledTaskService.getUnscheduledTasks(),
        unscheduledTaskService.getProjectTasksForSidebar()
      ]);
      
      // Combine both types of tasks
      const allTasks = [...regularTasks, ...projectTasks];
      setUnscheduledTasks(allTasks);
    } catch (error) {
      console.error('Error loading unscheduled tasks:', error);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim() && !isLoading) {
      setIsLoading(true);
      try {
        const newTask = await unscheduledTaskService.addUnscheduledTask({
          name: taskName.trim(),
          category,
          color,
          duration,
        });

        if (newTask) {
          setUnscheduledTasks(prev => [...prev, newTask]);
          setTaskName('');
          setCategory(categories[0].value);
          setColor(COLORS[0]);
          setDuration('1 hour');
        }
      } catch (error) {
        console.error('Error adding task:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemoveTask = async (id: string) => {
    try {
      // Check if this is a project task (starts with 'project-')
      if (id.startsWith('project-')) {
        // For project tasks, we don't delete them from the sidebar
        // They should only be removed when moved to the calendar
        console.log('Project task cannot be deleted from sidebar');
        return;
      }
      
      const success = await unscheduledTaskService.deleteUnscheduledTask(id);
      if (success) {
        setUnscheduledTasks(prev => prev.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error removing task:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent, task: UnscheduledTask) => {
    // Set up drag data for unscheduled tasks
    console.log('Sidebar handleDragStart called with task:', task);
    console.log('Setting drag data:', JSON.stringify(task));
    e.dataTransfer.setData('text/plain', JSON.stringify(task));
    e.dataTransfer.effectAllowed = 'move';
    console.log('Drag data set successfully');
  };

  const handleColorPick = (value: string) => setColor(value);

  // Render AddProjectSidebar on projects page
  if (isProjectsPage) {
    return (
      <AddProjectSidebar 
        onAddProject={(projectData: NewProjectInput) => {
          // Dispatch custom event to notify projects page
          const event = new CustomEvent('projectAdded', { detail: projectData });
          window.dispatchEvent(event);
        }} 
      />
    );
  }

  // Hide sidebar on notes page
  if (isNotesPage) {
    return null;
  }

  return (
    <aside className="w-80 bg-white shadow-sm border-r flex flex-col h-full">
      <div className="p-5 flex flex-col gap-3">
        {/* Unscheduled Tasks Panel - Show First */}
        <div className="flex-1">
          <UnscheduledTasksPanel
            tasks={unscheduledTasks}
            onDragStart={handleDragStart}
            onRemove={handleRemoveTask}
          />
        </div>

        {/* Add Task Form - Show Below */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Add Task</h2>
          
          <form onSubmit={handleAddTask} className="space-y-2">
            {/* Task Name */}
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Task name"
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
              maxLength={100}
              required
              disabled={isLoading}
            />
            
            {/* Category and Duration - Side by side */}
            <div className="flex space-x-2">
              <select
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                value={category}
                onChange={e => setCategory(e.target.value)}
                disabled={isLoading}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <select
                className="w-20 border border-gray-300 rounded px-3 py-2 text-sm"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                disabled={isLoading}
              >
                <option value="30 minutes">30 min</option>
                <option value="1 hour">1 h</option>
                <option value="2 hours">2 h</option>
                <option value="3 hours">3 h</option>
              </select>
            </div>
            
            {/* Color Picker */}
            <div className="flex flex-wrap gap-1">
              {COLORS.map(colorOption => (
                <button
                  type="button"
                  key={colorOption}
                  onClick={() => handleColorPick(colorOption)}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    color === colorOption 
                      ? 'border-white' 
                      : 'border-gray-500'
                  }`}
                  style={{ 
                    backgroundColor: colorOption,
                    borderRadius: '50%' 
                  }}
                  aria-label={colorOption}
                  disabled={isLoading}
                >
                  {color === colorOption && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            
            {/* Add Task Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-brand-purple text-white py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transform hover:scale-[1.02] ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-blue'
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
              <span>{isLoading ? 'Adding...' : 'Add Task'}</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

// Memoize the sidebar to prevent unnecessary re-renders
export default memo(Sidebar); 