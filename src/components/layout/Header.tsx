import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, WifiOff, Sun, Moon, Laptop, Plus } from 'lucide-react';
import { useStore } from '../../lib/store';
import { HabitStreakBadge } from '../habit/HabitStreakBadge';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isOnline, 
    setAIAssistantOpen, 
    theme, 
    setTheme 
  } = useStore();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <header className="sticky top-0 z-30 bg-brand-bg/90 dark:bg-dark-bg/90 backdrop-blur-md border-b border-brand-border/60 dark:border-dark-border/60 transition-colors">
      <div className="flex items-center justify-between px-4 py-3 max-w-5xl mx-auto">
        {/* Mobile Left: Brand / Logo */}
        <div className="md:hidden flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-navy flex items-center justify-center shadow-xs">
            <img src="/favicon.svg" alt="Mihiracle" className="w-5 h-5" />
          </div>
          <span className="font-serif font-bold text-lg text-brand-navy dark:text-white tracking-tight">
            Mihiracle
          </span>
        </div>

        {/* Desktop Left: Context or Quick Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <button
            onClick={() => navigate('/search')}
            className="w-full flex items-center justify-between px-3.5 py-2 bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-xl text-sm text-brand-muted dark:text-dark-muted hover:border-brand-navy dark:hover:border-brand-mint transition-colors shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-brand-muted group-hover:text-brand-navy dark:group-hover:text-brand-mint transition-colors" />
              <span>Search ideas, books, topics, or ask AI...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-stone-100 dark:bg-dark-border text-stone-500 dark:text-stone-400 rounded border border-stone-200 dark:border-stone-700">
              /
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Daily Habit Streak Badge */}
          <HabitStreakBadge />

          {/* Offline indicator */}
          {!isOnline && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 rounded-full text-xs font-medium">
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offline Mode</span>
            </div>
          )}

          {/* Mobile Search Button */}
          <button
            onClick={() => navigate('/search')}
            className="md:hidden p-2 rounded-xl text-brand-text dark:text-dark-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* AI Companion Quick Trigger */}
          <button
            onClick={() => setAIAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-mint text-brand-navy font-semibold text-xs hover:bg-brand-mint-dark transition-all active:scale-95 shadow-2xs min-h-[40px] cursor-pointer"
            aria-label="Open AI Assistant"
          >
            <Sparkles className="w-4 h-4 text-brand-navy fill-brand-navy/20" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Theme Toggle (Mobile) */}
          <button
            onClick={cycleTheme}
            className="md:hidden p-2 text-brand-muted hover:text-brand-text dark:text-dark-muted dark:hover:text-dark-text rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
            {theme === 'dark' && <Moon className="w-4 h-4 text-brand-mint" />}
            {theme === 'system' && <Laptop className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
