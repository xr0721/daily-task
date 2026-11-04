import React from 'react';
import { CheckCircle2, ListTodo, Sparkles } from 'lucide-react';

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
    <div className="w-full bg-slate-50 border-2 border-slate-200/80 rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Count statement */}
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isAllDone ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
            }`}
          >
            {isAllDone ? (
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <ListTodo className="w-6 h-6 stroke-[2.5]" />
            )}
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {totalTasks === 0 ? (
                'No tasks yet'
              ) : isAllDone ? (
                'All tasks completed! Great job! 🎉'
              ) : (
                <>
                  <span className="text-blue-600 font-extrabold">{unfinishedCount}</span>{' '}
                  {unfinishedCount === 1 ? 'task remaining' : 'tasks remaining'}
                </>
              )}
            </div>
            <div className="text-sm sm:text-base text-slate-500 font-medium">
              {totalTasks === 0 ? (
                'Add your first task above to get started'
              ) : isAllDone ? (
                `You completed all ${totalTasks} tasks for today.`
              ) : (
                `${completedCount} of ${totalTasks} completed (${percent}%)`
              )}
            </div>
          </div>
        </div>

        {/* Small numeric summary pills/counters */}
        {totalTasks > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto text-sm font-semibold">
            <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800">
              {unfinishedCount} Unfinished
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              {completedCount} Done
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {totalTasks > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-200/80">
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isAllDone ? 'bg-emerald-500' : 'bg-blue-600'
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
