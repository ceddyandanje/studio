
export type Priority = 'low' | 'medium' | 'high';

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  description?: string;
  color?: string; // Optional color for the event, e.g., hex code
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: Priority;
  completed: boolean;
  createdAt: Date;
}

// For AI Scheduling form
export interface AIScheduleRequest {
  taskName: string;
  taskDurationMinutes: number;
  calendarData: string; // JSON string of existing events
  productivityPatterns: string;
}
