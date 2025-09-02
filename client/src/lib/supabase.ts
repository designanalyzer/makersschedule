import { createClient } from '@supabase/supabase-js'

// Supabase credentials - must be set in environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Only log in development
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase configured successfully')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string
          color: string
          duration: string
          day: number
          hour: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: string
          color: string
          duration: string
          day: number
          hour: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string
          color?: string
          duration?: string
          day?: number
          hour?: number
          created_at?: string
          updated_at?: string
        }
      }
      unscheduled_tasks: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string
          color: string
          duration: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: string
          color: string
          duration: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string
          color?: string
          duration?: string
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category: string
          progress: number
          deadline: string
          status: string
          timeline: number
          effort: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          category: string
          progress?: number
          deadline: string
          status?: string
          timeline: number
          effort: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          category?: string
          progress?: number
          deadline?: string
          status?: string
          timeline?: number
          effort?: number
          created_at?: string
          updated_at?: string
        }
      }
      goal_steps: {
        Row: {
          id: string
          goal_id: string
          text: string
          completed: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          goal_id: string
          text: string
          completed?: boolean
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          goal_id?: string
          text?: string
          completed?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          default_page_desktop: string
          default_page_mobile: string
          display_name?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          default_page_desktop: string
          default_page_mobile: string
          display_name?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          default_page_desktop?: string
          default_page_mobile?: string
          display_name?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 