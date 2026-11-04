import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle,
  Calendar,
  Sparkles,
  RotateCcw,
  Printer,
  Search,
  X,
  PlusCircle,
  CheckCheck
} from 'lucide-react';
import { Task, FilterStatus } from './types';
import { loadTasksFromStorage, saveTasksToStorage, DEFAULT_TASKS } from './utils/storage';
import { TaskInput } from './components/TaskInput';
import { TaskItem } from './components/TaskItem';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';

const QUICK_SUGGESTIONS = [
  'Drink 8 glasses of water today',
  'Take a 20-minute relaxing walk',
  'Call a friend or family member',
  'Review bills and grocery list',
  'Read 10 pages of a good book',
  'Do 5 minutes of gentle stretching',
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Sync tasks to local storage whenever tasks change
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Listen to window storage events (in case multiple tabs are open)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'my_daily_tasks_data' && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            setTasks(updated);
          }
        } catch {
          // ignore parsing error
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Format today's date warmly
  const todayFormatted = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  // Handlers
  const handleAddTask = (text: string) => {
    const newTask: Task = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      text,
      completed: false,
      createdAt: Date.now(),
      priority: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditTask = (id: string, newText: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  const handleTogglePriority = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority: !t.priority } : t))
    );
  };

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const handleMarkAllComplete = () => {
    setTasks((prev) => prev.map((t) => ({ ...t, completed: true })));
  };

  const handleResetToDefault = () => {
    setTasks(DEFAULT_TASKS);
    setShowConfirmReset(false);
  };

  // Counts
  const totalCount = tasks.length;
  const unfinishedCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  // Filtered & searched tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (filter === 'unfinished') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
      })
      .filter((t) => {
        if (!searchQuery.trim()) return true;
        return t.text.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        // High priority first if unfinished
        if (!a.completed && !b.completed) {
          if (a.priority && !b.priority) return -1;
          if (!a.priority && b.priority) return 1;
        }
        return b.createdAt - a.createdAt;
      });
  }, [tasks, filter, searchQuery]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <CheckCircle className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                My Daily Tasks
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{todayFormatted}</span>
              </p>
            </div>
          </div>

          {/* Quick Tools */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              title="Print your tasks list"
              className="p-2.5 sm:px-3 sm:py-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 rounded-xl flex items-center gap-2 transition cursor-pointer text-sm font-semibold"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print List</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Unfinished Tasks Count and Progress */}
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Task Overview</h2>
          <TaskStats
            totalTasks={totalCount}
            unfinishedCount={unfinishedCount}
            completedCount={completedCount}
          />
        </section>

        {/* Task Input Section */}
        <section aria-labelledby="add-task-heading" className="bg-slate-50/60 p-4 sm:p-5 rounded-2xl border-2 border-slate-200">
          <h2 id="add-task-heading" className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <span>Add a New Task</span>
          </h2>
          <TaskInput onAddTask={handleAddTask} />
        </section>

        {/* Task List Controls & Filters */}
        {totalCount > 0 && (
          <section className="space-y-3">
            {/* Search Bar (if more than 3 tasks) */}
            {totalCount > 3 && (
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your tasks..."
                  className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 outline-none transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            <TaskFilters
              currentFilter={filter}
              onFilterChange={setFilter}
              totalCount={totalCount}
              unfinishedCount={unfinishedCount}
              completedCount={completedCount}
              onClearCompleted={handleClearCompleted}
              onMarkAllComplete={handleMarkAllComplete}
            />
          </section>
        )}

        {/* The Tasks List */}
        <section aria-labelledby="task-list-heading">
          <h2 id="task-list-heading" className="sr-only">Your Tasks</h2>

          {filteredTasks.length > 0 ? (
            <div className="space-y-3" role="list">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  onTogglePriority={handleTogglePriority}
                />
              ))}
            </div>
          ) : totalCount === 0 ? (
            /* Empty State when zero tasks exist */
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-slate-900">Your task list is empty!</h3>
                <p className="text-slate-600 text-base sm:text-lg mt-2">
                  Add what you want to achieve today using the text box above, or click any suggestion below to get started:
                </p>
              </div>

              {/* Quick suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl mx-auto text-left pt-2">
                {QUICK_SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddTask(suggestion)}
                    className="p-3 text-sm sm:text-base font-semibold text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-xl transition text-left flex items-center justify-between gap-2 group cursor-pointer"
                  >
                    <span>{suggestion}</span>
                    <PlusCircle className="w-4 h-4 text-blue-600 opacity-60 group-hover:opacity-100 shrink-0" />
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-base transition shadow-sm cursor-pointer"
                >
                  Load Starter Sample Tasks
                </button>
              </div>
            </div>
          ) : (
            /* Empty state for filtered view */
            <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-500 border border-slate-200 space-y-3">
              <p className="text-lg font-medium">
                {searchQuery
                  ? `No tasks found matching "${searchQuery}".`
                  : filter === 'unfinished'
                  ? 'No unfinished tasks right now. You are all done!'
                  : 'No completed tasks yet. Finish a task by clicking its checkbox!'}
              </p>
              {filter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer"
                >
                  Show All Tasks
                </button>
              )}
            </div>
          )}
        </section>

        {/* Beginner Guide & Storage Info Banner */}
        <section className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 text-sm sm:text-base text-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCheck className="w-4 h-4 text-blue-600" />
                Automatic Browser Storage Enabled
              </p>
              <p className="text-slate-600">
                Your tasks are automatically saved directly in your web browser. You can safely close or refresh this page at any time without losing your tasks.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {showConfirmReset ? (
                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-semibold text-slate-700">Reset list?</span>
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer"
                  >
                    Yes, Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(true)}
                  className="px-3 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl border border-slate-200/80 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Tasks</span>
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-slate-500 text-sm">
          <p className="font-medium text-slate-700">My Daily Tasks</p>
          <p className="text-xs text-slate-400 mt-1">
            Simple, private, and always saved in your browser. Designed for phones, tablets, and computers.
          </p>
        </div>
      </footer>
    </div>
  );
}
