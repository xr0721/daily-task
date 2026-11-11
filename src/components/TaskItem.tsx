import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Edit2, Star, Check, X } from 'lucide-react';
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
      className={`group relative flex items-center justify-between gap-3 px-3 sm:px-4 py-3 rounded-xl border border-dashed transition-all ${
        task.completed
          ? 'bg-black/5 border-slate-400/40 opacity-75'
          : task.priority
          ? 'bg-amber-100/50 border-amber-400/80 shadow-xs'
          : 'bg-white/40 hover:bg-white/70 border-slate-400/50 hover:border-slate-500'
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        {/* Hand-drawn style Checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={task.completed}
          aria-label={task.completed ? `Mark "${task.text}" as unfinished` : `Mark "${task.text}" as completed`}
          onClick={() => onToggle(task.id)}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all transform active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${
            task.completed
              ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
              : 'bg-white/80 border-slate-600 hover:border-blue-600 hover:bg-white text-transparent'
          }`}
        >
          <Check className={`w-6 h-6 stroke-[3.5] ${task.completed ? 'block' : 'opacity-0'}`} />
        </button>

        {/* Handwritten text or edit input */}
        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              ref={editInputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-1.5 font-handwriting text-2xl sm:text-3xl text-slate-900 border-2 border-blue-600 rounded-lg outline-none bg-white shadow-sm"
            />
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-3 py-1.5 font-kalam font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shrink-0 cursor-pointer shadow-xs"
              title="Save changes"
              aria-label="Save edited task"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditText(task.text);
                setIsEditing(false);
              }}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg transition shrink-0 cursor-pointer"
              title="Cancel"
              aria-label="Cancel editing"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div
            className="flex-1 min-w-0 cursor-pointer select-none py-1"
            onClick={() => onToggle(task.id)}
          >
            <span
              className={`font-handwriting text-2xl sm:text-3xl leading-snug block break-words transition-all ${
                task.completed
                  ? 'line-through text-slate-500 font-normal decoration-slate-600 decoration-2'
                  : 'text-slate-900 font-semibold'
              }`}
            >
              {task.text}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!isEditing && (
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Priority Star button */}
          <button
            type="button"
            onClick={() => onTogglePriority(task.id)}
            aria-label={task.priority ? "Remove high priority" : "Mark as high priority"}
            title={task.priority ? "High priority" : "Mark as high priority"}
            className={`min-w-[40px] min-h-[40px] p-2 rounded-lg flex items-center justify-center transition cursor-pointer ${
              task.priority
                ? 'text-amber-600 bg-amber-200/60 hover:bg-amber-200'
                : 'text-slate-400 hover:text-amber-600 hover:bg-white/60'
            }`}
          >
            <Star className={`w-5 h-5 ${task.priority ? 'fill-amber-500 text-amber-600' : ''}`} />
          </button>

          {/* Edit button */}
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label={`Edit task: ${task.text}`}
            title="Edit task"
            className="min-w-[40px] min-h-[40px] p-2 text-slate-400 hover:text-blue-700 hover:bg-white/60 rounded-lg flex items-center justify-center transition cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Delete button (Large hit target, clean blue/slate ink look or gentle red hover) */}
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task: ${task.text}`}
            title="Delete task"
            className="min-w-[44px] min-h-[44px] px-2.5 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-100/60 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer font-kalam font-bold text-base"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};
