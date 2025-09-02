// Project utility functions for better code organization

export interface Project {
  id: number;
  name: string;
  description: string;
  category: string;
  timeline: number;
  effort: number;
  progress: number;
  status: string;
  deadline: string;
  created_at: string;
  updated_at: string;
}

export interface NewProjectInput {
  name: string;
  description: string;
  category: string;
  timeline: number;
  effort: number;
}

export const PROJECT_STATUSES = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  ON_HOLD: 'on-hold'
};

export const PROJECT_CATEGORIES = {
  MAKER: 'maker',
  LEARNING: 'learning',
  FITNESS: 'fitness',
  BUSINESS: 'business',
  CAREER: 'career',
  FINANCE: 'finance',
};

export const PROJECT_TAGS = [
  { label: 'Maker Project', value: 'maker', color: 'bg-blue-200/80 text-blue-900', inspire: 'Creative/building work' },
  { label: 'Learning', value: 'learning', color: 'bg-yellow-200/80 text-yellow-900', inspire: 'Courses, skills' },
  { label: 'Fitness/Health', value: 'fitness', color: 'bg-green-200/80 text-green-900', inspire: 'Exercise, wellness' },
  { label: 'Business/Side Hustle', value: 'business', color: 'bg-purple-200/80 text-purple-900', inspire: 'Entrepreneurship' },
  { label: 'Career/Professional', value: 'career', color: 'bg-pink-200/80 text-pink-900', inspire: 'Job, networking' },
  { label: 'Finance/Saving', value: 'finance', color: 'bg-orange-200/80 text-orange-900', inspire: 'Budget, saving' },
];

export function getStatusColor(status: string): string {
  switch (status) {
    case PROJECT_STATUSES.COMPLETED:
      return 'bg-green-100 text-green-800';
    case PROJECT_STATUSES.IN_PROGRESS:
      return 'bg-blue-100 text-blue-800';
    case PROJECT_STATUSES.NOT_STARTED:
      return 'bg-gray-100 text-gray-800';
    case PROJECT_STATUSES.ON_HOLD:
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case PROJECT_CATEGORIES.MAKER:
      return 'bg-blue-200/80 text-blue-900';
    case PROJECT_CATEGORIES.LEARNING:
      return 'bg-yellow-200/80 text-yellow-900';
    case PROJECT_CATEGORIES.FITNESS:
      return 'bg-green-200/80 text-green-900';
    case PROJECT_CATEGORIES.BUSINESS:
      return 'bg-purple-200/80 text-purple-900';
    case PROJECT_CATEGORIES.CAREER:
      return 'bg-pink-200/80 text-pink-900';
    case PROJECT_CATEGORIES.FINANCE:
      return 'bg-orange-200/80 text-orange-900';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function createNewProject(input: NewProjectInput, existingProjects: Project[]): Project {
  return {
    id: Math.max(...existingProjects.map(p => p.id), 0) + 1,
    name: input.name,
    description: input.description,
    category: input.category,
    timeline: input.timeline,
    effort: input.effort,
    progress: 0,
    status: PROJECT_STATUSES.NOT_STARTED,
    deadline: new Date(Date.now() + input.timeline * 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function validateProjectInput(input: NewProjectInput): { isValid: boolean; error?: string } {
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
  
  if (input.effort < 1 || input.effort > 40) {
    return { isValid: false, error: 'Weekly effort must be between 1 and 40 hours' };
  }
  
  return { isValid: true };
} 