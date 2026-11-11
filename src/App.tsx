import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Sparkles,
  RotateCcw,
  Printer,
  Search,
  X,
  PlusCircle,
  CheckCircle2,
  Palette,
  FileCheck2
} from 'lucide-react';
import { Task, FilterStatus, NoteColor } from './types';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  loadColorFromStorage,
  saveColorToStorage,
  DEFAULT_TASKS,
} from './utils/storage';
import { TaskInput } from './components/TaskInput';
import { TaskItem } from './components/TaskItem';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';

const QUICK_SUGGESTIONS = [
  'Drink 8 glasses of water today',
  'Take a 20-minute relaxing walk',
  'Call a friend or family member',
  'Review grocery list & pantry',
  'Read 10 pages of a good book',
  'Do 5 minutes of gentle stretching',
];

const NOTE_COLORS: { id: NoteColor; label: string; bgClass: string; borderClass: string; swatch: string }[] = [
  { id: 'yellow', label: 'Canary Yellow', bgClass: 'bg-[#fef9c3]', borderClass: 'border-[#fef08a]', swatch: 'bg-[#fef08a]' },
  { id: 'pink', label: 'Pastel Rose', bgClass: 'bg-[#ffe4e6]', borderClass: 'border-[#fecdd3]', swatch: 'bg-[#fecdd3]' },
  { id: 'green', label: 'Mint Green', bgClass: 'bg-[#dcfce7]', borderClass: 'border-[#bbf7d0]', swatch: 'bg-[#bbf7d0]' },
  { id: 'blue', label: 'Sky Blue', bgClass: 'bg-[#e0f2fe]', borderClass: 'border-[#bae6fd]', swatch: 'bg-[#bae6fd]' },
  { id: 'peach', label: 'Warm Peach', bgClass: 'bg-[#ffedd5]', borderClass: 'border-[#fed7aa]', swatch: 'bg-[#fed7aa]' },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [noteColor, setNoteColor] = useState<NoteColor>(() => loadColorFromStorage());
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Sync tasks and note color to localStorage
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  useEffect(() => {
    saveColorToStorage(noteColor);
  }, [noteColor]);

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
      if (e.key === 'my_daily_tasks_color' && e.newValue) {
        setNoteColor(e.newValue as NoteColor);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Format today's date warmly in handwriting style
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

  // Current active color scheme
  const currentColorConfig = useMemo(() => {
    return NOTE_COLORS.find((c) => c.id === noteColor) || NOTE_COLORS[0];
  }, [noteColor]);

  return (
    <div className="min-h-screen py-6 sm:py-10 px-3 sm:px-6 flex flex-col items-center justify-between">
      {/* Top Desk Toolbar (Print, Color Swatches, Reset) */}
      <header className="w-full max-w-3xl mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3 px-2">
        {/* Sticky Note Color Switcher */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs py-1.5 px-3 rounded-full border border-slate-200 shadow-xs">
          <Palette className="w-4 h-4 text-slate-500" />
          <span className="font-kalam text-sm font-bold text-slate-700 hidden sm:inline">Note Color:</span>
          <div className="flex items-center gap-1.5">
            {NOTE_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setNoteColor(c.id)}
                title={c.label}
                aria-label={`Change sticky note to ${c.label}`}
                className={`w-6 h-6 rounded-full ${c.swatch} border-2 transition-all cursor-pointer ${
                  noteColor === c.id
                    ? 'border-blue-600 scale-110 shadow-xs ring-2 ring-blue-300/60'
                    : 'border-slate-300 hover:scale-105'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quick actions (Print, Reset Demo) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            title="Print your handwritten sticky note"
            className="px-3.5 py-1.5 bg-white/90 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-full font-kalam text-sm font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Print Note</span>
          </button>

          {showConfirmReset ? (
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-700 px-2">Reset?</span>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-2.5 py-0.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-full cursor-pointer"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-2 py-0.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              title="Reset to starter sample tasks"
              className="px-3 py-1.5 bg-white/80 hover:bg-slate-100 text-slate-600 rounded-full font-kalam text-sm font-bold flex items-center gap-1.5 border border-slate-200 shadow-xs transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Tasks</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Sticky Note */}
      <main className="w-full max-w-3xl relative">
        {/* Realistic Washi Tape at Top Center */}
        <div className="washi-tape absolute -top-4 left-1/2 -translate-x-1/2 w-36 sm:w-44 h-8 rounded-xs z-20 pointer-events-none rotate-[-1deg]" />

        {/* The Note Body */}
        <div
          className={`relative ${currentColorConfig.bgClass} ${currentColorConfig.borderClass} border-2 rounded-2xl sm:rounded-3xl p-5 sm:p-9 sticky-note-shadow transition-colors duration-300 space-y-6`}
        >
          {/* Note Title & Header in handwriting */}
          <div className="pt-2 sm:pt-1 pb-2 border-b-2 border-dashed border-slate-300/80 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1 className="font-kalam text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-none flex items-center gap-2 sm:gap-3">
                <span>My Daily Tasks</span>
                <span className="text-2xl sm:text-3xl text-blue-600" aria-hidden="true">✎</span>
              </h1>
              <p className="font-handwriting text-xl sm:text-2xl text-slate-600 mt-1 sm:mt-1.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-700" />
                <span>{todayFormatted}</span>
              </p>
            </div>

            <div className="self-start sm:self-auto">
              <span className="font-caveat text-xl sm:text-2xl text-blue-800 font-bold bg-white/50 px-3 py-1 rounded-full border border-blue-200/80 shadow-2xs inline-block rotate-[-1deg]">
                Keep it simple!
              </span>
            </div>
          </div>

          {/* Unfinished Task Count & Status */}
          <section aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">Tasks summary</h2>
            <TaskStats
              totalTasks={totalCount}
              unfinishedCount={unfinishedCount}
              completedCount={completedCount}
            />
          </section>

          {/* Handwriting Input Area */}
          <section aria-labelledby="input-heading" className="pt-1">
            <h2 id="input-heading" className="sr-only">Add a task</h2>
            <TaskInput onAddTask={handleAddTask} />
          </section>

          {/* Filter Tabs & Search */}
          {totalCount > 0 && (
            <section className="space-y-3 pt-1">
              {totalCount > 3 && (
                <div className="relative">
                  <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in your sticky note..."
                    className="w-full pl-11 pr-10 py-2 bg-white/60 focus:bg-white border border-dashed border-slate-400 rounded-xl font-handwriting text-2xl text-slate-800 placeholder:text-slate-400 outline-none transition"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-800"
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

          {/* Tasks List */}
          <section aria-labelledby="task-list-heading">
            <h2 id="task-list-heading" className="sr-only">Your Task Items</h2>

            {filteredTasks.length > 0 ? (
              <div className="space-y-2.5 sm:space-y-3" role="list">
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
              /* Empty note state with suggestions */
              <div className="bg-white/40 border-2 border-dashed border-slate-400/50 rounded-2xl p-6 sm:p-8 text-center space-y-4">
                <div className="font-kalam text-2xl sm:text-3xl font-bold text-slate-800">
                  Your sticky note is ready to be written on! 📝
                </div>
                <p className="font-handwriting text-2xl text-slate-600 max-w-md mx-auto">
                  Type any task above and click <span className="font-bold text-blue-700">Add Task</span>, or tap any idea below to jot it down:
                </p>

                {/* Quick suggestions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-2 max-w-xl mx-auto">
                  {QUICK_SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddTask(suggestion)}
                      className="p-3 bg-white/60 hover:bg-white border border-slate-300 hover:border-blue-500 rounded-xl transition text-left flex items-center justify-between gap-2 group cursor-pointer shadow-2xs"
                    >
                      <span className="font-handwriting text-xl sm:text-2xl text-slate-800 font-semibold">{suggestion}</span>
                      <PlusCircle className="w-5 h-5 text-blue-600 opacity-60 group-hover:opacity-100 shrink-0" />
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-kalam font-bold text-xl rounded-xl shadow-md transition cursor-pointer"
                  >
                    Load Starter Sample Tasks
                  </button>
                </div>
              </div>
            ) : (
              /* Empty state for filtered search */
              <div className="bg-white/40 rounded-xl p-6 text-center border border-dashed border-slate-400">
                <p className="font-handwriting text-2xl text-slate-600">
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
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg font-kalam font-bold text-lg hover:bg-blue-700 cursor-pointer shadow-xs"
                  >
                    Show All Tasks
                  </button>
                )}
              </div>
            )}
          </section>

          {/* Browser Storage note at bottom */}
          <footer className="pt-4 border-t-2 border-dashed border-slate-300/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-600 font-handwriting text-lg sm:text-xl">
            <div className="flex items-center gap-1.5 text-center sm:text-left">
              <FileCheck2 className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Automatically saved in your browser storage. Safe to refresh anytime!</span>
            </div>
            <div className="font-caveat text-xl text-slate-500 font-bold shrink-0">
              Personal Daily Note
            </div>
          </footer>
        </div>
      </main>

      {/* Desk footer */}
      <div className="w-full text-center mt-6 text-slate-500 font-handwriting text-lg">
        My Daily Tasks · A handwritten sticky note for your everyday to-dos
      </div>
    </div>
  );
}
