
import type { CalendarEvent, Task, Priority } from '@/types';
import { formatISO } from 'date-fns';

// --- Data Store ---
let mockEventsStore: CalendarEvent[] = [];

let mockTasksStore: Task[] = [];

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
