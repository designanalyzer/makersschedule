import { supabase } from '../lib/supabase';

export interface UserPreferences {
  id?: string;
  user_id: string;
  default_page_desktop: string;
  default_page_mobile: string;
  display_name?: string;
  created_at?: string;
  updated_at?: string;
}

export const userPreferencesService = {
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      console.log('Fetching preferences for user:', userId);
      
      // Check authentication status
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication error: ' + sessionError.message);
      }
      
      if (!session) {
        console.error('No active session found');
        throw new Error('No active session found');
      }
      
      console.log('Session user ID:', session.user.id);
      console.log('Requested user ID:', userId);
      
      if (session.user.id !== userId) {
        console.error('Session user ID does not match requested user ID');
        throw new Error('User ID mismatch');
      }
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No preferences found, return default values
          console.log('No preferences found for user, returning defaults');
          return {
            user_id: userId,
            default_page_desktop: 'calendar',
            default_page_mobile: 'calendar',
          };
        }
        // For other errors, log but don't throw
        console.log('Error fetching preferences, using defaults:', error.code);
        return {
          user_id: userId,
          default_page_desktop: 'calendar',
          default_page_mobile: 'calendar',
        };
      }

      console.log('Preferences fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching user preferences:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      // Return default values if there's an error
      return {
        user_id: userId,
        default_page_desktop: 'calendar',
        default_page_mobile: 'calendar',
      };
    }
  },

  async updateUserPreferences(preferences: UserPreferences): Promise<UserPreferences | null> {
    try {
      console.log('Saving preferences:', JSON.stringify(preferences, null, 2));
      
      // Check authentication status
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication error: ' + sessionError.message);
      }
      
      if (!session) {
        console.error('No active session found');
        throw new Error('No active session found');
      }
      
      console.log('Session user ID:', session.user.id);
      console.log('Preferences user ID:', preferences.user_id);
      
      if (session.user.id !== preferences.user_id) {
        console.error('Session user ID does not match preferences user ID');
        throw new Error('User ID mismatch');
      }
      
      // Validate required fields
      if (!preferences.user_id) {
        throw new Error('user_id is required');
      }
      if (!preferences.default_page_desktop) {
        throw new Error('default_page_desktop is required');
      }
      if (!preferences.default_page_mobile) {
        throw new Error('default_page_mobile is required');
      }
      
      // First, try to get existing preferences to see if we need to insert or update
      const { data: existingData, error: fetchError } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', preferences.user_id)
        .single();

      let result;
      
      if (fetchError && fetchError.code === 'PGRST116') {
        // No existing record, insert new one
        console.log('No existing preferences found, inserting new record');
        const { data, error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: preferences.user_id,
            default_page_desktop: preferences.default_page_desktop,
            default_page_mobile: preferences.default_page_mobile,
            display_name: preferences.display_name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase error inserting preferences:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            fullError: error
          });
          throw error;
        }
        
        result = data;
      } else if (fetchError) {
        // Some other error occurred
        console.error('Supabase error fetching existing preferences:', {
          code: fetchError.code,
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint,
          fullError: fetchError
        });
        throw fetchError;
      } else {
        // Existing record found, update it
        console.log('Existing preferences found, updating record');
        const { data, error } = await supabase
          .from('user_preferences')
          .update({
            default_page_desktop: preferences.default_page_desktop,
            default_page_mobile: preferences.default_page_mobile,
            display_name: preferences.display_name,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', preferences.user_id)
          .select()
          .single();

        if (error) {
          console.error('Supabase error updating preferences:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            fullError: error
          });
          throw error;
        }
        
        result = data;
      }
      
      console.log('Preferences saved successfully:', result);
      return result;
    } catch (error) {
      console.error('Error updating user preferences:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        preferences: preferences
      });
      return null;
    }
  },

  async getDefaultPage(userId: string, isMobile: boolean = false): Promise<string> {
    try {
      const preferences = await this.getUserPreferences(userId);
      if (!preferences) return 'calendar';
      
      return isMobile ? preferences.default_page_mobile : preferences.default_page_desktop;
    } catch (error) {
      console.error('Error getting default page:', error);
      return 'calendar';
    }
  },
}; 