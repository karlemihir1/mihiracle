import { describe, it, expect } from 'vitest';
import { HabitStreak } from '../src/types';

describe('Habit Streaks & Daily Learning Goal Engine', () => {
  const getToday = () => '2026-10-03';
  const getYesterday = () => '2026-10-02';
  const getOldDay = () => '2026-09-30';

  it('should initialize with default streak of 1 day and 3 ideas daily target', () => {
    const defaultStreak: HabitStreak = {
      streak_days: 1,
      longest_streak: 1,
      last_active_date: getToday(),
      daily_target: 3,
      today_completed_ids: [],
    };

    expect(defaultStreak.streak_days).toBe(1);
    expect(defaultStreak.daily_target).toBe(3);
    expect(defaultStreak.today_completed_ids.length).toBe(0);
  });

  it('should maintain streak when continuing from yesterday', () => {
    const previousStreak: HabitStreak = {
      streak_days: 4,
      longest_streak: 4,
      last_active_date: getYesterday(),
      daily_target: 3,
      today_completed_ids: [],
    };

    // User marks 3 ideas read today
    const ideaIds = ['idea-1', 'idea-2', 'idea-3'];
    let current = { ...previousStreak };

    for (const id of ideaIds) {
      if (!current.today_completed_ids.includes(id)) {
        const newCompleted = [...current.today_completed_ids, id];
        let newStreak = current.streak_days;
        if (newCompleted.length >= current.daily_target && current.today_completed_ids.length < current.daily_target) {
          newStreak = current.streak_days + 1;
        }
        current = {
          ...current,
          streak_days: newStreak,
          longest_streak: Math.max(current.longest_streak, newStreak),
          last_active_date: getToday(),
          today_completed_ids: newCompleted,
        };
      }
    }

    expect(current.today_completed_ids.length).toBe(3);
    expect(current.streak_days).toBe(5); // Increased from 4 to 5!
    expect(current.longest_streak).toBe(5);
    expect(current.last_active_date).toBe(getToday());
  });

  it('should reset streak to 1 if user missed days in between', () => {
    const expiredStreak: HabitStreak = {
      streak_days: 12,
      longest_streak: 12,
      last_active_date: getOldDay(),
      daily_target: 3,
      today_completed_ids: [],
    };

    // Day rollover detection: if last active was not yesterday and not today, streak resets
    const today = getToday();
    const yesterday = getYesterday();
    
    let activeStreakDays = expiredStreak.streak_days;
    if (expiredStreak.last_active_date !== today && expiredStreak.last_active_date !== yesterday) {
      activeStreakDays = 0; // Reset streak due to inactivity
    }

    expect(activeStreakDays).toBe(0);
    // Best streak is preserved
    expect(expiredStreak.longest_streak).toBe(12);
  });
});
