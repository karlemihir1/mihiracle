import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, WifiOff, Sun, Moon, Laptop, Menu } from 'lucide-react';
import { useStore } from '../../lib/store';
import { HabitStreakBadge } from '../habit/HabitStreakBadge';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isOnline, 
    setAIAssistantOpen, 
    setSideMenuOpen,
    setDiscoverModalOpen,
    theme, 
    setTheme 
  } = useStore();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0B0C10]/90 text-white backdrop-blur-xl border-b border-[#262A38] transition-colors">
      <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 max-w-5xl mx-auto gap-2">
        {/* Left Side: Toggle Menu Button & Brand */}
        <div className="flex items-center gap-2">
          {/* Left Side Menu Toggle Button */}
          <button
            onClick={() => setSideMenuOpen(true)}
            className="p-2 -ml-1 rounded-2xl bg-white/5 hover:bg-white/10 text-white active:scale-95 transition-all flex items-center justify-center min-h-[42px] min-w-[42px] border border-white/5 shadow-xs cursor-pointer"
            aria-label="Toggle Side Menu"
            title="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-[#D4FF00]" />
          </button>

          {/* Mobile Brand / Logo */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#D4FF00] flex items-center justify-center shadow-[0_0_12px_rgba(212,255,0,0.4)]">
              <span className="font-extrabold text-black text-sm">M</span>
            </div>
            <span className="font-bold text-base text-white tracking-tight">
              Mihiracle
            </span>
          </div>
        </div>

        {/* Desktop Center: Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-3">
          <button
            onClick={() => navigate('/search')}
            className="w-full flex items-center justify-between px-4 py-2 bg-[#161822] border border-[#262A38] hover:border-[#D4FF00]/50 rounded-2xl text-xs text-[#8E92A4] hover:text-white transition-all shadow-xs group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-[#8E92A4] group-hover:text-[#D4FF00] transition-colors" />
              <span>Search ideas, theories, books...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white/5 text-[#8E92A4] rounded border border-white/10">
              /
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* On-Screen Action: Discover New Theories Button */}
          <button
            onClick={() => setDiscoverModalOpen(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-2xl bg-[#D4FF00] hover:bg-[#c2eb00] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(212,255,0,0.35)] active:scale-95 transition-all min-h-[40px] cursor-pointer"
            title="Discover New Theories & Ideas"
          >
            <Sparkles className="w-4 h-4 text-black fill-black" />
            <span className="whitespace-nowrap">Discover Theories</span>
          </button>

          {/* Daily Habit Streak Badge */}
          <HabitStreakBadge />

          {/* Offline indicator */}
          {!isOnline && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded-full text-xs font-medium">
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          )}

          {/* Mobile Search Button */}
          <button
            onClick={() => navigate('/search')}
            className="md:hidden p-2 rounded-xl text-[#8E92A4] hover:text-white hover:bg-white/5 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Open Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* AI Companion Quick Trigger */}
          <button
            onClick={() => setAIAssistantOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#1A1D27] hover:bg-[#222634] text-white border border-white/10 font-semibold text-xs transition-all active:scale-95 shadow-xs min-h-[40px] cursor-pointer"
            aria-label="Open AI Assistant"
          >
            <Sparkles className="w-4 h-4 text-[#00F0FF]" />
            <span>Ask AI</span>
          </button>

          {/* Theme Toggle (Mobile) */}
          <button
            onClick={cycleTheme}
            className="md:hidden p-2 text-[#8E92A4] hover:text-white rounded-xl hover:bg-white/5 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'light' && <Sun className="w-4 h-4 text-amber-400" />}
            {theme === 'dark' && <Moon className="w-4 h-4 text-[#D4FF00]" />}
            {theme === 'system' && <Laptop className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>
    </header>
  );
};
