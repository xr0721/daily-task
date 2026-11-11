import React from 'react';
import { Sparkles, CheckCheck } from 'lucide-react';

interface TaskStatsProps {
  totalTasks: number;
  unfinishedCount: number;
  completedCount: number;
}

export const TaskStats: React.FC<TaskStatsProps> = ({
  totalTasks,
  unfinishedCount,
  completedCount,
}) => {
  const percent = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);
  const isAllDone = totalTasks > 0 && unfinishedCount === 0;

  return (
    <div className="w-full pb-3 border-b-2 border-dashed border-slate-300/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="font-kalam font-bold text-2xl sm:text-3xl text-slate-900 leading-tight flex items-center gap-2">
            {totalTasks === 0 ? (
              <span>Your to-do list is clean! ✍️</span>
            ) : isAllDone ? (
              <span className="flex items-center gap-2 text-emerald-800">
                <Sparkles className="w-6 h-6 text-amber-500 fill-amber-400" />
                All tasks finished! Great job! 🎉
              </span>
            ) : (
              <span>
                <span className="text-blue-700 underline decoration-blue-400 decoration-wavy decoration-1">
                  {unfinishedCount}
                </span>{' '}
                {unfinishedCount === 1 ? 'task left' : 'tasks left'} to do today
              </span>
            )}
          </div>

          <div className="font-handwriting text-xl sm:text-2xl text-slate-600 mt-0.5">
            {totalTasks === 0 ? (
              'Jot down what you need to do below'
            ) : isAllDone ? (
              `Completed all ${totalTasks} tasks on your note!`
            ) : (
              `${completedCount} of ${totalTasks} completed (${percent}%)`
            )}
          </div>
        </div>

        {totalTasks > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto font-kalam text-sm sm:text-base font-bold">
            <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-900 border border-blue-200 shadow-2xs">
              {unfinishedCount} Unfinished
            </span>
            <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-200 shadow-2xs flex items-center gap-1">
              <CheckCheck className="w-4 h-4" />
              {completedCount} Done
            </span>
          </div>
        )}
      </div>

      {/* Hand-drawn style Progress bar */}
      {totalTasks > 0 && (
        <div className="mt-3">
          <div className="w-full bg-slate-200/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-300">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isAllDone ? 'bg-emerald-600' : 'bg-blue-600'
              }`}
              style={{ width: `${percent}%` }}
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      )}
    </div>
  );
};
