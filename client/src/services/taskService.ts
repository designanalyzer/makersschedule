import { supabase } from '../lib/supabase'

export interface Task {
  id: string;
  name: string;
  description?: string; // Add description field
  category: string;
  color: string;
  duration: string;
  day?: number;
  hour?: number;
  completed?: boolean; // Track completion
  created_at?: string;
  updated_at?: string;
}

export interface UnscheduledTask {
  id: string;
  name: string;
  description?: string; // Add description field
  category: string;
  color: string;
  duration: string;
  project_id?: string; // Link to project (optional)
  step_id?: string;
  task_type?: 'ongoing' | 'next';
}

export interface ScheduledTask extends Task {
  day: number;
  hour: number;
}

export interface TaskInput {
  name: string;
  description?: string; // Add description field
  category: string;
  color: string;
  duration: string;
  project_id?: string; // Link to project (optional)
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: string;
  category: string;
  scheduled_date?: string;
  scheduled_time?: string;
  duration?: number;
  project_id?: string; // Link to project (optional)
}

export interface TaskEditInput {
  name: string;
  description?: string; // Add description field
  category: string;
  color: string;
  duration: string;
  project_id?: string; // Link to project (optional)
}

// For now, we'll use a generic user ID that should work with your account
// In a real app, this would come from authentication
// Removed DEMO_USER_ID - now using authenticated user

// Scheduled Tasks
export const taskService = {
  // Fetch all scheduled tasks
  async getScheduledTasks(): Promise<ScheduledTask[]> {
    try {
      // Get the current authenticated user (same pattern as goalService)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return [];
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('day', { ascending: true })
        .order('hour', { ascending: true });

      if (error) {
        console.error('Error fetching scheduled tasks:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching scheduled tasks:', error);
      return [];
    }
  },

  // Add a new scheduled task
  async addScheduledTask(task: Omit<ScheduledTask, 'id' | 'created_at' | 'updated_at'>): Promise<ScheduledTask | null> {
    try {
      // Get the current authenticated user (same pattern as goalService)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found for adding scheduled task');
        return null;
      }

      // Insert the task data
      const insertData = {
        user_id: user.id,
        name: task.name,
        category: task.category,
        color: task.color,
        duration: task.duration,
        day: task.day,
        hour: task.hour,
      };
      
      const { data, error } = await supabase
        .from('tasks')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error adding scheduled task:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception in addScheduledTask:', error);
      return null;
    }
  },

  // Update a scheduled task
  async updateScheduledTask(taskId: string, updates: TaskEditInput): Promise<ScheduledTask | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          name: updates.name,
          category: updates.category,
          color: updates.color,
          duration: updates.duration,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        console.error('Error updating scheduled task:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating scheduled task:', error);
      return null;
    }
  },

  // Move a scheduled task to a new time slot
  async moveScheduledTask(taskId: string, newDay: number, newHour: number): Promise<ScheduledTask | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          day: newDay,
          hour: newHour,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        console.error('Error moving scheduled task:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error moving scheduled task:', error);
      return null;
    }
  },

  // Delete a scheduled task
  async deleteScheduledTask(taskId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Error deleting scheduled task:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting scheduled task:', error);
      return false;
    }
  },

  // Mark a task as completed
  async completeTask(taskId: string): Promise<ScheduledTask | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        console.error('Error completing task:', error);
        return null;
      }

      // If task is linked to a project, update project progress
      if (data.project_id) {
        try {
          const { GoalService } = await import('./goalService');
          await GoalService.updateProgressFromTasks(data.project_id);
          
          // Mark the corresponding goal step as completed
          await GoalService.markStepCompleted(data.project_id, data.name);
        } catch (projectError) {
          console.error('Error updating project progress:', projectError);
        }
      }

      return data;
    } catch (error) {
      console.error('Error completing task:', error);
      return null;
    }
  },

  // Mark a task as incomplete
  async uncompleteTask(taskId: string): Promise<ScheduledTask | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          completed: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        console.error('Error uncompleting task:', error);
        return null;
      }

      // If task is linked to a project, update project progress
      if (data.project_id) {
        try {
          const { GoalService } = await import('./goalService');
          await GoalService.updateProgressFromTasks(data.project_id);
        } catch (projectError) {
          console.error('Error updating project progress:', projectError);
        }
      }

      return data;
    } catch (error) {
      console.error('Error uncompleting task:', error);
      return null;
    }
  },
};

