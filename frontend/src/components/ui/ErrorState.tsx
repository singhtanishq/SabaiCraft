import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  code?: string | number;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  showCode?: boolean;
}

const errorIllustrations = {
  404: (
    <svg
      className="w-28 h-28 text-olive-200 mx-auto"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  500: (
    <svg
      className="w-28 h-28 text-olive-200 mx-auto"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  network: (
    <svg
      className="w-28 h-28 text-olive-200 mx-auto"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M18.364 5.636l-3.536 3.536m0 0l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
  generic: (
    <svg
      className="w-28 h-28 text-olive-200 mx-auto"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
};

export function ErrorState({
  title,
  description,
  code,
  icon,
  action,
  secondaryAction,
  className,
  showCode = true,
}: ErrorStateProps) {
  const getIllustration = () => {
    if (icon) return icon;
    if (code === 404 || title?.toLowerCase().includes('not found')) return errorIllustrations[404];
    if (code === 500 || title?.toLowerCase().includes('server')) return errorIllustrations[500];
    if (title?.toLowerCase().includes('network') || title?.toLowerCase().includes('connection')) return errorIllustrations.network;
    return errorIllustrations.generic;
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 sm:py-16 lg:py-20 px-4 min-h-[60vh]',
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.1 }}
        className="mb-6"
      >
        {getIllustration()}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
        className="max-w-sm"
      >
        <h2 className="font-display font-medium text-olive-950 text-heading-xl mb-2">
          {title || (code === 404 ? 'Page Not Found' : 'Something went wrong')}
        </h2>
        {showCode && code && (
          <span className="badge badge-neutral mb-4">{code}</span>
        )}
        <p className="text-body text-olive-600 mb-6">
          {description || (code === 404
            ? 'Sorry, we couldn\'t find the page you\'re looking for. It might have been moved or doesn\'t exist.'
            : 'An unexpected error occurred. Please try again or contact support if the problem persists.')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant === 'primary' ? 'primary' : action.variant === 'secondary' ? 'secondary' : 'outline'}
              size="md"
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="ghost"
              size="md"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function NotFound({ onGoHome }: { onGoHome?: () => void }) {
  return (
    <ErrorState
      code={404}
      title="Page Not Found"
      description="Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist."
      action={{
        label: 'Go Home',
        onClick: onGoHome || (() => window.location.href = '/'),
        variant: 'primary',
      }}
      secondaryAction={{
        label: 'Contact Support',
        onClick: () => window.location.href = '/contact',
      }}
    />
  );
}

export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      code={500}
      title="Server Error"
      description="Something went wrong on our end. Our team has been notified and we're working to fix it."
      action={{
        label: 'Try Again',
        onClick: onRetry || (() => window.location.reload()),
        variant: 'primary',
      }}
      secondaryAction={{
        label: 'Go Home',
        onClick: () => window.location.href = '/',
      }}
    />
  );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Connection Lost"
      description="Please check your internet connection and try again."
      action={{
        label: 'Retry',
        onClick: onRetry || (() => window.location.reload()),
        variant: 'primary',
      }}
      secondaryAction={{
        label: 'Go Home',
        onClick: () => window.location.href = '/',
      }}
    />
  );
}

export function AccessDenied({ onGoHome }: { onGoHome?: () => void }) {
  return (
    <ErrorState
      code={403}
      title="Access Denied"
      description="You don't have permission to access this page. Please log in or contact support if you believe this is an error."
      action={{
        label: 'Go Home',
        onClick: onGoHome || (() => window.location.href = '/'),
        variant: 'primary',
      }}
      secondaryAction={{
        label: 'Sign In',
        onClick: () => window.location.href = '/login',
      }}
    />
  );
}