import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  BookOpen, 
  Bookmark, 
  Search, 
  User, 
  Sparkles, 
  Moon, 
  Sun, 
  Laptop,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { useStore } from '../../lib/store';

export const Sidebar: React.FC = () => {
  const { 
    profile, 
    savedIdeas, 
    savedBooks, 
    theme, 
    setTheme, 
    setAIAssistantOpen 
  } = useStore();

  const totalSaved = savedIdeas.length + savedBooks.length;

  const navItems = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Discover', to: '/discover', icon: Compass },
    { label: 'Book Library', to: '/books', icon: BookOpen },
    { 
      label: 'My Stash', 
      to: '/stash', 
      icon: Bookmark, 
      count: totalSaved 
    },
    { label: 'Search', to: '/search', icon: Search },
    { label: 'Profile & Settings', to: '/profile', icon: User },
  ];

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white dark:bg-dark-surface border-r border-brand-border dark:border-dark-border h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-brand-border/60 dark:border-dark-border/60 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
            <img src="/favicon.svg" alt="Mihiracle" className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-brand-navy dark:text-white font-serif">
              Mihiracle
            </h1>
            <p className="text-[11px] text-brand-muted dark:text-dark-muted font-medium">
              A little learning. Every day.
            </p>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-navy text-white shadow-xs dark:bg-brand-mint dark:text-brand-navy font-semibold'
                    : 'text-brand-text/80 dark:text-dark-text/80 hover:bg-black/5 dark:hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 stroke-[1.8px]" />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-brand-mint/20 text-brand-navy dark:text-white">
                  {item.count}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* AI Learning Assistant trigger button */}
        <div className="pt-4">
          <button
            onClick={() => setAIAssistantOpen(true)}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-brand-navy dark:text-dark-text bg-linear-to-r from-brand-mint/40 to-emerald-100/50 dark:from-brand-mint/10 dark:to-emerald-950/20 border border-brand-mint/60 dark:border-brand-mint/30 hover:shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-brand-mint animate-pulse" />
            <span className="text-left flex-1">Ask AI Companion</span>
          </button>
        </div>
      </nav>

      {/* Bottom Profile & Learning Habit Card */}
      <div className="p-4 border-t border-brand-border/60 dark:border-dark-border/60 space-y-3">
        {/* Daily Goal Progress */}
        <div className="p-3 bg-brand-bg dark:bg-dark-card rounded-xl border border-brand-border/60 dark:border-dark-border/60">
          <div className="flex items-center justify-between text-xs font-medium text-brand-muted dark:text-dark-muted mb-1.5">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-brand-navy dark:text-brand-mint" />
              Daily Goal
            </span>
            <span className="font-semibold text-brand-text dark:text-dark-text">
              {profile.daily_goal_minutes} min/day
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-brand-mint-dark h-full rounded-full w-2/3" />
          </div>
        </div>

        {/* User Pill & Theme Button */}
        <div className="flex items-center justify-between">
          <NavLink to="/profile" className="flex items-center gap-2.5 truncate hover:opacity-85 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy font-bold text-xs flex items-center justify-center shrink-0">
              {profile.display_name ? profile.display_name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-brand-text dark:text-dark-text truncate">
                {profile.display_name || 'Learner'}
              </p>
              <p className="text-[10px] text-brand-muted dark:text-dark-muted truncate">
                {profile.interests?.length || 0} interests tracked
              </p>
            </div>
          </NavLink>

          {/* Theme button */}
          <button
            onClick={cycleTheme}
            className="p-2 text-brand-muted hover:text-brand-text dark:text-dark-muted dark:hover:text-dark-text rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title={`Current theme: ${theme}. Click to change.`}
            aria-label="Toggle theme"
          >
            {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
            {theme === 'dark' && <Moon className="w-4 h-4 text-brand-mint" />}
            {theme === 'system' && <Laptop className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
