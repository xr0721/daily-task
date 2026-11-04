import React, { useState, useRef, useEffect } from 'react';
import { Check, Trash2, Edit2, Star, X, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onTogglePriority: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onEdit,
  onTogglePriority,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    const trimmed = editText.trim();
    if (trimmed) {
      onEdit(task.id, trimmed);
      setIsEditing(false);
    } else {
      // Revert if empty
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`group relative flex items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl border-2 transition-all duration-150 ${
        task.completed
          ? 'bg-slate-50/70 border-slate-200 opacity-80'
          : task.priority
          ? 'bg-blue-50/40 border-blue-200 shadow-sm'
          : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
        {/* Large Checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={task.completed}
          aria-label={task.completed ? `Mark "${task.text}" as unfinished` : `Mark "${task.text}" as completed`}
          onClick={() => onToggle(task.id)}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
            task.completed
              ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
              : 'bg-white border-slate-400 hover:border-blue-600 text-transparent'
          }`}
        >
          <Check className={`w-5 h-5 sm:w-6 sm:h-6 stroke-[3] ${task.completed ? 'block' : 'opacity-0'}`} />
        </button>

        {/* Text or Edit Input */}
        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              ref={editInputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 text-lg sm:text-xl font-medium text-slate-900 border-2 border-blue-500 rounded-lg outline-none bg-white"
            />
            <button
              type="button"
              onClick={handleSaveEdit}
              className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shrink-0 cursor-pointer"
              title="Save changes"
              aria-label="Save edited task"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setEditText(task.text);
                setIsEditing(false);
              }}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition shrink-0 cursor-pointer"
              title="Cancel"
              aria-label="Cancel editing"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div
            className="flex-1 min-w-0 cursor-pointer select-none"
            onClick={() => onToggle(task.id)}
          >
            <span
              className={`text-lg sm:text-xl block leading-snug break-words transition-colors ${
                task.completed
                  ? 'line-through text-slate-400 font-normal'
                  : 'text-slate-800 font-medium'
              }`}
            >
              {task.text}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!isEditing && (
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Priority Star button */}
          <button
            type="button"
            onClick={() => onTogglePriority(task.id)}
            aria-label={task.priority ? "Remove high priority" : "Mark as high priority"}
            title={task.priority ? "High priority task" : "Mark as high priority"}
            className={`min-w-[40px] min-h-[40px] p-2 rounded-xl flex items-center justify-center transition cursor-pointer ${
              task.priority
                ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
            }`}
          >
            <Star className={`w-5 h-5 ${task.priority ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Edit button */}
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label={`Edit task: ${task.text}`}
            title="Edit task text"
            className="min-w-[40px] min-h-[40px] p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl flex items-center justify-center transition cursor-pointer"
          >
            <Edit2 className="w-5 h-5" />
          </button>

          {/* Delete button (Blue/soft themed or red on hover with accessible touch area) */}
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task: ${task.text}`}
            title="Delete this task"
            className="min-w-[44px] min-h-[44px] px-2.5 py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer border border-transparent hover:border-rose-200"
          >
            <Trash2 className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-semibold">Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};
