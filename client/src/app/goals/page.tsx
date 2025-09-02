"use client";

import React, { useState, useEffect } from 'react';
import { Goal, GoalWithCommitment } from '../../services/goalService';
import GoalCard from '../../components/GoalCard';
import { logger } from '../../utils/logger';
import { GoalService } from '../../services/goalService';
import AuthGuard from '../../components/AuthGuard';

// Example projects for demonstration
interface ExampleProject extends GoalWithCommitment {
  aiSteps: string[];
  effort: number;
}

const exampleProjects: ExampleProject[] = [
  {
    id: '1',
    user_id: 'demo-user',
    title: 'Learn React and TypeScript',
    description: 'Master modern web development with React and TypeScript to build better applications',
    category: 'learning',
    progress: 65,
    deadline: '2024-06-15',
    status: 'in-progress',
    timeline: 6,
    effort: 8,
    start_date: '2024-01-15',
    weeklyHours: 10,
    workDays: 'monday,wednesday,friday',
    bestTime: 'morning',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z',
    aiSteps: [
      'Set up your development environment (Node.js, VSCode, Git)',
      'Complete the official React and TypeScript tutorials',
      'Build a simple to-do app using React and TypeScript',
      'Learn about React hooks and state management',
      'Refactor an existing project to use TypeScript',
      'Deploy your project to Vercel or Netlify'
    ]
  },
  {
    id: '2',
    user_id: 'demo-user',
    title: 'Build a Fitness Routine',
    description: 'Create a sustainable workout plan and stick to it for better health and energy',
    category: 'fitness',
    progress: 30,
    deadline: '2024-08-20',
    status: 'in-progress',
    timeline: 8,
    effort: 5,
    start_date: '2024-02-01',
    weeklyHours: 5,
    workDays: 'monday,tuesday,thursday,friday',
    bestTime: 'morning',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-03-10T00:00:00Z',
    aiSteps: [
      'Assess your current fitness level and set goals',
      'Research and choose a workout program',
      'Create a weekly workout schedule',
      'Buy any needed equipment or gym membership',
      'Track your workouts and progress',
      'Adjust your plan every month based on results'
    ]
  },
  {
    id: '3',
    user_id: 'demo-user',
    title: 'Start a Side Business',
    description: 'Launch an online business selling digital products or services',
    category: 'business',
    progress: 15,
    deadline: '2024-12-31',
    status: 'not-started',
    timeline: 12,
    effort: 10,
    start_date: '2024-03-01',
    weeklyHours: 15,
    workDays: 'saturday,sunday',
    bestTime: 'evening',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
    aiSteps: [
      'Brainstorm and validate your business idea',
      'Register a domain and set up a simple website',
      'Create your first digital product or service',
      'Set up payment processing (Stripe, PayPal, etc.)',
      'Launch your business to friends and family',
      'Start marketing on social media and collect feedback'
    ]
  },
  {
    id: '4',
    user_id: 'demo-user',
    title: 'Learn to Play Guitar',
    description: 'Master basic guitar chords and learn to play favorite songs',
    category: 'hobbies',
    progress: 80,
    deadline: '2024-05-30',
    status: 'in-progress',
    timeline: 4,
    effort: 3,
    start_date: '2024-01-01',
    weeklyHours: 3,
    workDays: 'tuesday,thursday,saturday',
    bestTime: 'afternoon',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-03-20T00:00:00Z',
    aiSteps: [
      'Buy or borrow a guitar and tuner',
      'Learn how to tune your guitar',
      'Practice basic open chords (C, G, D, E, A, Em, Am)',
      'Learn to strum in rhythm with a metronome',
      'Play your first simple song',
      'Practice daily and track your progress'
    ]
  },
  {
    id: '5',
    user_id: 'demo-user',
    title: 'Save for Vacation',
    description: 'Save $5,000 for a dream vacation to Europe next summer',
    category: 'finance',
    progress: 45,
    deadline: '2024-11-30',
    status: 'in-progress',
    timeline: 10,
    effort: 2,
    start_date: '2024-01-01',
    weeklyHours: 2,
    workDays: 'monday,friday',
    bestTime: 'morning',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z',
    aiSteps: [
      'Set your savings goal and deadline',
      'Create a dedicated vacation savings account',
      'Automate monthly transfers to your savings',
      'Research and estimate travel costs',
      'Track your progress each month',
      'Book flights and accommodation when you reach your goal'
    ]
  }
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<GoalWithCommitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [useExampleData, setUseExampleData] = useState(false);

  // Load projects from localStorage
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await GoalService.getGoals();
        
        if (projectsData && projectsData.data && projectsData.data.length > 0) {
          console.log('Loaded real projects:', projectsData.data);
          setProjects(projectsData.data);
        } else {
          // If no projects found, use example data
          console.log('No real projects found, using example data');
          setProjects(exampleProjects);
          setUseExampleData(true);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        logger.error('Failed to load projects', 'ProjectsPage', { error });
        // Use example data if there's an error
        setProjects(exampleProjects);
        setUseExampleData(true);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Listen for project added events from the sidebar
  useEffect(() => {
    const handleProjectAdded = (event: CustomEvent) => {
      handleAddProject(event.detail);
    };

    window.addEventListener('projectAdded', handleProjectAdded as EventListener);
    
    return () => {
      window.removeEventListener('projectAdded', handleProjectAdded as EventListener);
    };
  }, []);

  const handleAddProject = async (projectData: any) => {
    try {
      setErrorMessage(null);
              const newProject = await GoalService.createGoal({
          title: projectData.name, // Note: form uses 'name' but service expects 'title'
          description: projectData.description,
          category: projectData.category,
          timeline: projectData.timeline,
          startDate: projectData.startDate,
          weeklyHours: projectData.weeklyHours,
          workDays: projectData.workDays,
          bestTime: projectData.bestTime
        });
      
      if (newProject) {
        setProjects(prev => [newProject, ...prev]);
        setUseExampleData(false); // Switch to real data
        logger.info('Project added successfully', 'ProjectsPage', { project: newProject });
      } else {
        setErrorMessage('Failed to add project. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Failed to add project. Please try again.');
      console.error('Failed to add project:', err);
      logger.error('Failed to add project', 'ProjectsPage', { error: err, projectData });
    }
  };

  const handleDeleteProject = async (project: GoalWithCommitment) => {
    if (window.confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
      try {
        // For now, just remove from local state since we're using example data
        setProjects(prev => prev.filter(p => p.id !== project.id));
        logger.info('Project deleted successfully', 'ProjectsPage', { project });
      } catch (err) {
        setErrorMessage('Failed to delete project. Please try again.');
        console.error('Failed to delete project:', err);
        logger.error('Failed to delete project', 'ProjectsPage', { error: err, project });
      }
    }
  };

  const handleEditProject = async (project: GoalWithCommitment) => {
    // TODO: Implement edit functionality
    console.log('Edit project:', project);
    alert('Edit functionality coming soon!');
  };

  const handleUpdateProgress = async (project: GoalWithCommitment) => {
    // TODO: Implement progress update functionality
    console.log('Update progress for project:', project);
    alert('Progress update functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Example Data Notice */}
      {/* (Removed the example projects notice container) */}

    {/* Project Progress Section */}
    {projects.length > 0 && (
      <div className="mb-8">
        <div className="bg-white border border-black rounded-xl p-6 text-black shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-black rounded-full p-2">
                <svg className="w-6 h-6" fill="none" stroke="#A3C900" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Your Project Journey</h2>
                <p className="text-gray-600 text-sm">Making progress every week</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {projects.filter(p => p.status === 'completed').length}/{projects.length}
              </div>
              <div className="text-gray-600 text-sm">Projects Completed</div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {projects.filter(p => p.status === 'in-progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {projects.filter(p => p.status === 'not-started').length}
              </div>
              <div className="text-sm text-gray-600">Not Started</div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Projects List */}
    {projects.length > 0 && (
      <div className="space-y-6">
        {projects.map((project) => (
          <GoalCard
            key={project.id}
            goal={project}
            onEdit={handleEditProject}
            onUpdateProgress={handleUpdateProgress}
            onDelete={handleDeleteProject}
          />
        ))}
      </div>
    )}
    </div>
  );
} 