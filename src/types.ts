export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority?: boolean;
}

export type FilterStatus = 'all' | 'unfinished' | 'completed';
