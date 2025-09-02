import { supabase } from '../lib/supabase';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  deadline: string;
  status: string;
  timeline: number;
  effort: number;
  start_date: string;
  weekly_hours?: number;
  work_days?: string;
  best_time?: string;
  created_at?: string;
  updated_at?: string;
}

// Frontend interface with camelCase property names
export interface GoalWithCommitment extends Omit<Goal, 'weekly_hours' | 'work_days' | 'best_time'> {
  weeklyHours?: number;
  workDays?: string;
  bestTime?: string;
}

// Helper function to convert database Goal to frontend GoalWithCommitment
function mapGoalToFrontend(goal: Goal): GoalWithCommitment {
  console.log('Mapping goal from database:', {
    id: goal.id,
    title: goal.title,
    start_date: goal.start_date,
    timeline: goal.timeline,
    weekly_hours: goal.weekly_hours,
    work_days: goal.work_days,
    best_time: goal.best_time,
  });
  const mapped = {
    ...goal,
    weeklyHours: goal.weekly_hours,
    workDays: goal.work_days,
    bestTime: goal.best_time,
  };
  console.log('Mapped to frontend format:', {
    id: mapped.id,
    title: mapped.title,
    start_date: mapped.start_date,
    timeline: mapped.timeline,
    weeklyHours: mapped.weeklyHours,
    workDays: mapped.workDays,
    bestTime: mapped.bestTime,
  });
  return mapped;
}

