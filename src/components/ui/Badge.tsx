import React from 'react';
import { clsx } from 'clsx';
import { Category } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  category?: Category | string;
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  category,
  size = 'sm',
  className,
  onClick,
  selected = false,
}) => {
  const getCategoryStyles = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case 'business':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      case 'psychology':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900';
      case 'productivity':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 'leadership':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'finance':
        return 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-900';
      case 'philosophy':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      case 'science':
        return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900';
      case 'technology & ai':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900';
      case 'strategy':
        return 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border-violet-200 dark:border-violet-900';
      default:
        return 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700';
    }
  };

  const selectedStyles = selected 
    ? '!bg-brand-navy !text-white dark:!bg-brand-mint dark:!text-brand-navy border-transparent shadow-xs'
    : '';

  return (
    <span
      onClick={onClick}
      className={clsx(
        'inline-flex items-center font-medium rounded-full border transition-all duration-150',
        size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : 'text-xs px-3 py-1',
        getCategoryStyles(category),
        selectedStyles,
        onClick && 'cursor-pointer hover:opacity-85 active:scale-95 select-none min-h-[32px]',
        className
      )}
    >
      {children}
    </span>
  );
};
