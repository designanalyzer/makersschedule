'use client';

import React, { useState } from 'react';
import { Goal } from '../services/goalService';

const PROJECT_TAGS = [
  { label: 'Creative', value: 'creative', color: 'bg-pink-100 text-pink-900' },
  { label: 'Technical', value: 'technical', color: 'bg-blue-100 text-blue-900' },
  { label: 'Learning', value: 'learning', color: 'bg-yellow-100 text-yellow-900' },
  { label: 'Side Hustle', value: 'sidehustle', color: 'bg-purple-100 text-purple-900' },
  { label: 'Work', value: 'work', color: 'bg-green-100 text-green-900' },
  { label: 'Health', value: 'health', color: 'bg-teal-100 text-teal-900' },
  { label: 'Finance', value: 'finance', color: 'bg-orange-100 text-orange-900' },
  { label: 'Custom', value: 'custom', color: 'bg-gray-100 text-gray-900' },
];

const generateAISteps = (projectName: string, description: string, category: string): string[] => {
  // Universal steps that work for ANY project
  return [
    'Map out your project\'s main steps. You can always add and edit new steps.',
    'Figure out a small task you can start with today.',
    'Go to the calendar page and continue putting commitments to calendar.'
  ];
};

interface NewProjectInput {
  name: string;
  description: string;
  category: string;
  timeline: number;
  startDate: string;
  weeklyHours?: number;
  workDays?: string;
  bestTime?: string;
  aiSteps?: string[];
}

const validateProjectInput = (input: NewProjectInput): { isValid: boolean; error?: string } => {
  if (!input.name.trim()) {
    return { isValid: false, error: 'Project name is required' };
  }
  
  if (input.name.length > 100) {
    return { isValid: false, error: 'Project name must be 100 characters or less' };
  }
  
  if (!input.description.trim()) {
    return { isValid: false, error: 'Project description is required' };
  }
  
  if (input.description.length > 500) {
    return { isValid: false, error: 'Project description must be 500 characters or less' };
  }
  
  if (!input.category) {
    return { isValid: false, error: 'Please select a project category' };
  }
  
  if (input.timeline < 1 || input.timeline > 60) {
    return { isValid: false, error: 'Timeline must be between 1 and 60 months' };
  }
  
  return { isValid: true };
};

interface AddProjectSidebarProps {
  onAddProject: (projectData: NewProjectInput) => void;
}

