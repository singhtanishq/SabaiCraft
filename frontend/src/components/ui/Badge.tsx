import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'primary', size = 'md', dot = false, children, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-sage-100 text-sage-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-amber-100 text-amber-800',
      danger: 'bg-red-100 text-red-800',
      neutral: 'bg-olive-100 text-olive-800',
      outline: 'bg-transparent border border-olive-300 text-olive-700',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-caption',
      md: 'px-2.5 py-1 text-caption',
      lg: 'px-3 py-1.5 text-body-sm',
    };

    const dotColors = {
      primary: 'bg-sage-600',
      success: 'bg-green-600',
      warning: 'bg-amber-600',
      danger: 'bg-red-600',
      neutral: 'bg-olive-600',
      outline: 'bg-olive-400',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';