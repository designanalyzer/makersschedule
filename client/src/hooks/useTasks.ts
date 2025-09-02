import { useState, useEffect, useCallback } from 'react';
import { ScheduledTask, UnscheduledTask, taskService, unscheduledTaskService, ensureTaskColor } from '../services/taskService';

// Cache for tasks to prevent re-fetching on tab switches
let tasksCache: {
  scheduled: ScheduledTask[];
  unscheduled: UnscheduledTask[];
  lastFetched: number;
} | null = null;

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes - longer cache for better performance

export function useTasks() {
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);
  const [unscheduledTasks, setUnscheduledTasks] = useState<UnscheduledTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async (forceRefresh = false) => {
    // Check cache first - show cached data immediately if available
    if (tasksCache && (Date.now() - tasksCache.lastFetched) < CACHE_DURATION) {
      setScheduledTasks(tasksCache.scheduled);
      setUnscheduledTasks(tasksCache.unscheduled);
      setLoading(false);
      
      // If not forcing refresh, return early
      if (!forceRefresh) {
        return;
      }
    }

    try {
      // Don't show loading state if we have cached data
      if (!tasksCache) {
        setLoading(true);
      }
      setError(null);
      
      const [scheduled, unscheduled, projectTasks] = await Promise.all([
        taskService.getScheduledTasks(),
        unscheduledTaskService.getUnscheduledTasks(),
        unscheduledTaskService.getProjectTasksForSidebar()
      ]);

      const processedScheduled = scheduled.map(ensureTaskColor);
      const processedUnscheduled = [...unscheduled, ...projectTasks].map(ensureTaskColor);

      // Update cache
      tasksCache = {
        scheduled: processedScheduled,
        unscheduled: processedUnscheduled,
        lastFetched: Date.now()
      };

      setScheduledTasks(processedScheduled);
      setUnscheduledTasks(processedUnscheduled);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTasks = useCallback(() => {
    loadTasks(true);
  }, [loadTasks]);

  const backgroundRefresh = useCallback(async () => {
    // Refresh data in background without showing loading state
    if (tasksCache && (Date.now() - tasksCache.lastFetched) < CACHE_DURATION) {
      return; // Don't refresh if cache is still valid
    }
    
    try {
      const [scheduled, unscheduled, projectTasks] = await Promise.all([
        taskService.getScheduledTasks(),
        unscheduledTaskService.getUnscheduledTasks(),
        unscheduledTaskService.getProjectTasksForSidebar()
      ]);

      const processedScheduled = scheduled.map(ensureTaskColor);
      const processedUnscheduled = [...unscheduled, ...projectTasks].map(ensureTaskColor);

      // Update cache silently
      tasksCache = {
        scheduled: processedScheduled,
        unscheduled: processedUnscheduled,
        lastFetched: Date.now()
      };

      setScheduledTasks(processedScheduled);
      setUnscheduledTasks(processedUnscheduled);
    } catch (err) {
      console.error('Background refresh failed:', err);
      // Don't show error for background refresh
    }
  }, []);

  const updateScheduledTasks = useCallback((newTasks: ScheduledTask[]) => {
    setScheduledTasks(newTasks);
    // Update cache
    if (tasksCache) {
      tasksCache.scheduled = newTasks;
      tasksCache.lastFetched = Date.now();
    }
  }, []);

  const updateUnscheduledTasks = useCallback((newTasks: UnscheduledTask[]) => {
    setUnscheduledTasks(newTasks);
    // Update cache
    if (tasksCache) {
      tasksCache.unscheduled = newTasks;
      tasksCache.lastFetched = Date.now();
    }
  }, []);

  // Load tasks on mount - start immediately
  useEffect(() => {
    // Start loading tasks immediately
    loadTasks();
    
    // Also try to preload in background for faster subsequent loads
    if (!tasksCache) {
      const preloadTimer = setTimeout(() => {
        backgroundRefresh();
      }, 100);
      
      return () => clearTimeout(preloadTimer);
    }
  }, [loadTasks, backgroundRefresh]);

  // Listen for task changes from other components
  useEffect(() => {
    const handleTaskChange = () => {
      refreshTasks();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        backgroundRefresh(); // Refresh when tab becomes visible
      }
    };

    const handleFocus = () => {
      backgroundRefresh(); // Refresh when window gains focus
    };

    window.addEventListener('taskMoved', handleTaskChange);
    window.addEventListener('taskAdded', handleTaskChange);
    window.addEventListener('projectUpdated', handleTaskChange);
    window.addEventListener('projectAdded', handleTaskChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('taskMoved', handleTaskChange);
      window.removeEventListener('taskAdded', handleTaskChange);
      window.removeEventListener('projectUpdated', handleTaskChange);
      window.removeEventListener('projectAdded', handleTaskChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshTasks, backgroundRefresh]);

  return {
    scheduledTasks,
    unscheduledTasks,
    loading,
    error,
    refreshTasks,
    backgroundRefresh,
    updateScheduledTasks,
    updateUnscheduledTasks
  };
}
