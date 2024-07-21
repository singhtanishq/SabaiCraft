import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function AuthLayout() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn('flex-1 flex items-center justify-center py-12 px-4')}
    >
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </motion.div>
  );
}