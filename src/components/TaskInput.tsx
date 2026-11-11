import React, { useState, useRef } from 'react';
import { PenTool, Plus, AlertCircle } from 'lucide-react';

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
      setError('Please write something first before adding!');
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
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        {/* Handwriting Input Area */}
        <div className="relative flex-1 group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-focus-within:text-blue-600 transition-colors">
            <PenTool className="w-5 h-5 stroke-[2]" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleChange}
            placeholder="Write a new task here... (e.g., Call the doctor)"
            className="w-full h-14 pl-11 pr-4 font-handwriting text-2xl sm:text-3xl text-slate-900 bg-white/70 hover:bg-white/90 focus:bg-white border-2 border-dashed border-slate-400/80 focus:border-solid focus:border-blue-600 rounded-xl outline-none transition-all placeholder:text-slate-400 shadow-inner"
            aria-label="Write a new daily task"
          />
        </div>

        {/* Large Blue Add Task Button */}
        <button
          type="submit"
          className="h-14 px-6 sm:px-7 font-kalam font-bold text-xl sm:text-2xl text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] transition cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
        >
          <Plus className="w-6 h-6 stroke-[3]" aria-hidden="true" />
          <span>Add Task</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-rose-700 font-handwriting text-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
};
