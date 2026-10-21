import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'mint' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy dark:focus-visible:ring-brand-mint';

  const variants = {
    primary: 'bg-brand-navy hover:bg-brand-navy-light text-white shadow-sm dark:bg-brand-mint dark:text-brand-navy dark:hover:bg-brand-mint-dark',
    secondary: 'bg-brand-border/60 hover:bg-brand-border text-brand-text dark:bg-dark-card dark:hover:bg-dark-border dark:text-dark-text',
    mint: 'bg-brand-mint hover:bg-brand-mint-dark text-brand-navy font-semibold shadow-sm',
    outline: 'border border-brand-border dark:border-dark-border hover:bg-black/5 dark:hover:bg-white/5 text-brand-text dark:text-dark-text',
    ghost: 'hover:bg-black/5 dark:hover:bg-white/5 text-brand-text dark:text-dark-text',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2.5 min-h-[44px]',
    lg: 'text-base px-6 py-3 min-h-[48px]',
    icon: 'p-2.5 min-h-[44px] min-w-[44px]',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />}
      {children}
    </button>
  );
};
