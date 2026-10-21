import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  BookOpen, 
  Bookmark, 
  Search, 
  User, 
  Sparkles, 
  X, 
  TrendingUp, 
  Sun, 
  Moon, 
  Laptop,
  Flame,
  Zap
} from 'lucide-react';
import { useStore } from '../../lib/store';

export const SideMenuDrawer: React.FC = () => {
  const location = useLocation();
  const { 
    isSideMenuOpen, 
    setSideMenuOpen, 
    profile, 
    savedIdeas, 
    savedBooks, 
    streak,
    theme, 
    setTheme,
    setDiscoverModalOpen,
    setAIAssistantOpen
  } = useStore();

  const totalSaved = savedIdeas.length + savedBooks.length;

  // Close drawer on route change
  useEffect(() => {
    setSideMenuOpen(false);
  }, [location.pathname, setSideMenuOpen]);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSideMenuOpen(false);
    };
    if (isSideMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isSideMenuOpen, setSideMenuOpen]);

  if (!isSideMenuOpen) return null;

  const navItems = [
    { label: 'Dashboard', to: '/', icon: Home },
    { label: 'Discover', to: '/discover', icon: Compass },
    { label: 'Book Library', to: '/books', icon: BookOpen },
    { label: 'My Stash', to: '/stash', icon: Bookmark, count: totalSaved },
    { label: 'Search', to: '/search', icon: Search },
    { label: 'Profile & Settings', to: '/profile', icon: User },
  ];

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex animate-in fade-in duration-200"
      aria-label="Navigation Menu"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={() => setSideMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Side Menu Drawer Sheet (Sliding from Left) */}
      <aside 
        className="relative z-10 w-80 max-w-[85vw] h-full bg-[#12141D] text-white border-r border-[#262A38] shadow-2xl flex flex-col justify-between overflow-y-auto no-scrollbar animate-in slide-in-from-left duration-300 rounded-r-[32px]"
      >
        {/* Top Brand Header */}
        <div>
          <div className="p-6 border-b border-[#262A38]/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#D4FF00] flex items-center justify-center shadow-[0_0_20px_rgba(212,255,0,0.4)]">
                <span className="font-extrabold text-black text-xl tracking-tighter">M</span>
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  Mihiracle
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#D4FF00]/15 text-[#D4FF00] border border-[#D4FF00]/30">
                    PRO
                  </span>
                </h2>
                <p className="text-[11px] text-[#8E92A4] font-medium">
                  A little learning. Every day.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSideMenuOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Discover Theories Button (Capi Creative Neon Highlight) */}
          <div className="px-4 pt-5 pb-2">
            <button
              onClick={() => {
                setSideMenuOpen(false);
                setDiscoverModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl bg-[#D4FF00] hover:bg-[#c2eb00] text-black font-extrabold text-sm shadow-[0_0_25px_rgba(212,255,0,0.35)] active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-black fill-black" />
              <span>Discover New Theories</span>
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="px-3 py-3 space-y-1">
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

            {/* AI Assistant Quick Trigger */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setSideMenuOpen(false);
                  setAIAssistantOpen(true);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-white/90 bg-[#1A1D27] hover:bg-[#202431] border border-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-[#00F0FF]" />
                  <span>Ask AI Companion</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30">
                  LIVE
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom Section: Habit Streak & User Info */}
        <div className="p-4 border-t border-[#262A38]/80 space-y-3 bg-[#0F1118]">
          {/* Daily Streak Stat Pill */}
          <div className="p-3.5 rounded-2xl bg-[#171924] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Flame className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  {streak.streak_days} Day Streak
                </p>
                <p className="text-[10px] text-[#8E92A4]">
                  {streak.today_completed_ids.length}/{streak.daily_target} ideas read today
                </p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-[#D4FF00] flex items-center justify-center text-[10px] font-bold text-[#D4FF00]">
              ✓
            </div>
          </div>

          {/* User profile & theme cycle */}
          <div className="flex items-center justify-between pt-1">
            <NavLink 
              to="/profile" 
              className="flex items-center gap-2.5 truncate hover:opacity-85 transition-opacity"
            >
              <div className="w-9 h-9 rounded-full bg-[#D4FF00] text-black font-extrabold text-sm flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(212,255,0,0.3)]">
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

            {/* Theme Toggle Button */}
            <button
              onClick={cycleTheme}
              className="p-2.5 text-[#8E92A4] hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              title={`Theme: ${theme}. Click to change.`}
              aria-label="Toggle Theme"
            >
              {theme === 'light' && <Sun className="w-4 h-4 text-amber-400" />}
              {theme === 'dark' && <Moon className="w-4 h-4 text-[#D4FF00]" />}
              {theme === 'system' && <Laptop className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
