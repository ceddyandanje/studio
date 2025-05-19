
import type { CalendarEvent, Task, Priority } from '@/types';
import { formatISO } from 'date-fns';

// --- Data Store ---
let mockEventsStore: CalendarEvent[] = [
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

let mockTasksStore: Task[] = [
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

// --- Listener for data changes ---
type Listener = () => void;
const listeners: Set<Listener> = new Set();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const subscribeToMockDataChanges = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener); // Unsubscribe function
};

// --- Accessor Functions (Read-only copies) ---
export const getMockEvents = (): CalendarEvent[] => [...mockEventsStore];
export const getMockTasks = (): Task[] => [...mockTasksStore];

// --- Mutator Functions for Tasks ---
export const addMockTask = (taskData: { title: string; priority?: Priority; dueDate?: Date; description?: string }) => {
  const newTask: Task = {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: taskData.title,
    priority: taskData.priority || 'medium',
    dueDate: taskData.dueDate,
    description: taskData.description,
    completed: false,
    createdAt: new Date(),
  };
  mockTasksStore = [newTask, ...mockTasksStore];
  notifyListeners();
};

export const deleteMockTask = (taskId: string) => {
  mockTasksStore = mockTasksStore.filter(task => task.id !== taskId);
  notifyListeners();
};

export const toggleMockTaskComplete = (taskId: string, completed: boolean) => {
  mockTasksStore = mockTasksStore.map(task =>
    task.id === taskId ? { ...task, completed } : task
  );
  notifyListeners();
};

export const updateMockTask = (updatedTask: Task) => {
  mockTasksStore = mockTasksStore.map(task =>
    task.id === updatedTask.id ? updatedTask : task
  );
  notifyListeners();
};


// --- Mutator Functions for Events ---
export const addMockEvent = (eventData: { title: string; startTime: Date; endTime: Date; description?: string; color?: string }) => {
  const newEvent: CalendarEvent = {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...eventData,
  };
  mockEventsStore = [newEvent, ...mockEventsStore];
  notifyListeners();
};

export const deleteMockEvent = (eventId: string) => {
  mockEventsStore = mockEventsStore.filter(event => event.id !== eventId);
  notifyListeners();
};

export const updateMockEvent = (updatedEvent: CalendarEvent) => {
  mockEventsStore = mockEventsStore.map(event =>
    event.id === updatedEvent.id ? updatedEvent : event
  );
  notifyListeners();
};

// --- Function to get calendar data in JSON format for AI Scheduler ---
export const getCalendarDataForAIScheduler = (): string => {
  return JSON.stringify(
    mockEventsStore.map(event => ({
      title: event.title,
      startTime: formatISO(event.startTime),
      endTime: formatISO(event.endTime),
    })),
    null,
    2 // Pretty print JSON
  );
};