export interface GoalStep {
  id: string;
  goal_id: string;
  text: string;
  completed: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateGoalInput {
  title: string;
  description: string;
  category: string;
  timeline: number;
  startDate: string;
  weeklyHours?: number;
  workDays?: string;
  bestTime?: string;
}

export interface UpdateGoalProgressInput {
  goalId: string;
  progress: number;
}

// Pagination interface
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Cache for goals and steps
const goalCache = new Map<string, { data: any; timestamp: number }>();
const stepsCache = new Map<string, { data: GoalStep[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export class GoalService {
  // Get the current user ID from Supabase auth
  private static async getCurrentUserId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user.id;
  }

  // Clear cache for a specific goal
  private static clearGoalCache(goalId?: string) {
    if (goalId) {
      goalCache.delete(goalId);
      stepsCache.delete(goalId);
    } else {
      goalCache.clear();
      stepsCache.clear();
    }
  }

  // Get cached data or null if expired
  private static getCachedData<T>(cache: Map<string, { data: T; timestamp: number }>, key: string): T | null {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  // Set cache data with cleanup
  private static setCachedData<T>(cache: Map<string, { data: T; timestamp: number }>, key: string, data: T) {
    // Clean up expired entries before adding new data
    this.cleanupCache(cache);
    cache.set(key, { data, timestamp: Date.now() });
  }

  // Clean up expired cache entries
  private static cleanupCache<T>(cache: Map<string, { data: T; timestamp: number }>) {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        cache.delete(key);
      }
    }
  }

  // Get all goals for the current user with pagination
  static async getGoals(params: PaginationParams = { page: 1, limit: 10 }): Promise<PaginatedResponse<GoalWithCommitment>> {
    try {
      const userId = await this.getCurrentUserId();
      const cacheKey = `goals_${userId}_${params.page}_${params.limit}`;
      
      // Check cache first
      const cached = this.getCachedData(goalCache, cacheKey);
      if (cached) {
        return cached;
      }

      console.log('Fetching goals for user:', userId, 'with pagination:', params);
      
      // Get total count
      const { count, error: countError } = await supabase
        .from('goals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) {
        console.error('Error counting goals:', countError);
        throw countError;
      }

      // Get paginated goals
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range((params.page - 1) * params.limit, params.page * params.limit - 1);

      if (error) {
        console.error('Error fetching goals:', error);
        throw error;
      }

      const mappedGoals = (data || []).map(mapGoalToFrontend);
      const total = count || 0;
      const totalPages = Math.ceil(total / params.limit);

      const result: PaginatedResponse<GoalWithCommitment> = {
        data: mappedGoals,
        total,
        page: params.page,
        limit: params.limit,
        totalPages
      };

      // Cache the result
      this.setCachedData(goalCache, cacheKey, result);
      
      console.log('Goals fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('Error fetching goals:', error);
      return { data: [], total: 0, page: params.page, limit: params.limit, totalPages: 0 };
    }
  }

  // Get all goals with their steps for the current user (optimized with single query)
  static async getGoalsWithSteps(params: PaginationParams = { page: 1, limit: 10 }): Promise<{ goals: GoalWithCommitment[]; stepsByGoalId: { [goalId: string]: GoalStep[] }; total: number; totalPages: number }> {
    try {
      const userId = await this.getCurrentUserId();
      const cacheKey = `goals_with_steps_${userId}_${params.page}_${params.limit}`;
      
      // Check cache first
      const cached = this.getCachedData(goalCache, cacheKey);
      if (cached) {
        return cached;
      }

      console.log('Fetching goals with steps for user:', userId, 'with pagination:', params);
      
      // Single query to get goals with steps using a join
      const { data, error, count } = await supabase
        .from('goals')
        .select(`
          *,
          goal_steps(*)
        `, { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range((params.page - 1) * params.limit, params.page * params.limit - 1);

      if (error) {
        console.error('Error fetching goals with steps:', error);
        throw error;
      }

      const goals = (data || []).map(goal => {
        const mappedGoal = mapGoalToFrontend(goal);
        // Remove the goal_steps from the goal object since we'll handle it separately
        const { goal_steps, ...goalWithoutSteps } = mappedGoal as any;
        return goalWithoutSteps;
      });

      // Group steps by goal ID
      const stepsByGoalId: { [goalId: string]: GoalStep[] } = {};
      (data || []).forEach(goal => {
        if (goal.goal_steps && Array.isArray(goal.goal_steps)) {
          stepsByGoalId[goal.id] = goal.goal_steps.sort((a: any, b: any) => a.order_index - b.order_index);
        } else {
          stepsByGoalId[goal.id] = [];
        }
      });

      const total = count || 0;
      const totalPages = Math.ceil(total / params.limit);

      const result = { goals, stepsByGoalId, total, totalPages };

      // Cache the result
      this.setCachedData(goalCache, cacheKey, result);

      console.log('Goals with steps fetched successfully:', {
        goalsCount: goals.length,
        stepsCount: Object.keys(stepsByGoalId).length,
        total,
        totalPages
      });
      return result;
    } catch (error) {
      console.error('Error fetching goals with steps:', error);
      return { goals: [], stepsByGoalId: {}, total: 0, totalPages: 0 };
    }
  }

  // Get a specific goal with its steps (with caching)
  static async getGoalWithSteps(goalId: string): Promise<{ goal: Goal | null; steps: GoalStep[] }> {
    try {
      const userId = await this.getCurrentUserId();
      
      // Check cache first
      const cachedSteps = this.getCachedData(stepsCache, goalId);
      if (cachedSteps) {
        // Get goal from cache or fetch if needed
        const cachedGoal = this.getCachedData(goalCache, goalId);
        if (cachedGoal) {
          return { goal: cachedGoal, steps: cachedSteps };
        }
      }
      
      // Get the goal
      const { data: goalData, error: goalError } = await supabase
        .from('goals')
        .select('*')
        .eq('id', goalId)
        .eq('user_id', userId)
        .single();

      if (goalError) {
        console.error('Error fetching goal:', goalError);
        return { goal: null, steps: [] };
      }

      // Get the steps for this goal
      const { data: stepsData, error: stepsError } = await supabase
        .from('goal_steps')
        .select('*')
        .eq('goal_id', goalId)
        .order('order_index', { ascending: true });

      if (stepsError) {
        console.error('Error fetching goal steps:', stepsError);
        return { goal: goalData, steps: [] };
      }

      const steps = stepsData || [];

      // Cache the results
      this.setCachedData(goalCache, goalId, goalData);
      this.setCachedData(stepsCache, goalId, steps);

      return { goal: goalData, steps };
    } catch (error) {
      console.error('Error fetching goal with steps:', error);
      return { goal: null, steps: [] };
    }
  }

  // Create a new goal
  static async createGoal(goalData: CreateGoalInput): Promise<GoalWithCommitment | null> {
    try {
      const userId = await this.getCurrentUserId();
      
      // Calculate deadline based on start date + timeline
      const startDate = new Date(goalData.startDate);
      const deadline = new Date(startDate);
      deadline.setMonth(deadline.getMonth() + goalData.timeline);

      console.log('Creating goal with data:', { 
        userId, 
        goalData, 
        startDate: goalData.startDate,
        deadline: deadline.toISOString().split('T')[0] 
      });

      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: userId,
          title: goalData.title,
          description: goalData.description,
          category: goalData.category,
          progress: 0,
          deadline: deadline.toISOString().split('T')[0],
          status: 'not-started',
          timeline: goalData.timeline,
          effort: 5, // Default to 5 hours per week
          start_date: goalData.startDate,
          weekly_hours: goalData.weeklyHours,
          work_days: goalData.workDays,
          best_time: goalData.bestTime,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating goal:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw new Error(`Database error: ${error.message || 'Unknown error'}`);
      }

      console.log('Goal created successfully:', data);
      
      // Clear cache to reflect new goal
      this.clearGoalCache();
      
      return mapGoalToFrontend(data);
    } catch (error: any) {
      console.error('Error creating goal:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error?.message);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      if (error.message === 'User not authenticated') {
        throw new Error('Please log in to create a project');
      }
      throw error;
    }
  }

  // Update goal progress
  static async updateGoalProgress(goalId: string, progress: number): Promise<Goal | null> {
    try {
      const userId = await this.getCurrentUserId();
      const status = progress >= 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started';
      
      const { data, error } = await supabase
        .from('goals')
        .update({
          progress,
          status,
        })
        .eq('id', goalId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating goal progress:', error);
        return null;
      }

      // Clear cache for this goal
      this.clearGoalCache(goalId);

      return data;
    } catch (error) {
      console.error('Error updating goal progress:', error);
      return null;
    }
  }

  // Update goal details
  static async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal | null> {
    try {
      const userId = await this.getCurrentUserId();
      
      console.log('GoalService updating goal:', {
        goalId,
        userId,
        updates
      });
      
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', goalId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating goal:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return null;
      }

      console.log('Goal updated successfully:', {
        id: data.id,
        title: data.title,
        start_date: data.start_date,
        timeline: data.timeline,
        weekly_hours: data.weekly_hours,
        work_days: data.work_days,
        best_time: data.best_time,
      });

      // Clear cache for this goal
      this.clearGoalCache(goalId);

      return data;
    } catch (error) {
      console.error('Error updating goal:', error);
      return null;
    }
  }

  // Delete a goal
  static async deleteGoal(goalId: string): Promise<boolean> {
    try {
      const userId = await this.getCurrentUserId();
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting goal:', error);
        return false;
      }

      // Clear cache for this goal and general cache
      this.clearGoalCache(goalId);
      this.clearGoalCache();

      return true;
    } catch (error) {
      console.error('Error deleting goal:', error);
      return false;
    }
  }

  // Create a goal step
  static async createGoalStep(goalId: string, text: string, orderIndex: number, completed: boolean = false): Promise<GoalStep | null> {
    try {
      console.log('Creating goal step with data:', { goalId, text, orderIndex });
      
      const { data, error } = await supabase
        .from('goal_steps')
        .insert({
          goal_id: goalId,
          text,
          completed,
          order_index: orderIndex,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating goal step:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        return null;
      }

      console.log('Goal step created successfully:', data);
      
      // Clear cache for this goal
      this.clearGoalCache(goalId);
      
      return data;
    } catch (error: any) {
      console.error('Exception creating goal step:', error);
      console.error('Exception type:', typeof error);
      console.error('Exception message:', error?.message);
      console.error('Full exception:', JSON.stringify(error, null, 2));
      return null;
    }
  }

  // Update a goal step
  static async updateGoalStep(stepId: string, updates: Partial<GoalStep>): Promise<GoalStep | null> {
    try {
      const { data, error } = await supabase
        .from('goal_steps')
        .update(updates)
        .eq('id', stepId)
        .select()
        .single();

      if (error) {
        console.error('Error updating goal step:', error);
        return null;
      }

      // Clear cache for the goal this step belongs to
      if (data) {
        this.clearGoalCache(data.goal_id);
      }

      return data;
    } catch (error) {
      console.error('Error updating goal step:', error);
      return null;
    }
  }

  // Delete a goal step
  static async deleteGoalStep(stepId: string): Promise<boolean> {
    try {
      // Get the goal ID before deleting
      const { data: stepData } = await supabase
        .from('goal_steps')
        .select('goal_id')
        .eq('id', stepId)
        .single();

      const { error } = await supabase
        .from('goal_steps')
        .delete()
        .eq('id', stepId);

      if (error) {
        console.error('Error deleting goal step:', error);
        return false;
      }

      // Clear cache for the goal this step belonged to
      if (stepData) {
        this.clearGoalCache(stepData.goal_id);
      }

      return true;
    } catch (error) {
      console.error('Error deleting goal step:', error);
      return false;
    }
  }

  // Get tasks associated with a goal
  static async getGoalTasks(goalId: string): Promise<any[]> {
    // This would fetch tasks that are linked to this goal
    // Implementation depends on your task-goal relationship structure
    return [];
  }

  // Calculate goal progress based on completed steps
  static async calculateGoalProgress(goalId: string): Promise<number> {
    // This would calculate progress based on completed steps
    return 0;
  }

  // Update goal progress based on task completion
  static async updateProgressFromTasks(goalId: string): Promise<void> {
    // This would update goal progress when related tasks are completed
  }

  // Schedule goal tasks
  static async scheduleGoalTasks(goalId: string): Promise<void> {
    // This would schedule tasks based on goal steps
  }

  // Mark a step as completed when a task is done
  static async markStepCompleted(goalId: string, taskName: string): Promise<void> {
    // This would mark a step as completed when a related task is done
  }

  // Sync all steps for a goal (create, update, delete as needed)
  static async syncGoalSteps(goalId: string, steps: { id?: string; text: string; completed: boolean; order_index: number }[]): Promise<boolean> {
    try {
      console.log('Syncing steps for goal:', goalId, 'with', steps.length, 'steps');
      
      // Get existing steps for this goal
      const { data: existingSteps, error: fetchError } = await supabase
        .from('goal_steps')
        .select('*')
        .eq('goal_id', goalId)
        .order('order_index', { ascending: true });

      if (fetchError) {
        console.error('Error fetching existing steps:', fetchError);
        return false;
      }

      const existingStepsList = existingSteps || [];
      console.log('Found', existingStepsList.length, 'existing steps');

      // Filter out empty steps
      const nonEmptySteps = steps.filter(step => step.text.trim() !== '');
      console.log('Processing', nonEmptySteps.length, 'non-empty steps');
      
      // Create a map of existing steps by ID for quick lookup
      const existingStepsMap = new Map(existingStepsList.map(step => [step.id, step]));
      
      // Process each step
      for (let i = 0; i < nonEmptySteps.length; i++) {
        const step = nonEmptySteps[i];
        const orderIndex = i + 1;
        
        if (step.id && step.id.startsWith('temp-')) {
          // This is a new step, create it
          console.log('Creating new step:', step.text);
          const newStep = await this.createGoalStep(goalId, step.text, orderIndex, step.completed);
          if (!newStep) {
            console.error('Failed to create step:', step.text);
            return false;
          }
        } else if (step.id && existingStepsMap.has(step.id)) {
          // This is an existing step, update it
          console.log('Updating existing step:', step.id, step.text);
          const updatedStep = await this.updateGoalStep(step.id, {
            text: step.text,
            completed: step.completed,
            order_index: orderIndex
          });
          if (!updatedStep) {
            console.error('Failed to update step:', step.id);
            return false;
          }
        } else if (!step.id) {
          // No ID, create new step
          console.log('Creating new step without ID:', step.text);
          const newStep = await this.createGoalStep(goalId, step.text, orderIndex, step.completed);
          if (!newStep) {
            console.error('Failed to create step:', step.text);
            return false;
          }
        }
      }

      // Delete any steps that are no longer in the list
      const currentStepIds = nonEmptySteps.map(step => step.id).filter(id => id && !id.startsWith('temp-'));
      for (const existingStep of existingStepsList) {
        if (!currentStepIds.includes(existingStep.id)) {
          console.log('Deleting step:', existingStep.id, existingStep.text);
          await this.deleteGoalStep(existingStep.id);
        }
      }

      console.log('Steps synced successfully for goal:', goalId);
      
      // Clear cache for this goal and all related caches
      this.clearGoalCache(goalId);
      
      // Also clear the steps cache specifically
      stepsCache.delete(goalId);
      
      // Clear any cached goals with steps
      const cacheKeysToDelete: string[] = [];
      goalCache.forEach((_, key) => {
        if (key.includes('goals_with_steps')) {
          cacheKeysToDelete.push(key);
        }
      });
      cacheKeysToDelete.forEach(key => goalCache.delete(key));
      
      return true;
    } catch (error) {
      console.error('Error syncing steps:', error);
      return false;
    }
  }

  // Efficient step order update - single database operation
  static async updateStepOrder(goalId: string, steps: { id?: string; text: string; completed: boolean; order_index: number }[]): Promise<boolean> {
    try {
      // Use a single transaction to update all steps
      const updates = steps
        .filter(step => step.id && !step.id.startsWith('temp-'))
        .map(step => ({
          id: step.id,
          order_index: step.order_index
        }));

      if (updates.length === 0) return true;

      // Batch update all step orders in one operation
      const { error } = await supabase
        .from('goal_steps')
        .upsert(updates, { onConflict: 'id' });

      if (error) {
        console.error('Error updating step order:', error);
        return false;
      }

      // Clear only the specific goal cache
      this.clearGoalCache(goalId);
      stepsCache.delete(goalId);

      return true;
    } catch (error) {
      console.error('Error updating step order:', error);
      return false;
    }
  }

  // Force refresh all caches for a specific goal
  static async forceRefreshGoal(goalId: string): Promise<void> {
    console.log('Force refreshing goal:', goalId);
    this.clearGoalCache(goalId);
    stepsCache.delete(goalId);
    
    // Clear any cached goals with steps
    const cacheKeysToDelete: string[] = [];
    goalCache.forEach((_, key) => {
      if (key.includes('goals_with_steps')) {
        cacheKeysToDelete.push(key);
      }
    });
    cacheKeysToDelete.forEach(key => goalCache.delete(key));
  }

  // Helper method to get goal color based on category
  private static getGoalColor(category: string): string {
    const colors: { [key: string]: string } = {
      'fitness': 'bg-blue-100 text-blue-800',
      'learning': 'bg-purple-100 text-purple-800',
      'business': 'bg-green-100 text-green-800',
      'finance': 'bg-yellow-100 text-yellow-800',
      'travel': 'bg-teal-100 text-teal-800',
      'creative': 'bg-pink-100 text-pink-800',
      'health': 'bg-red-100 text-red-800',
      'career': 'bg-indigo-100 text-indigo-800',
      'relationships': 'bg-orange-100 text-orange-800',
      'personal': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  }
} 