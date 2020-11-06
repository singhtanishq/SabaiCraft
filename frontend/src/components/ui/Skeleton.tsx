import { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    rounded: 'rounded-xl',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-[shimmer_1.5s_ease-in-out_infinite]',
    none: '',
  };

  return (
    <div
      className={cn(
        'bg-olive-100',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className, ...props }: { lines?: number; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className, ...props }: { className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('card p-4 space-y-4', className)} {...props}>
      <Skeleton variant="rectangular" className="aspect-square w-full" />
      <SkeletonText lines={2} />
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="30%" />
    </div>
  );
}

export function SkeletonProductCard({ className, ...props }: { className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('card-interactive p-4 space-y-3', className)} {...props}>
      <Skeleton variant="rectangular" className="aspect-square w-full" />
      <SkeletonText lines={1} />
      <Skeleton variant="text" width="50%" />
      <Skeleton variant="text" width="40%" />
    </div>
  );
}

export function SkeletonProductGrid({ count = 4, className, ...props }: { count?: number; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6', className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
}