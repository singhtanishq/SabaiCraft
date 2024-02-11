import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-sage-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Outlet /></motion.div>;
}