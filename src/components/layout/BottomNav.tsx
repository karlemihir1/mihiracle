import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, BookOpen, Bookmark, User } from 'lucide-react';
import { useStore } from '../../lib/store';

export const BottomNav: React.FC = () => {
  const { savedIdeas, savedBooks } = useStore();
  const totalSaved = savedIdeas.length + savedBooks.length;

  const navItems = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Discover', to: '/discover', icon: Compass },
    { label: 'Books', to: '/books', icon: BookOpen },
    { 
      label: 'My Stash', 
      to: '/stash', 
      icon: Bookmark, 
      badge: totalSaved > 0 ? totalSaved : undefined 
    },
    { label: 'Profile', to: '/profile', icon: User },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#12141D]/95 backdrop-blur-xl border-t border-[#262A38] pb-safe shadow-2xl"
    >
      <div className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center w-full h-full min-h-[48px] py-1 transition-all duration-200 select-none ${
                  isActive
                    ? 'text-[#D4FF00] font-bold scale-105'
                    : 'text-[#8E92A4] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'stroke-[2.5px] text-[#D4FF00]' : 'stroke-[1.8px]'}`} />
                    {item.badge !== undefined && (
                      <span className="absolute -top-1.5 -right-2 bg-[#D4FF00] text-black font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(212,255,0,0.5)]">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold text-[#D4FF00]' : 'font-medium'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#D4FF00] shadow-[0_0_8px_#D4FF00]" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
