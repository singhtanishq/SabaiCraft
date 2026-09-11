import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-olive-100 flex items-center justify-center"
        >
          <Search className="w-12 h-12 text-olive-400" />
        </motion.div>

        <h1 className="heading-display text-display-md mb-4 text-balance">
          404
        </h1>

        <h2 className="heading-1 mb-4">Page Not Found</h2>

        <p className="body-lg text-olive-600 mb-8 max-w-sm mx-auto text-pretty">
          Sorry, we couldn\'t find the page you\'re looking for. It might have been moved or doesn\'t exist.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild variant="primary" size="lg">
            <Link to="/">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/shop">
              <Search className="w-5 h-5 mr-2" />
              Browse Products
            </Link>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-olive-200"
        >
          <p className="text-olive-500 text-body-sm mb-4">Popular destinations:</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/shop" className="text-olive-600 hover:text-olive-900 text-body-sm">Shop All</Link>
            <span className="text-olive-300">·</span>
            <Link to="/categories" className="text-olive-600 hover:text-olive-900 text-body-sm">Categories</Link>
            <span className="text-olive-300">·</span>
            <Link to="/about" className="text-olive-600 hover:text-olive-900 text-body-sm">Our Story</Link>
            <span className="text-olive-300">·</span>
            <Link to="/contact" className="text-olive-600 hover:text-olive-900 text-body-sm">Contact Us</Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}