// Unscheduled Tasks
export const unscheduledTaskService = {
  // Fetch all unscheduled tasks
  async getUnscheduledTasks(): Promise<UnscheduledTask[]> {
    try {
      // Get the current authenticated user (same pattern as goalService)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return [];
      }

      const { data, error } = await supabase
        .from('unscheduled_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching unscheduled tasks:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching unscheduled tasks:', error);
      return [];
    }
  },

  // Get project tasks for sidebar (from goals)
  async getProjectTasksForSidebar(): Promise<UnscheduledTask[]> {
    try {
      // Get the current authenticated user (same pattern as goalService)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return [];
      }

      const { data: goals, error } = await supabase
        .from('goals')
        .select(`
          id,
          title,
          category,
          goal_steps (
            id,
            text,
            completed,
            order_index
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching goals for sidebar:', error);
        return [];
      }

      const projectTasks: UnscheduledTask[] = [];

      goals?.forEach(goal => {
        const steps = goal.goal_steps || [];
        const uncompletedSteps = steps.filter(step => !step.completed).sort((a, b) => a.order_index - b.order_index);
        
        // Create exactly 2 tasks per project: 1 ongoing + 1 next
        if (uncompletedSteps.length > 0) {
          // First task (ongoing)
          const ongoingStep = uncompletedSteps[0];
          projectTasks.push({
            id: `project-${goal.id}-ongoing-${ongoingStep.id}`,
            name: `${goal.title}: ${ongoingStep.text}`,
            category: goal.category || 'project',
            color: this.getGoalColor(goal.category),
            duration: '1 hour',
            project_id: goal.id,
            step_id: ongoingStep.id,
            task_type: 'ongoing'
          });
          
          // Second task (next) - if available
          if (uncompletedSteps.length > 1) {
            const nextStep = uncompletedSteps[1];
            projectTasks.push({
              id: `project-${goal.id}-next-${nextStep.id}`,
              name: `${goal.title}: ${nextStep.text}`,
              category: goal.category || 'project',
              color: this.getGoalColor(goal.category),
              duration: '1 hour',
              project_id: goal.id,
              step_id: nextStep.id,
              task_type: 'next'
            });
          }
        }
      });

      console.log('Total project tasks for sidebar:', projectTasks.length);
      return projectTasks;
    } catch (error) {
      console.error('Error fetching project tasks for sidebar:', error);
      return [];
    }
  },

  // Helper method to get goal color based on category
  getGoalColor(category: string): string {
    const colors: { [key: string]: string } = {
      'fitness': '#10B981',
      'learning': '#8B5CF6',
      'business': '#059669',
      'finance': '#F59E0B',
      'travel': '#14B8A6',
      'creative': '#EC4899',
      'health': '#EF4444',
      'career': '#6366F1',
      'relationships': '#F97316',
      'personal': '#6B7280',
      'project': '#DAFF7D',
    };
    return colors[category] || '#DAFF7D';
  },

  // Add a new unscheduled task
  async addUnscheduledTask(task: Omit<UnscheduledTask, 'id' | 'created_at' | 'updated_at'>): Promise<UnscheduledTask | null> {
    try {
      // Get the current authenticated user (same pattern as goalService)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return null;
      }

      const { data, error } = await supabase
        .from('unscheduled_tasks')
        .insert({
          user_id: user.id,
          name: task.name,
          category: task.category,
          color: task.color,
          duration: task.duration,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding unscheduled task:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error adding unscheduled task:', error);
      return null;
    }
  },

  // Update an unscheduled task
  async updateUnscheduledTask(taskId: string, updates: TaskEditInput): Promise<UnscheduledTask | null> {
    try {
      const { data, error } = await supabase
        .from('unscheduled_tasks')
        .update({
          name: updates.name,
          category: updates.category,
          color: updates.color,
          duration: updates.duration,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        console.error('Error updating unscheduled task:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating unscheduled task:', error);
      return null;
    }
  },

  // Delete an unscheduled task
  async deleteUnscheduledTask(taskId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('unscheduled_tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Error deleting unscheduled task:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting unscheduled task:', error);
      return false;
    }
  },

  // Move task from unscheduled to scheduled
  async moveToScheduled(unscheduledTask: UnscheduledTask, day: number, hour: number): Promise<boolean> {
    try {
      // First, add to scheduled tasks
      const scheduledTask = await taskService.addScheduledTask({
        name: unscheduledTask.name,
        category: unscheduledTask.category,
        color: unscheduledTask.color,
        duration: unscheduledTask.duration,
        day,
        hour,
      });

      if (!scheduledTask) {
        return false;
      }

      // Then, delete from unscheduled tasks
      const deleted = await this.deleteUnscheduledTask(unscheduledTask.id);
      return deleted;
    } catch (error) {
      console.error('Error moving task to scheduled:', error);
      return false;
    }
  },

  // Move task from scheduled to unscheduled
  async moveToUnscheduled(scheduledTask: ScheduledTask): Promise<boolean> {
    try {
      // First, add to unscheduled tasks
      const unscheduledTask = await this.addUnscheduledTask({
        name: scheduledTask.name,
        category: scheduledTask.category,
        color: scheduledTask.color,
        duration: scheduledTask.duration,
      });

      if (!unscheduledTask) {
        return false;
      }

      // Then, delete from scheduled tasks
      const deleted = await taskService.deleteScheduledTask(scheduledTask.id);
      return deleted;
    } catch (error) {
      console.error('Error moving task to unscheduled:', error);
      return false;
    }
  },
};

// Helper function to ensure task has proper color
export const ensureTaskColor = (task: any) => {
  if (!task.color || task.color === '' || task.color === 'undefined' || task.color === 'null') {
    switch (task.category) {
      case 'deepwork':
        return { ...task, color: '#3B82F6' };
      case 'busywork':
        return { ...task, color: '#F59E0B' };
      case 'projects':
        return 'Projects';
      default:
        return { ...task, color: '#6B7280' };
    }
  }
  return task;
};

// Demo data initialization removed - now using authenticated user data 