import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoalWithCommitment, GoalService, GoalStep } from '../services/goalService';
import { supabase } from '../lib/supabase';

interface GoalCardProps {
  goal: GoalWithCommitment;
  steps?: GoalStep[];
  onEdit?: (goal: GoalWithCommitment) => void;
  onUpdateProgress?: (goal: GoalWithCommitment) => void;
  onDelete?: (goal: GoalWithCommitment) => void;
  onStepsUpdate?: (goalId: string, steps: GoalStep[]) => void;
}

interface ProjectStep {
  id?: string;
  text: string;
  completed: boolean;
  order_index?: number;
  goal_id?: string;
}

const PROJECT_CATEGORIES = [
  { label: 'Creative', value: 'creative', color: 'bg-pink-100 text-pink-900' },
  { label: 'Technical', value: 'technical', color: 'bg-blue-100 text-blue-900' },
  { label: 'Learning', value: 'learning', color: 'bg-yellow-100 text-yellow-900' },
  { label: 'Side Hustle', value: 'sidehustle', color: 'bg-purple-100 text-purple-900' },
  { label: 'Work', value: 'work', color: 'bg-green-100 text-green-900' },
  { label: 'Health', value: 'health', color: 'bg-teal-100 text-teal-900' },
  { label: 'Finance', value: 'finance', color: 'bg-orange-100 text-orange-900' },
  { label: 'Custom', value: 'custom', color: 'bg-gray-100 text-gray-900' },
];

