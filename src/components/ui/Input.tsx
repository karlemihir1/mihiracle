import React from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  className,
  icon,
  rightElement,
  error,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-brand-muted dark:text-dark-muted pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-xl text-sm transition-all duration-200 outline-none',
            'placeholder:text-brand-muted/70 dark:placeholder:text-dark-muted/70 text-brand-text dark:text-dark-text',
            'focus:border-brand-navy dark:focus:border-brand-mint focus:ring-1 focus:ring-brand-navy dark:focus:ring-brand-mint',
            'min-h-[44px] py-2.5',
            icon ? 'pl-10' : 'pl-4',
            rightElement ? 'pr-11' : 'pr-4',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
