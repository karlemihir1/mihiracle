import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { useStore } from '../../lib/store';
import { HabitStreakModal } from './HabitStreakModal';

export const HabitStreakBadge: React.FC = () => {
  const { streak } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const completedCount = streak.today_completed_ids.length;
  const target = streak.daily_target || 3;
  const isGoalMet = completedCount >= target;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-2xs select-none min-h-[38px] ${
          isGoalMet
            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
            : 'bg-stone-100 dark:bg-dark-card text-brand-text dark:text-dark-text border border-brand-border/60 dark:border-dark-border/60 hover:border-amber-500/40'
        }`}
        title={`Habit Streak: ${streak.streak_days} days. Click to view progress.`}
        aria-label="View habit streak"
      >
        <Flame className={`w-4 h-4 fill-current ${isGoalMet ? 'text-amber-500 animate-bounce' : 'text-amber-500/80'}`} />
        <span>{streak.streak_days}</span>
        <span className="hidden sm:inline text-[10px] font-normal text-brand-muted dark:text-dark-muted">
          ({completedCount}/{target})
        </span>
      </button>

      {isModalOpen && (
        <HabitStreakModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
