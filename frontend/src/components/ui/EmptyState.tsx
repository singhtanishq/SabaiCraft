import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  className?: string;
  illustration?: ReactNode;
}

const illustrations = {
  cart: (
    <svg
      className="w-24 h-24 text-olive-200 mx-auto"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  ),
  wishlist: (
    <svg
      className="w-24 h-24 text-olive-200 mx-auto"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  ),
  search: (
    <svg
      className="w-24 h-24 text-olive-200 mx-auto"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  orders: (
    <svg
      className="w-24 h-24 text-olive-200 mx-auto"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  ),
  account: (
    <svg
      className="w-24 h-24 text-olive-200 mx-auto"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  notifications: (
    <svg
      className="w-24 h-24 text-olive-200 mx-auto"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  ),
  products: (
    <svg
      className="w-24 h-24 text-olive-200 mx-auto"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  ),
  generic: (
    <svg
      className="w-24 h-24 text-olive-200 mx-auto"
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
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  illustration,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 sm:py-16 lg:py-20 px-4',
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.1 }}
        className="mb-6"
      >
        {illustration || icon || illustrations.generic}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
        className="max-w-sm"
      >
        <h3 className="font-display font-medium text-olive-950 text-heading-lg mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-body text-olive-600 mb-6">{description}</p>
        )}
        {action && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className={cn(
              'btn',
              action.variant === 'primary' && 'btn-primary',
              action.variant === 'secondary' && 'btn-secondary',
              action.variant === 'outline' && 'btn-outline',
              'btn-md'
            )}
          >
            {action.label}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

// Pre-configured empty states
export function EmptyCart({ onContinueShopping }: { onContinueShopping: () => void }) {
  return (
    <EmptyState
      illustration={illustrations.cart}
      title="Your cart is empty"
      description="Looks like you haven't added any treasures yet. Explore our collection and find something you love."
      action={{
        label: 'Continue Shopping',
        onClick: onContinueShopping,
        variant: 'primary',
      }}
    />
  );
}

export function EmptyWishlist({ onBrowseProducts }: { onBrowseProducts: () => void }) {
  return (
    <EmptyState
      illustration={illustrations.wishlist}
      title="Your wishlist is empty"
      description="Save items you love by clicking the heart icon on any product. They'll appear here for easy access later."
      action={{
        label: 'Browse Products',
        onClick: onBrowseProducts,
        variant: 'primary',
      }}
    />
  );
}

export function EmptySearch({ query }: { query: string }) {
  return (
    <EmptyState
      illustration={illustrations.search}
      title="No results found"
      description={`We couldn't find any products matching "${query}". Try adjusting your search or browse our categories.`}
      action={{
        label: 'Clear Search',
        onClick: () => window.location.href = '/shop',
        variant: 'outline',
      }}
    />
  );
}

export function EmptyOrders({ onStartShopping }: { onStartShopping: () => void }) {
  return (
    <EmptyState
      illustration={illustrations.orders}
      title="No orders yet"
      description="When you place an order, it will appear here. You'll be able to track its progress and view past purchases."
      action={{
        label: 'Start Shopping',
        onClick: onStartShopping,
        variant: 'primary',
      }}
    />
  );
}

export function EmptyAccount({ onLogin }: { onLogin: () => void }) {
  return (
    <EmptyState
      illustration={illustrations.account}
      title="Welcome to SabaiCraft"
      description="Create an account or sign in to track orders, save favorites, and enjoy a personalized experience."
      action={{
        label: 'Sign In',
        onClick: onLogin,
        variant: 'primary',
      }}
    />
  );
}