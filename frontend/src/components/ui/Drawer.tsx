import { Fragment, ReactNode, useEffect, useRef } from 'react';
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
  bodyClassName?: string;
}

const positionClasses = {
  left: 'left-0',
  right: 'right-0',
  bottom: 'bottom-0 left-0 right-0',
};

const sizeClasses = {
  sm: 'w-72 max-w-full',
  md: 'w-96 max-w-full',
  lg: 'w-[32rem] max-w-full',
  xl: 'w-[36rem] max-w-full',
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
  bodyClassName,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll and close on Escape while open.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
        return;
      }
      // Minimal focus trap: keep Tab cycling inside the drawer.
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEscape]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => {
        panelRef.current?.focus();
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isOpen]);

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
            ref={panelRef}
            tabIndex={-1}
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
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={cn(
              'fixed z-[400] flex flex-col bg-white shadow-elevated focus:outline-none',
              positionClasses[position],
              isBottom ? bottomSizeClasses[size] : sizeClasses[size],
              className
            )}
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
            <div className={cn('flex-1 overflow-y-auto p-4 sm:p-6', bodyClassName)}>
              {children}
            </div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
