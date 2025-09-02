export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate: string; // ISO string
  completed: boolean;
}

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  start: string; // ISO string
  end: string;   // ISO string
  allDay?: boolean;
} 