export default function AddProjectSidebar({ onAddProject }: AddProjectSidebarProps) {
  const [newProject, setNewProject] = useState<NewProjectInput>({
    name: '',
    description: '',
    category: '',
    timeline: 3,
    startDate: new Date().toISOString().split('T')[0] // Today's date as default
  });
  
  const [showAISteps, setShowAISteps] = useState(false);
  const [aiSteps, setAiSteps] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateProjectInput(newProject);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid input. Please check your project details.');
      return;
    }

    setIsCreating(true);
    setValidationError(null); // Clear any previous validation errors
    
    // Generate AI steps
    const generatedSteps = generateAISteps(newProject.name, newProject.description, newProject.category);
    setAiSteps(generatedSteps);
    
    // Add AI steps to the project data
    const projectWithSteps = {
      ...newProject,
      aiSteps: generatedSteps
    };
    
    // Show AI steps to user before creating project
    setShowAISteps(true);
    setIsCreating(false);
  };

  const handleConfirmProject = () => {
    const projectWithSteps = {
      ...newProject,
      aiSteps
    };
    
    onAddProject(projectWithSteps);
    
    // Reset form
    setNewProject({
      name: '',
      description: '',
      category: '',
      timeline: 3,
      startDate: new Date().toISOString().split('T')[0] // Today's date as default
    });
    setShowAISteps(false);
    setAiSteps([]);
  };

  const handleBackToForm = () => {
    setShowAISteps(false);
    setAiSteps([]);
    // Don't reset the form data - keep what the user already entered
  };

  // Regenerate AI steps when project data changes
  const handleProjectDataChange = (updates: Partial<NewProjectInput>) => {
    const updatedProject = { ...newProject, ...updates };
    setNewProject(updatedProject);
    
    // Clear validation error when user makes changes
    if (validationError) {
      setValidationError(null);
    }
    
    // If we're showing AI steps, regenerate them with the new data
    if (showAISteps) {
      const newSteps = generateAISteps(
        updatedProject.name, 
        updatedProject.description, 
        updatedProject.category
      );
      setAiSteps(newSteps);
    }
  };

  // Show AI steps confirmation screen
  if (showAISteps) {
    return (
      <div className="bg-white border-l border-r border-gray-200 p-6 w-80 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Help yourself succeed</h2>
        </div>

        {/* Project Commitment Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How many hours can you dedicate to this per week?
            </label>
            <select
              value={newProject.weeklyHours || 5}
              onChange={e => handleProjectDataChange({ weeklyHours: Number(e.target.value) })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value={1}>1 hour</option>
              <option value={2}>2 hours</option>
              <option value={3}>3 hours</option>
              <option value={4}>4 hours</option>
              <option value={5}>5 hours</option>
              <option value={10}>10 hours</option>
              <option value={15}>15 hours</option>
              <option value={20}>20 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              On what weekdays can you most likely work on this?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    const currentDays = newProject.workDays ? newProject.workDays.split(',') : [];
                    const dayLower = day.toLowerCase();
                    const newDays = currentDays.includes(dayLower) 
                      ? currentDays.filter(d => d !== dayLower)
                      : [...currentDays, dayLower];
                    handleProjectDataChange({ workDays: newDays.join(',') });
                  }}
                  className={`p-2 text-xs rounded-lg border transition-colors ${
                    newProject.workDays && newProject.workDays.includes(day.toLowerCase())
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What time of day do you do your best work?
            </label>
            <select
              value={newProject.bestTime || 'morning'}
              onChange={e => handleProjectDataChange({ bestTime: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black min-w-[120px]"
            >
              <option value="morning">Morning</option>
              <option value="midday">Mid-day</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleConfirmProject}
            className="w-full bg-[#DAFF7D] hover:bg-[#A3C900] text-[#222] py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-1 font-medium flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span>🚀 Create Project & Start doing!</span>
          </button>
          
          <button
            onClick={handleBackToForm}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-1 font-medium"
          >
            Back to Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-l border-r border-gray-200 p-6 w-80 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">What do you want to get done?</h2>
      </div>

      {/* Project Form - Embedded directly in sidebar */}
      <form onSubmit={handleAddProject} className="space-y-2">
        {/* Project Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PROJECT_TAGS.map(tag => (
              <button
                key={tag.value}
                type="button"
                onClick={() => handleProjectDataChange({ category: tag.value })}
                className={`p-2 text-xs rounded-lg border font-semibold flex items-center justify-center
                  ${tag.color}
                  ${newProject.category === tag.value ? 'border-black' : 'border-gray-200 hover:border-gray-300'}`}
              >
                {tag.label}
              </button>
            ))}
          </div>
          {validationError && !newProject.category && (
            <p className="text-red-600 text-xs mt-1">Please select a project category</p>
          )}
        </div>

        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
          </label>
          <input
            type="text"
            placeholder="Project name"
            value={newProject.name}
            onChange={e => handleProjectDataChange({ name: e.target.value })}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black ${
              validationError && !newProject.name.trim() ? 'border-red-300' : 'border-gray-300'
            }`}
            maxLength={100}
            style={{ fontSize: '14px' }}
          />
          {validationError && !newProject.name.trim() && (
            <p className="text-red-600 text-xs mt-1">Project name is required</p>
          )}
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            placeholder="Describe your project"
            value={newProject.description}
            onChange={e => handleProjectDataChange({ description: e.target.value })}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-none ${
              validationError && !newProject.description.trim() ? 'border-red-300' : 'border-gray-300'
            }`}
            rows={3}
            maxLength={500}
            style={{ fontSize: '14px' }}
          />
          {validationError && !newProject.description.trim() && (
            <p className="text-red-600 text-xs mt-1">Project description is required</p>
          )}
        </div>

        {/* Timeline and Start Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={newProject.startDate}
              onChange={e => handleProjectDataChange({ startDate: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timeline
            </label>
            <select
              value={newProject.timeline}
              onChange={e => handleProjectDataChange({ timeline: Number(e.target.value) })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value={1}>1 month</option>
              <option value={3}>3 months</option>
              <option value={6}>6 months</option>
              <option value={12}>1 year</option>
              <option value={18}>1.5 years</option>
              <option value={24}>2 years</option>
              <option value={36}>3 years</option>
              <option value={48}>4 years</option>
              <option value={60}>5 years</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCreating}
          className="w-full bg-[#DAFF7D] hover:bg-[#A3C900] text-[#222] py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-1 mt-4 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-[#222]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating Steps...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Project</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
} 