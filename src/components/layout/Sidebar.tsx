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
    setAIAssistantOpen,
    setDiscoverModalOpen 
  } = useStore();

  const totalSaved = savedIdeas.length + savedBooks.length;

  const navItems = [
    { label: 'Dashboard', to: '/', icon: Home },
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
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#12141D] text-white border-r border-[#262A38] h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#262A38]/80 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-[#D4FF00] flex items-center justify-center shadow-[0_0_20px_rgba(212,255,0,0.4)] group-hover:scale-105 transition-transform duration-200">
            <span className="font-extrabold text-black text-xl tracking-tighter">M</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Mihiracle
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#D4FF00]/15 text-[#D4FF00] border border-[#D4FF00]/30">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-[#8E92A4] font-medium">
              A little learning. Every day.
            </p>
          </div>
        </NavLink>
      </div>

      {/* Quick Discover Theories Button */}
      <div className="px-4 pt-4 pb-1">
        <button
          onClick={() => setDiscoverModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#D4FF00] hover:bg-[#c2eb00] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(212,255,0,0.35)] active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-black fill-black" />
          <span>Discover New Theories</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#D4FF00] text-black shadow-[0_0_20px_rgba(212,255,0,0.3)] font-bold'
                    : 'text-[#8E92A4] hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-black stroke-[2.2px]' : 'text-[#8E92A4] stroke-[1.8px]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive 
                        ? 'bg-black text-[#D4FF00]' 
                        : 'bg-white/10 text-white'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* AI Learning Assistant trigger button */}
        <div className="pt-2">
          <button
            onClick={() => setAIAssistantOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-white/90 bg-[#1A1D27] hover:bg-[#202431] border border-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#00F0FF]" />
              <span>Ask AI Companion</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30">
              LIVE
            </span>
          </button>
        </div>
      </nav>

      {/* Bottom Profile & Learning Habit Card */}
      <div className="p-4 border-t border-[#262A38]/80 space-y-3 bg-[#0F1118]">
        {/* Daily Goal Progress */}
        <div className="p-3.5 bg-[#171924] rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8E92A4] mb-2">
            <span className="flex items-center gap-1.5 text-white">
              <TrendingUp className="w-3.5 h-3.5 text-[#D4FF00]" />
              Daily Habit Goal
            </span>
            <span className="font-extrabold text-[#D4FF00]">
              {profile.daily_goal_minutes}m
            </span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#D4FF00] shadow-[0_0_10px_rgba(212,255,0,0.5)] h-full rounded-full w-2/3" />
          </div>
        </div>

        {/* User Pill & Theme Button */}
        <div className="flex items-center justify-between pt-1">
          <NavLink to="/profile" className="flex items-center gap-2.5 truncate hover:opacity-85 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-[#D4FF00] text-black font-extrabold text-xs flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(212,255,0,0.3)]">
              {profile.display_name ? profile.display_name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">
                {profile.display_name || 'Mihir'}
              </p>
              <p className="text-[10px] text-[#8E92A4] truncate">
                {profile.interests?.length || 5} topics tracked
              </p>
            </div>
          </NavLink>

          {/* Theme button */}
          <button
            onClick={cycleTheme}
            className="p-2 text-[#8E92A4] hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            title={`Current theme: ${theme}. Click to change.`}
            aria-label="Toggle theme"
          >
            {theme === 'light' && <Sun className="w-4 h-4 text-amber-400" />}
            {theme === 'dark' && <Moon className="w-4 h-4 text-[#D4FF00]" />}
            {theme === 'system' && <Laptop className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
