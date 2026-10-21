import React, { useState } from 'react';
import { Flame, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { useStore } from '../../lib/store';
import { HabitStreakModal } from './HabitStreakModal';

export const DailyHabitWidget: React.FC = () => {
  const { streak } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const completedCount = streak.today_completed_ids.length;
  const target = streak.daily_target || 2;
  const percentage = Math.min(100, Math.round((completedCount / target) * 100));
  const isGoalMet = completedCount >= target;

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-brand-mint/10 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-brand-mint/5 rounded-2xl sm:rounded-3xl border border-amber-500/20 dark:border-amber-400/20 shadow-xs hover:border-amber-500/40 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 dark:bg-amber-400/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Flame className="w-6 h-6 fill-current animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-brand-navy dark:text-white">
                  {streak.streak_days}-Day Habit Streak
                </h3>
                {isGoalMet && (
                  <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30">
                    Goal Done 🔥
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-muted dark:text-dark-muted mt-0.5">
                {isGoalMet 
                  ? "You've crushed today's learning target! Keep reading to stay sharp." 
                  : `${completedCount} of ${target} ideas completed today (${target - completedCount} to reach goal)`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 hidden sm:inline">
              {percentage}%
            </span>
            <ChevronRight className="w-5 h-5 text-brand-muted group-hover:text-brand-navy dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full h-2 bg-stone-200/60 dark:bg-stone-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isGoalMet 
                ? 'bg-gradient-to-r from-emerald-500 to-brand-mint' 
                : 'bg-gradient-to-r from-amber-500 to-orange-400'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {isModalOpen && (
        <HabitStreakModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
