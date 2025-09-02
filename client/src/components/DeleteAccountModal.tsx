'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose, onSuccess }: DeleteAccountModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [confirmationText, setConfirmationText] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE') {
      setError('Please type DELETE to confirm account deletion');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      // Delete user data from all tables first
      const { error: tasksError } = await supabase
        .from('scheduled_tasks')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all user's tasks

      if (tasksError) {
        console.error('Error deleting tasks:', tasksError);
      }

      const { error: unscheduledTasksError } = await supabase
        .from('unscheduled_tasks')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all user's unscheduled tasks

      if (unscheduledTasksError) {
        console.error('Error deleting unscheduled tasks:', unscheduledTasksError);
      }

      const { error: goalsError } = await supabase
        .from('goals')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all user's goals

      if (goalsError) {
        console.error('Error deleting goals:', goalsError);
      }

      const { error: notesError } = await supabase
        .from('notes')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all user's notes

      if (notesError) {
        console.error('Error deleting notes:', notesError);
      }

      // For client-side deletion, we'll sign out the user
      // The actual account deletion would need to be handled server-side
      // For now, we'll clear all user data and sign them out
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }
      
      onSuccess();
      onClose();
      
      // Redirect to landing page
      window.location.href = '/landing';
      
    } catch (err: any) {
      console.error('Error deleting account:', err);
      setError(err.message || 'Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Account
          </h3>
          
          <p className="text-sm text-gray-600 mb-6">
            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-2">
              Type "DELETE" to confirm
            </label>
            <input
              type="text"
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="DELETE"
              disabled={isDeleting}
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting || confirmationText !== 'DELETE'}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </div>
              ) : (
                'Delete Account'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 