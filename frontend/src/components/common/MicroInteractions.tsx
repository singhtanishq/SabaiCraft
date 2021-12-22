import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface MagneticButtonProps extends Omit<HTMLMotionProps<'button'>, 'onMouseMove' | 'onMouseLeave' | 'onMouseEnter'> {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticButton({
  children,
  strength = 0.3,
  className,
  ...props
}: MagneticButtonProps) {
  const ref = motion.useMotionValue({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.set({ x: x * strength, y: y * strength });
  };

  const handleMouseLeave = () => {
    ref.set({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref as any}
      style={{
        x: ref.x,
        y: ref.y,
        transformOrigin: 'center center',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

interface RippleProps extends Omit<HTMLMotionProps<'button'>, 'onClick'> {
  children: ReactNode;
  className?: string;
  rippleColor?: string;
}

export function RippleButton({
  children,
  className,
  rippleColor = 'currentColor',
  ...props
}: RippleProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...(props.style || {}) }}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.3 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: '20px',
            height: '20px',
            marginLeft: '-10px',
            marginTop: '-10px',
            borderRadius: '50%',
            background: rippleColor,
            pointerEvents: 'none',
          }}
        />
      ))}
    </button>
  );
}

import { useState } from 'react';

interface HoverScaleProps {
  children: ReactNode;
  scale?: number;
  className?: string;
}

export function HoverScale({ children, scale = 1.02, className }: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: scale * 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ShimmerEffect({ children, className, ...props }: {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <motion.div
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...props.style }}
      {...props}
    >
      {children}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          transform: 'skewX(-20deg)',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  );
}