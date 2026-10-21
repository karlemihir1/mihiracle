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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-md border-t border-brand-border/80 dark:border-dark-border/80 pb-safe shadow-lg"
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
                    ? 'text-brand-navy dark:text-brand-mint font-semibold scale-105'
                    : 'text-brand-muted dark:text-dark-muted hover:text-brand-text dark:hover:text-dark-text'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
                    {item.badge !== undefined && (
                      <span className="absolute -top-1 -right-2 bg-brand-mint text-brand-navy font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-dark-surface">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-semibold' : 'font-normal'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-navy dark:bg-brand-mint" />
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
