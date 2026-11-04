import { Task } from '../types';

const STORAGE_KEY = 'my_daily_tasks_data';

export const DEFAULT_TASKS: Task[] = [
  {
    id: 'starter-1',
    text: 'Welcome to My Daily Tasks! Click this box to check me off',
    completed: false,
    createdAt: Date.now() - 3600000,
    priority: true,
  },
  {
    id: 'starter-2',
    text: 'Drink a glass of refreshing water',
    completed: false,
    createdAt: Date.now() - 1800000,
    priority: false,
  },
  {
    id: 'starter-3',
    text: 'Try adding your own new task using the box above',
    completed: false,
    createdAt: Date.now() - 600000,
    priority: false,
  },
];

export function loadTasksFromStorage(): Task[] {
  if (typeof window === 'undefined') return DEFAULT_TASKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First visit: save initial tasks
      saveTasksToStorage(DEFAULT_TASKS);
      return DEFAULT_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return DEFAULT_TASKS;
  } catch (err) {
    console.error('Failed to load tasks from local storage:', err);
    return DEFAULT_TASKS;
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to local storage:', err);
  }
}
