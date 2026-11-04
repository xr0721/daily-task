import React, { useState, useRef } from 'react';
import { Plus, AlertCircle } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (text: string) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Please type something before clicking Add Task.');
      inputRef.current?.focus();
      return;
    }
    onAddTask(trimmed);
    setText('');
    setError('');
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (error && e.target.value.trim()) {
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleChange}
            placeholder="Type a new task here... (e.g. Go for a 20-minute walk)"
            className="w-full h-14 px-5 text-lg sm:text-xl text-slate-800 bg-white border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition placeholder:text-slate-400"
            aria-label="New task description"
          />
        </div>

        <button
          type="submit"
          className="h-14 px-7 text-lg sm:text-xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl flex items-center justify-center gap-2.5 shadow-sm hover:shadow transition cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
          <span>Add Task</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-2 text-rose-600 text-sm font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
};
