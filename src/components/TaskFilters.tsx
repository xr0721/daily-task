import React from 'react';
import { FilterStatus } from '../types';
import { CheckCheck, Trash2 } from 'lucide-react';

interface TaskFiltersProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  totalCount: number;
  unfinishedCount: number;
  completedCount: number;
  onClearCompleted: () => void;
  onMarkAllComplete: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentFilter,
  onFilterChange,
  totalCount,
  unfinishedCount,
  completedCount,
  onClearCompleted,
  onMarkAllComplete,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
      {/* Segmented Filter Buttons */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => onFilterChange('all')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-sm sm:text-base font-bold transition cursor-pointer whitespace-nowrap ${
            currentFilter === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          All ({totalCount})
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('unfinished')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-sm sm:text-base font-bold transition cursor-pointer whitespace-nowrap ${
            currentFilter === 'unfinished'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          Unfinished ({unfinishedCount})
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('completed')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-sm sm:text-base font-bold transition cursor-pointer whitespace-nowrap ${
            currentFilter === 'completed'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Quick helper buttons */}
      <div className="flex items-center gap-2 justify-end">
        {unfinishedCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllComplete}
            title="Mark all tasks as completed"
            className="px-3 py-2 text-sm font-semibold text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Mark All Done</span>
          </button>
        )}

        {completedCount > 0 && (
          <button
            type="button"
            onClick={onClearCompleted}
            title="Remove all completed tasks"
            className="px-3 py-2 text-sm font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Completed</span>
          </button>
        )}
      </div>
    </div>
  );
};