export default function GoalCard({ goal, steps: preloadedSteps, onEdit, onUpdateProgress, onDelete, onStepsUpdate }: GoalCardProps) {
  // Project state
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description);
  const [category, setCategory] = useState(goal.category);
  const [timeline, setTimeline] = useState(goal.timeline);
  const [startDate, setStartDate] = useState(goal.start_date || new Date().toISOString().split('T')[0]);
  const [weeklyHours, setWeeklyHours] = useState(goal.weeklyHours || 5);
  const [workDays, setWorkDays] = useState(goal.workDays || '');
  const [bestTime, setBestTime] = useState(goal.bestTime || 'morning');
  
  // Steps state
  const [steps, setSteps] = useState<ProjectStep[]>([]);
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);
  
  // UI state
  const [projectSaving, setProjectSaving] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [showProjectSaved, setShowProjectSaved] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const projectSaveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const textSaveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Initialize steps on component mount
  useEffect(() => {
    const initializeSteps = async () => {
      console.log('GoalCard initializing steps for goal:', goal.id);
      
      try {
        // Load existing steps from Supabase
        const { data: existingSteps, error } = await supabase
          .from('goal_steps')
          .select('*')
          .eq('goal_id', goal.id)
          .order('order_index', { ascending: true });
        
        if (error) {
          console.error('Error loading steps:', error);
          setSteps([]);
        } else {
          console.log('Loaded steps from Supabase:', existingSteps);
          setSteps(existingSteps || []);
        }
      } catch (err) {
        console.error('Error loading steps:', err);
        setSteps([]);
      } finally {
        setIsLoadingSteps(false);
      }
    };

    initializeSteps();
    
    // Cleanup timeout on unmount
    return () => {
      if (textSaveTimeoutRef.current) {
        clearTimeout(textSaveTimeoutRef.current);
      }
    };
  }, [goal.id]);

  // Auto-resize textarea
  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = 'auto';
      descriptionRef.current.style.height = descriptionRef.current.scrollHeight + 'px';
    }
  }, [description]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (projectSaveTimeoutRef.current) {
        clearTimeout(projectSaveTimeoutRef.current);
      }
      if (textSaveTimeoutRef.current) {
        clearTimeout(textSaveTimeoutRef.current);
      }
    };
  }, []);

  // Project autosave
  const saveProjectChanges = useCallback(async () => {
    setProjectSaving(true);
    setProjectError(null);
    setShowProjectSaved(false);

    try {
      const updatedProject = await GoalService.updateGoal(goal.id, {
        title,
        description,
        category,
        timeline,
        start_date: startDate,
        weekly_hours: weeklyHours,
        work_days: workDays,
        best_time: bestTime,
      });

      if (updatedProject) {
        const mappedProject = {
          ...goal,
          title,
          description,
          category,
          timeline,
          start_date: startDate,
          weeklyHours,
          workDays,
          bestTime,
        };
        
        onEdit?.(mappedProject);
        setShowProjectSaved(true);
        setTimeout(() => setShowProjectSaved(false), 2000);
      }
    } catch (error) {
      setProjectError('Failed to save project changes');
      console.error('Project save failed:', error);
    } finally {
      setProjectSaving(false);
    }
  }, [goal.id, title, description, category, timeline, startDate, weeklyHours, workDays, bestTime, onEdit]);

  const debouncedSaveProject = useCallback(() => {
    if (projectSaveTimeoutRef.current) {
      clearTimeout(projectSaveTimeoutRef.current);
    }
    projectSaveTimeoutRef.current = setTimeout(() => {
      saveProjectChanges();
    }, 1500);
  }, [saveProjectChanges]);

  // Project field change handlers
  const handleProjectFieldChange = (field: string, value: any) => {
    switch (field) {
      case 'title':
        setTitle(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'category':
        setCategory(value);
        break;
      case 'timeline':
        setTimeline(Number(value));
        break;
      case 'startDate':
        setStartDate(value);
        break;
      case 'weeklyHours':
        setWeeklyHours(Number(value));
        break;
      case 'bestTime':
        setBestTime(value);
        break;
    }
    debouncedSaveProject();
  };

  const handleWorkDayToggle = (day: string) => {
    const dayLower = day.toLowerCase();
    const fullDayName = {
      'mon': 'monday',
      'tue': 'tuesday', 
      'wed': 'wednesday',
      'thu': 'thursday',
      'fri': 'friday',
      'sat': 'saturday',
      'sun': 'sunday'
    }[dayLower] || dayLower;
    
    const newWorkDays = workDays.includes(fullDayName)
      ? workDays.replace(fullDayName, '').replace(/,\s*,/g, ',').replace(/^,|,$/g, '')
      : workDays ? `${workDays},${fullDayName}` : fullDayName;
    
    setWorkDays(newWorkDays);
    debouncedSaveProject();
  };

  // SIMPLE STEP OPERATIONS
  const addStep = async () => {
    try {
      const newStep = {
        text: `Step ${steps.length + 1}`,
        completed: false,
        order_index: steps.length + 1,
        goal_id: goal.id
      };
      
      // Create step in Supabase
      const { data: createdStep, error } = await supabase
        .from('goal_steps')
        .insert([newStep])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating step:', error);
        return;
      }
      
      console.log('Created step in Supabase:', createdStep);
      
      // Update local state
      const updatedSteps = [...steps, createdStep];
      setSteps(updatedSteps);
      
      if (onStepsUpdate) {
        onStepsUpdate(goal.id, updatedSteps as GoalStep[]);
      }
    } catch (err) {
      console.error('Error adding step:', err);
    }
  };

  const deleteStep = async (index: number) => {
    try {
      const stepToDelete = steps[index];
      
      if (!stepToDelete.id) {
        console.error('Step has no ID, cannot delete');
        return;
      }
      
      // Delete from Supabase
      const { error } = await supabase
        .from('goal_steps')
        .delete()
        .eq('id', stepToDelete.id);
      
      if (error) {
        console.error('Error deleting step:', error);
        return;
      }
      
      console.log('Deleted step from Supabase:', stepToDelete.id);
      
      // Update local state
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(newSteps);
      
      if (onStepsUpdate) {
        onStepsUpdate(goal.id, newSteps as GoalStep[]);
      }
    } catch (err) {
      console.error('Error deleting step:', err);
    }
  };

  const updateStepText = async (index: number, text: string) => {
    try {
      const stepToUpdate = steps[index];
      
      if (!stepToUpdate.id) {
        console.error('Step has no ID, cannot update');
        return;
      }
      
      // Update local state immediately for responsive UI
      const newSteps = steps.map((step, i) => 
        i === index ? { ...step, text } : step
      );
      setSteps(newSteps);
      
      // Clear existing timeout
      if (textSaveTimeoutRef.current) {
        clearTimeout(textSaveTimeoutRef.current);
      }
      
      // Debounce the database update
      textSaveTimeoutRef.current = setTimeout(async () => {
        try {
          // Update in Supabase
          const { error } = await supabase
            .from('goal_steps')
            .update({ text })
            .eq('id', stepToUpdate.id);
          
          if (error) {
            console.error('Error updating step text:', error);
            return;
          }
          
          console.log('Updated step text in Supabase:', stepToUpdate.id, text);
          
          if (onStepsUpdate) {
            onStepsUpdate(goal.id, newSteps as GoalStep[]);
          }
        } catch (err) {
          console.error('Error updating step text:', err);
        }
      }, 500); // Wait 500ms after user stops typing
      
    } catch (err) {
      console.error('Error updating step text:', err);
    }
  };

  const toggleStepCompleted = async (index: number) => {
    try {
      const stepToUpdate = steps[index];
      
      if (!stepToUpdate.id) {
        console.error('Step has no ID, cannot update');
        return;
      }
      
      const newCompleted = !stepToUpdate.completed;
      
      // Update in Supabase
      const { error } = await supabase
        .from('goal_steps')
        .update({ completed: newCompleted })
        .eq('id', stepToUpdate.id);
      
      if (error) {
        console.error('Error updating step completion:', error);
        return;
      }
      
      console.log('Updated step completion in Supabase:', stepToUpdate.id, newCompleted);
      
      // Update local state
      const newSteps = steps.map((step, i) => 
        i === index ? { ...step, completed: newCompleted } : step
      );
      setSteps(newSteps);
      
      if (onStepsUpdate) {
        onStepsUpdate(goal.id, newSteps as GoalStep[]);
      }
    } catch (err) {
      console.error('Error updating step completion:', err);
    }
  };



  // Calculate progress
  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.filter(step => step.text.trim() !== '').length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  // Calculate deadline
  const calculateDeadline = (startDate: string, timeline: number): string => {
    if (!startDate) return 'No deadline';
    
    try {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) return 'Invalid date';
      
      const deadline = new Date(start);
      deadline.setMonth(deadline.getMonth() + timeline);
      
      return deadline.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Error';
    }
  };

  const deadlineDate = calculateDeadline(startDate, timeline);
  const isSaving = projectSaving;
  const showSaved = showProjectSaved;
  const error = projectError || stepError;

  return (
    <div className="w-full border-2 border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Ultra Compact Header */}
      <div className="flex items-start justify-between mb-2">
        {/* Left: Category, Title, Description */}
        <div className="flex-1">
          <div className="min-w-0">
            {/* Category */}
            <div className="mb-1">
              <select
                value={category}
                onChange={(e) => handleProjectFieldChange('category', e.target.value)}
                className={`px-2 py-0.5 rounded text-xs font-medium border-none outline-none focus:ring-1 focus:ring-black text-left w-20 ${PROJECT_CATEGORIES.find(c => c.value === category)?.color || 'bg-gray-100 text-gray-800'}`}
              >
                {PROJECT_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => handleProjectFieldChange('title', e.target.value)}
              className="text-base font-semibold text-gray-900 bg-transparent border-none outline-none focus:ring-1 focus:ring-black rounded px-1 py-0.5 w-full mb-1"
              placeholder="Project title"
            />
            {/* Compact description */}
            <textarea
              ref={descriptionRef}
              value={description}
              onChange={(e) => handleProjectFieldChange('description', e.target.value)}
              className="text-gray-600 text-xs bg-transparent border-none outline-none focus:ring-1 focus:ring-black rounded px-1 py-0.5 w-full resize-none"
              placeholder="Brief description..."
              rows={1}
            />
          </div>
        </div>
        
        {/* Center: Commitment Stats and Work Days */}
        <div className="flex items-center space-x-4">
          {/* Commitment Stats */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">⏰</span>
            <select
              value={weeklyHours}
              onChange={(e) => handleProjectFieldChange('weeklyHours', Number(e.target.value))}
              className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 text-xs font-medium border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[80px]"
            >
              <option value={1}>1h/w</option>
              <option value={2}>2h/w</option>
              <option value={3}>3h/w</option>
              <option value={4}>4h/w</option>
              <option value={5}>5h/w</option>
              <option value={10}>10h/w</option>
              <option value={15}>15h/w</option>
              <option value={20}>20h/w</option>
            </select>
            <select
              value={bestTime}
              onChange={(e) => handleProjectFieldChange('bestTime', e.target.value)}
              className="px-2 py-0.5 rounded-lg bg-yellow-50 text-yellow-800 text-xs font-medium border border-yellow-200 focus:outline-none focus:ring-1 focus:ring-yellow-500 min-w-[120px] w-[120px]"
            >
              <option value="morning">Morning</option>
              <option value="midday">Mid-day</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>
          
          {/* Work Days */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">📅</span>
            <div className="flex gap-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                const dayLower = day.toLowerCase();
                const fullDayName = {
                  'mon': 'monday',
                  'tue': 'tuesday', 
                  'wed': 'wednesday',
                  'thu': 'thursday',
                  'fri': 'friday',
                  'sat': 'saturday',
                  'sun': 'sunday'
                }[dayLower] || dayLower;
                const isSelected = workDays.includes(fullDayName);
                return (
                  <button
                    key={day}
                    onClick={() => handleWorkDayToggle(day)}
                    className={`px-1 py-0.5 rounded-lg text-xs border transition-colors ${
                      isSelected
                        ? 'bg-[#DAFF7D] text-[#222] border-[#A3C900]'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Right: Date/Timeline, Deadline */}
        <div className="flex flex-col items-end space-y-1">
          {/* Date and Timeline on same row */}
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleProjectFieldChange('startDate', e.target.value)}
              className="text-xs text-gray-600 bg-transparent border border-gray-200 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-black focus:border-black w-28"
            />
            <select
              value={timeline}
              onChange={(e) => handleProjectFieldChange('timeline', Number(e.target.value))}
              className="text-xs text-gray-600 bg-transparent border border-gray-200 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-black min-w-[50px]"
            >
              <option value={1}>1m</option>
              <option value={3}>3m</option>
              <option value={6}>6m</option>
              <option value={12}>1y</option>
              <option value={18}>1.5y</option>
              <option value={24}>2y</option>
              <option value={36}>3y</option>
              <option value={48}>4y</option>
              <option value={60}>5y</option>
            </select>
          </div>
          
          {/* Deadline aligned to the right */}
          <div className="text-xs text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded-lg border border-red-200 text-right">
            Due: {deadlineDate}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="mb-4">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-900">Steps</h3>
        </div>
        
        <div className="space-y-1">
          {isLoadingSteps ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mx-auto mb-2"></div>
              Loading steps...
            </div>
          ) : steps.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              No steps yet. Click "Add step" to get started!
            </div>
          ) : (
            steps.map((step, index) => (
              <div
                key={step.id || index}
                className="flex items-center space-x-2 p-2 rounded border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={step.completed}
                  onChange={() => toggleStepCompleted(index)}
                  className="w-4 h-4 rounded focus:ring-1 focus:ring-black text-[#A3C900] border-gray-300"
                />
                
                <input
                  type="text"
                  value={step.text}
                  onChange={(e) => updateStepText(index, e.target.value)}
                  className={`flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-[#A3C900] focus:border-[#A3C900] text-sm transition-all duration-200 ${
                    step.completed ? 'line-through text-gray-500 bg-gray-50' : 'border-gray-300'
                  }`}
                  placeholder={`Step ${index + 1}: What do you need to do?`}
                />
                
                <button
                  onClick={() => deleteStep(index)}
                  className="px-1 py-1 text-red-600 hover:bg-red-50 rounded text-sm transition-colors"
                  title="Delete step"
                >
                  ×
                </button>
              </div>
            ))
          )}
          
          {/* Add Step Button */}
          <div className="flex justify-start mt-2">
            <button
              onClick={addStep}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
            >
              <span className="text-lg">+</span>
              <span>Add step</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">
            Progress: {completedSteps}/{totalSteps} steps completed
          </div>
          <div className="text-sm font-medium text-gray-900">
            {Math.round(progressPercentage)}%
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#DAFF7D] h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          {isSaving && (
            <div className="flex items-center text-xs text-blue-600">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
              Saving...
            </div>
          )}
          {showSaved && (
            <div className="flex items-center text-xs text-green-600">
              <span className="mr-1">✓</span>
              Saved
            </div>
          )}
        </div>
        
        {/* Delete Button - Bottom Right */}
        <button
          onClick={() => onDelete?.(goal)}
          className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
          title="Delete project"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}