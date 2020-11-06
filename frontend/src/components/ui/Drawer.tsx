import { Fragment, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  position?: 'left' | 'right' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

const positionClasses = {
  left: 'left-0',
  right: 'right-0',
  bottom: 'bottom-0 left-0 right-0',
};

const sizeClasses = {
  sm: 'w-72',
  md: 'w-96',
  lg: 'w-[32rem]',
  xl: 'w-[36rem]',
  full: 'w-full max-w-2xl',
};

const bottomSizeClasses = {
  sm: 'h-[25vh]',
  md: 'h-[40vh]',
  lg: 'h-[55vh]',
  xl: 'h-[70vh]',
  full: 'h-[90vh]',
};

export function Drawer({
  isOpen,
  onClose,
  children,
  title,
  description,
  position = 'right',
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
}: DrawerProps) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose();
    }
  };

  const isBottom = position === 'bottom';

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300]"
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden="true"
          />
          <motion.div
            initial={{
              opacity: 0,
              x: isBottom ? 0 : position === 'left' ? -300 : 300,
              y: isBottom ? 300 : 0,
            }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{
              opacity: 0,
              x: isBottom ? 0 : position === 'left' ? -300 : 300,
              y: isBottom ? 300 : 0,
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'fixed z-[400] flex flex-col bg-white shadow-elevated',
              positionClasses[position],
              isBottom ? bottomSizeClasses[size] : sizeClasses[size],
              className
            )}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'drawer-title' : undefined}
            aria-describedby={description ? 'drawer-description' : undefined}
          >
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between p-4 sm:p-6 border-b border-olive-100 flex-shrink-0">
                <div>
                  {title && (
                    <h2 id="drawer-title" className="font-display font-medium text-olive-950 text-heading-lg">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id="drawer-description" className="mt-1 text-body-sm text-olive-600">
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="btn-icon text-olive-400 hover:text-olive-700 hover:bg-olive-100 transition-colors"
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {children}
            </div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}