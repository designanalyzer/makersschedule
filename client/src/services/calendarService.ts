import { supabase } from '../lib/supabase';
import { GoalWithCommitment, GoalStep } from './goalService';

export interface ScheduledTask {
  id: string;
  name: string;
  category: string;
  color: string;
  duration: string;
  day: number;
  hour: number;
  projectId?: string;
  stepId?: string;
  isProjectTask: boolean;
  progress?: number;
}

export interface TodayFocus {
  projectId: string;
  projectName: string;
  projectColor: string;
  tasks: GoalStep[];
  totalTasks: number;
  completedTasks: number;
  progress: number;
  timeBlock: string;
}

export interface WeeklyProgress {
  projectId: string;
  projectName: string;
  projectColor: string;
  weeklyHours: number;
  completedHours: number;
  progress: number;
  momentum: 'increasing' | 'decreasing' | 'stable';
}

export class CalendarService {
  // Get current user ID
  private static async getCurrentUserId(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      throw new Error('No authenticated user found');
    }
    return session.user.id;
  }

  // Get today's focus tasks based on project commitments
  static async getTodayFocus(): Promise<TodayFocus[]> {
    try {
      const userId = await this.getCurrentUserId();
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to 0-6 (Monday-Sunday)

      // Get all projects with their commitments and steps
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select(`
          id,
          title,
          category,
          weekly_hours,
          work_days,
          best_time,
          goal_steps (
            id,
            text,
            completed,
            order_index
          )
        `)
        .eq('user_id', userId);

      if (goalsError) {
        console.error('Error fetching goals:', goalsError);
        return [];
      }

      console.log('CalendarService: Found', goals?.length || 0, 'goals for user');

      const todayFocus: TodayFocus[] = [];

      goals?.forEach(goal => {
        const workDays = goal.work_days ? goal.work_days.split(',').map((d: string) => parseInt(d)) : [];
        
        // If no work days are set up, show all projects (for new users)
        const shouldShowToday = workDays.length === 0 || workDays.includes(adjustedDay);
        
        if (shouldShowToday) {
          console.log('CalendarService: Including project', goal.title, 'for today');
          const steps = (goal.goal_steps || []).map(step => ({
            ...step,
            goal_id: goal.id
          }));
          const completedTasks = steps.filter(step => step.completed).length;
          const totalTasks = steps.length;
          const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

          // Determine time block based on best_time preference
          let timeBlock = '9:00 AM - 12:00 PM'; // Default morning block
          if (goal.best_time === 'afternoon') {
            timeBlock = '1:00 PM - 4:00 PM';
          } else if (goal.best_time === 'evening') {
            timeBlock = '6:00 PM - 9:00 PM';
          }

          todayFocus.push({
            projectId: goal.id,
            projectName: goal.title,
            projectColor: this.getGoalColor(goal.category),
            tasks: steps,
            totalTasks,
            completedTasks,
            progress,
            timeBlock
          });
        }
      });

      // Sort by progress (lowest first) to prioritize projects that need attention
      return todayFocus.sort((a, b) => a.progress - b.progress);
    } catch (error) {
      console.error('Error getting today\'s focus:', error);
      return [];
    }
  }

  // Get weekly progress for momentum tracking
  static async getWeeklyProgress(): Promise<WeeklyProgress[]> {
    try {
      const userId = await this.getCurrentUserId();
      
      // Get start of current week (Monday)
      const today = new Date();
      const startOfWeek = new Date(today);
      const dayOfWeek = today.getDay();
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startOfWeek.setDate(today.getDate() - daysToSubtract);
      startOfWeek.setHours(0, 0, 0, 0);

      // Get all projects with their commitments
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select(`
          id,
          title,
          category,
          weekly_hours,
          goal_steps (
            id,
            completed,
            updated_at
          )
        `)
        .eq('user_id', userId);

      if (goalsError) {
        console.error('Error fetching goals:', goalsError);
        return [];
      }

      const weeklyProgress: WeeklyProgress[] = [];

      goals?.forEach(goal => {
        const steps = (goal.goal_steps || []).map(step => ({
          ...step,
          goal_id: goal.id
        }));
        const weeklyHours = goal.weekly_hours || 0;
        
        // Count tasks completed this week
        const completedThisWeek = steps.filter(step => {
          if (!step.completed || !step.updated_at) return false;
          const completedDate = new Date(step.updated_at);
          return completedDate >= startOfWeek;
        }).length;

        // Estimate completed hours (assuming 30 minutes per task)
        const completedHours = completedThisWeek * 0.5;
        const progress = weeklyHours > 0 ? Math.min((completedHours / weeklyHours) * 100, 100) : 0;

        // Determine momentum (simplified - could be enhanced with historical data)
        let momentum: 'increasing' | 'decreasing' | 'stable' = 'stable';
        if (completedHours > weeklyHours * 0.7) {
          momentum = 'increasing';
        } else if (completedHours < weeklyHours * 0.3) {
          momentum = 'decreasing';
        }

        weeklyProgress.push({
          projectId: goal.id,
          projectName: goal.title,
          projectColor: this.getGoalColor(goal.category),
          weeklyHours,
          completedHours,
          progress,
          momentum
        });
      });

      return weeklyProgress;
    } catch (error) {
      console.error('Error getting weekly progress:', error);
      return [];
    }
  }

  // Auto-schedule project tasks based on commitments
  static async getScheduledTasks(): Promise<ScheduledTask[]> {
    try {
      const userId = await this.getCurrentUserId();
      const todayFocus = await this.getTodayFocus();
      const scheduledTasks: ScheduledTask[] = [];

      todayFocus.forEach((focus, index) => {
        // Schedule incomplete tasks for this project
        const incompleteTasks = focus.tasks.filter(task => !task.completed);
        
        incompleteTasks.forEach((task, taskIndex) => {
          // Calculate time slot based on project's best time and work days
          let hour = 9; // Default morning
          if (focus.timeBlock.includes('1:00 PM')) {
            hour = 13;
          } else if (focus.timeBlock.includes('6:00 PM')) {
            hour = 18;
          }

          // Spread tasks across the week based on work days
          const workDays = [0, 1, 2, 3, 4]; // Monday to Friday
          const dayIndex = workDays[index % workDays.length];

          scheduledTasks.push({
            id: `project-${focus.projectId}-${task.id}`,
            name: task.text,
            category: focus.projectName,
            color: focus.projectColor,
            duration: '2 hours',
            day: dayIndex,
            hour: hour + (taskIndex * 2), // Spread tasks by 2-hour blocks
            projectId: focus.projectId,
            stepId: task.id,
            isProjectTask: true,
            progress: focus.progress
          });
        });
      });

      // Also get existing manual tasks
      const { data: manualTasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('hour', { ascending: true });

      if (!tasksError && manualTasks) {
        manualTasks.forEach(task => {
          scheduledTasks.push({
            id: task.id,
            name: task.name,
            category: task.category,
            color: task.color,
            duration: task.duration,
            day: task.day,
            hour: task.hour,
            isProjectTask: false
          });
        });
      }

      return scheduledTasks;
    } catch (error) {
      console.error('Error getting scheduled tasks:', error);
      return [];
    }
  }

  // Mark a project task as completed
  static async completeProjectTask(stepId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('goal_steps')
        .update({ 
          completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', stepId);

      if (error) {
        console.error('Error completing task:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error completing project task:', error);
      return false;
    }
  }

  // Helper method to get goal color based on category
  private static getGoalColor(category: string): string {
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
  }
} 