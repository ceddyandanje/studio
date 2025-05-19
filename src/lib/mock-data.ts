import type { CalendarEvent, Task } from '@/types';

export const mockEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Team Meeting',
    startTime: new Date(new Date().setDate(new Date().getDate() + 1)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(new Date().getHours() + 1)),
    description: 'Weekly team sync.',
    color: '#3498DB', // Primary color
  },
  {
    id: 'event-2',
    title: 'Client Call',
    startTime: new Date(new Date().setDate(new Date().getDate() + 2)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(new Date().getHours() + 0.5)),
    description: 'Discuss project updates.',
    color: '#F39C12', // An orange color
  },
  {
    id: 'event-3',
    title: 'Dentist Appointment',
    startTime: new Date(new Date().setHours(14, 0, 0, 0)),
    endTime: new Date(new Date().setHours(15, 0, 0, 0)),
    description: 'Annual check-up.',
  },
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Draft project proposal',
    priority: 'high',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    completed: false,
    createdAt: new Date(),
  },
  {
    id: 'task-2',
    title: 'Review PR #123',
    priority: 'medium',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    completed: false,
    createdAt: new Date(),
  },
  {
    id: 'task-3',
    title: 'Book flight tickets',
    priority: 'low',
    completed: true,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
  },
  {
    id: 'task-4',
    title: 'Prepare presentation slides',
    priority: 'high',
    description: 'For the Q3 review meeting. Include sales figures and projections.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    completed: false,
    createdAt: new Date(),
  },
];
