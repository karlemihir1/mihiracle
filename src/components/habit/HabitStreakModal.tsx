import React, { useState } from 'react';
import { Flame, Trophy, Target, CheckCircle2, Sparkles, Award } from 'lucide-react';
import { useStore } from '../../lib/store';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface HabitStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HabitStreakModal: React.FC<HabitStreakModalProps> = ({ isOpen, onClose }) => {
  const { streak, updateDailyTarget } = useStore();
  const [selectedTarget, setSelectedTarget] = useState(streak.daily_target || 3);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const completedCount = streak.today_completed_ids.length;
  const target = streak.daily_target || 3;
  const percentage = Math.min(100, Math.round((completedCount / target) * 100));
  const isGoalMet = completedCount >= target;

  const handleSaveTarget = (num: number) => {
    setSelectedTarget(num);
    updateDailyTarget(num);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-400/15 flex items-center justify-center text-amber-500">
            <Flame className="w-5 h-5 fill-current animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-brand-navy dark:text-white">
              Daily Learning Habit
            </h3>
            <p className="text-[11px] text-brand-muted dark:text-dark-muted font-sans font-normal">
              Consistency compounds every single day
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Streak Stats Card */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent rounded-2xl border border-amber-500/20 dark:border-amber-400/20 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Flame className="w-5 h-5 fill-current" />
              <span className="text-2xl font-black">{streak.streak_days}</span>
            </div>
            <p className="text-xs font-semibold text-brand-text dark:text-dark-text">Current Streak</p>
            <p className="text-[10px] text-brand-muted dark:text-dark-muted">
              {streak.streak_days > 1 ? `${streak.streak_days} days in a row` : 'Active today'}
            </p>
          </div>

          <div className="p-4 bg-brand-bg dark:bg-dark-card rounded-2xl border border-brand-border/60 dark:border-dark-border/60 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-brand-navy dark:text-brand-mint">
              <Trophy className="w-5 h-5" />
              <span className="text-2xl font-black">{streak.longest_streak || 1}</span>
            </div>
            <p className="text-xs font-semibold text-brand-text dark:text-dark-text">Best Streak</p>
            <p className="text-[10px] text-brand-muted dark:text-dark-muted">Personal record</p>
          </div>
        </div>

        {/* Today's Goal Progress */}
        <div className="p-4 bg-white dark:bg-dark-surface rounded-2xl border border-brand-border dark:border-dark-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-navy dark:text-brand-mint" />
              <span className="text-xs font-bold text-brand-text dark:text-dark-text">Today's Progress</span>
            </div>
            <span className="text-xs font-bold text-brand-navy dark:text-brand-mint">
              {completedCount} / {target} ideas ({percentage}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden p-0.5">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isGoalMet 
                  ? 'bg-gradient-to-r from-emerald-500 to-brand-mint' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-400'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Status message */}
          <div className="flex items-center gap-2 text-xs">
            {isGoalMet ? (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-brand-mint font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Daily target reached! You've protected your streak today 🔥</span>
              </div>
            ) : (
              <p className="text-brand-muted dark:text-dark-muted">
                Read <span className="font-semibold text-brand-text dark:text-dark-text">{target - completedCount} more</span> {target - completedCount === 1 ? 'idea' : 'ideas'} today to complete your habit!
              </p>
            )}
          </div>
        </div>

        {/* Set Daily Goal */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-brand-text dark:text-dark-text">
              Daily Target (Ideas to read/day)
            </label>
            {isSavedNotice && (
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-brand-mint animate-in fade-in">
                Saved!
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 3, 5, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleSaveTarget(num)}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTarget === num
                    ? 'bg-brand-navy text-white dark:bg-brand-mint dark:text-brand-navy shadow-xs'
                    : 'bg-stone-100 dark:bg-dark-card text-brand-muted hover:text-brand-text dark:text-dark-muted dark:hover:text-dark-text border border-brand-border/40 dark:border-dark-border/40'
                }`}
              >
                {num} {num === 1 ? 'Idea' : 'Ideas'}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-brand-muted dark:text-dark-muted">
            Microlearning philosophy: 3 ideas a day = 1,000+ powerful mental models a year.
          </p>
        </div>

        {/* Footer */}
        <Button variant="primary" className="w-full" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
};
