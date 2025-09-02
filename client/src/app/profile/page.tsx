'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userPreferencesService, UserPreferences } from '../../services/userPreferencesService';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import DeleteAccountModal from '../../components/DeleteAccountModal';
import AuthGuard from '../../components/AuthGuard';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    username: user?.user_metadata?.full_name || 'Demo User',
    email: user?.email || 'demo@example.com',
    defaultPageDesktop: 'calendar',
    defaultPageMobile: 'calendar'
  });

  // Load user preferences on component mount
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (user?.id) {
        try {
          const preferences = await userPreferencesService.getUserPreferences(user.id);
          if (preferences) {
            setFormData(prev => ({
              ...prev,
              username: preferences.display_name || user?.user_metadata?.full_name || 'Demo User',
              defaultPageDesktop: preferences.default_page_desktop,
              defaultPageMobile: preferences.default_page_mobile
            }));
          }
        } catch (error) {
          console.error('Error loading user preferences:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadUserPreferences();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: value
      };
      
      // Auto-save preferences when default page settings change
      if ((name === 'defaultPageDesktop' || name === 'defaultPageMobile') && user?.id) {
        const preferences: UserPreferences = {
          user_id: user.id,
          default_page_desktop: name === 'defaultPageDesktop' ? value : updatedData.defaultPageDesktop,
          default_page_mobile: name === 'defaultPageMobile' ? value : updatedData.defaultPageMobile,
          display_name: updatedData.username,
        };
        
        userPreferencesService.updateUserPreferences(preferences).then(result => {
          if (result) {
            console.log('Preferences auto-saved successfully');
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 2000);
          } else {
            console.error('Failed to save preferences - no result returned');
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
          }
        }).catch(error => {
          console.error('Error auto-saving preferences:', error);
          setSaveStatus('error');
          setTimeout(() => setSaveStatus('idle'), 3000);
        });
      }
      
      return updatedData;
    });
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      const preferences: UserPreferences = {
        user_id: user.id,
        default_page_desktop: formData.defaultPageDesktop,
        default_page_mobile: formData.defaultPageMobile,
        display_name: formData.username,
      };

      const result = await userPreferencesService.updateUserPreferences(preferences);
      if (result) {
        console.log('Preferences saved successfully');
        setIsEditing(false);
      } else {
        console.error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reload preferences from server to reset any unsaved changes
    if (user?.id) {
      userPreferencesService.getUserPreferences(user.id).then(preferences => {
        if (preferences) {
          setFormData(prev => ({
            ...prev,
            username: preferences.display_name || user?.user_metadata?.full_name || 'Demo User',
            defaultPageDesktop: preferences.default_page_desktop,
            defaultPageMobile: preferences.default_page_mobile
          }));
        }
      });
    }
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleDeleteAccount = () => {
    setIsDeleteAccountModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card - Mobile: Full width, Desktop: Left column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              {/* Avatar */}
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-700">U</span>
              </div>
              
              {/* User Info */}
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{formData.username}</h2>
              <p className="text-gray-600 text-sm mb-4">{formData.email}</p>
              
              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Settings - Mobile: Full width, Desktop: Right column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Profile Settings */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Display Name</span>
                    <span className="text-sm font-medium text-gray-900">{formData.username}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Email</span>
                    <span className="text-sm font-medium text-gray-900">{formData.email}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Preferences */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
                {saveStatus === 'success' && (
                  <span className="text-sm text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Error saving
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="defaultPageDesktop" className="block text-sm font-medium text-gray-700 mb-1">
                    Default Page (Desktop)
                  </label>
                  <select
                    id="defaultPageDesktop"
                    name="defaultPageDesktop"
                    value={formData.defaultPageDesktop}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="calendar">Calendar</option>
                    <option value="projects">Projects</option>
                    <option value="notes">Notes</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">This is the page you'll see when you first open the app on desktop</p>
                </div>
                
                <div>
                  <label htmlFor="defaultPageMobile" className="block text-sm font-medium text-gray-700 mb-1">
                    Default Page (Mobile)
                  </label>
                  <select
                    id="defaultPageMobile"
                    name="defaultPageMobile"
                    value={formData.defaultPageMobile}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="calendar">Calendar</option>
                    <option value="projects">Projects</option>
                    <option value="notes">Notes</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">This is the page you'll see when you first open the app on mobile</p>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
              <div className="space-y-3">
                <button
                  onClick={handleChangePassword}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:border-black"
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* Account Actions */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleDeleteAccount}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:border-black"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSuccess={() => {
          console.log('Password changed successfully');
        }}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        onSuccess={() => {
          console.log('Account deleted successfully');
        }}
      />
      </div>
    </div>
  );
} 