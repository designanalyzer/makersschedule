import { supabase } from '../lib/supabase';
import DOMPurify from 'dompurify';

export interface Note {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export class NotesService {
  // Test Supabase connection
  static async testConnection(): Promise<boolean> {
    try {
      console.log('Testing Supabase connection...');
      const { data, error } = await supabase
        .from('notes')
        .select('count')
        .limit(1);

      if (error) {
        console.error('Supabase connection test failed:', error);
        return false;
      }

      console.log('Supabase connection test successful');
      return true;
    } catch (error) {
      console.error('Supabase connection test error:', error);
      return false;
    }
  }

  // Load notes for the current user
  static async loadNotes(userId: string): Promise<Note[]> {
    try {
      console.log('Loading notes for user:', userId);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading notes:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Notes loaded successfully:', data);
      return data || [];
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }

  // Load a specific note by ID
  static async loadNote(userId: string, noteId: string): Promise<Note | null> {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', noteId)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error loading note:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error loading note:', error);
      return null;
    }
  }

  // Save a note (create or update)
  static async saveNote(userId: string, content: string, noteId?: string): Promise<Note | null> {
    try {
      const now = new Date().toISOString();
      // Sanitize the HTML content before saving
      const sanitizedContent = DOMPurify.sanitize(content);
      console.log('Saving note:', { userId, noteId, contentLength: content.length });
      // Test connection first
      const connectionOk = await this.testConnection();
      if (!connectionOk) {
        console.error('Supabase connection failed');
        return null;
      }
      if (noteId) {
        // Update existing note
        console.log('Updating existing note with ID:', noteId);
        const { data, error } = await supabase
          .from('notes')
          .update({
            content: sanitizedContent,
            updated_at: now,
          })
          .eq('id', noteId)
          .eq('user_id', userId)
          .select()
          .single();
        if (error) {
          console.error('Error updating note:', error);
          console.error('Update error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          return null;
        }
        console.log('Note updated successfully:', data);
        return data;
      }
      // Create new note
      console.log('Creating new note');
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: userId,
          content: sanitizedContent,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();
      if (error) {
        console.error('Error creating note:', error);
        console.error('Create error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return null;
      }
      console.log('Note created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error saving note:', error);
      return null;
    }
  }

  // Delete a note
  static async deleteNote(userId: string, noteId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', userId);
      if (error) {
        console.error('Error deleting note:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  }
}

export default NotesService; 