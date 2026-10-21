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
        className="p-4 sm:p-5 bg-gradient-to-r from-[#171924] via-[#1B1E2B] to-[#171924] rounded-[24px] sm:rounded-[28px] border border-white/10 shadow-xl hover:border-[#D4FF00]/40 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Flame className="w-6 h-6 fill-amber-400 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  {streak.streak_days}-Day Habit Streak
                </h3>
                {isGoalMet && (
                  <span className="px-2.5 py-0.5 bg-[#D4FF00] text-black text-[10px] font-extrabold rounded-full shadow-[0_0_10px_rgba(212,255,0,0.4)]">
                    Goal Met 🔥
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8E92A4] mt-0.5">
                {isGoalMet 
                  ? "You've crushed today's learning target! Keep going to expand your mind." 
                  : `${completedCount} of ${target} ideas completed today (${target - completedCount} to reach goal)`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-extrabold text-[#D4FF00] hidden sm:inline">
              {percentage}%
            </span>
            <ChevronRight className="w-5 h-5 text-[#8E92A4] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5 w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 bg-[#D4FF00] shadow-[0_0_10px_rgba(212,255,0,0.5)]"
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
