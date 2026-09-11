import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollRevealProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'whileInView' | 'viewport' | 'transition'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  opacity?: number;
  scale?: number;
  triggerOnce?: boolean;
  className?: string;
}

export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.6,
  y = 30,
  x = 0,
  opacity = 0,
  scale = 1,
  triggerOnce = true,
  className,
  ...props
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: triggerOnce, margin: '-50px' }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, delay = 0.1, className, ...props }: {
  children: ReactNode;
  delay?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { transition: { staggerChildren: delay } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, ...props }: {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}