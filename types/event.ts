export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
  type: 'task' | 'meeting' | 'event';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdBy: string; // User ID
  createdByName: string; // User display name
  assignedTo?: string[]; // Array of user IDs
  assignedToNames?: string[]; // Array of user display names
  location?: string;
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: 'task' | 'meeting' | 'event';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string[];
  location?: string;
}
