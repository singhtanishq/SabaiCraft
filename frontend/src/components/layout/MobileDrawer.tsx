import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, ChevronRight, ShoppingBag, Heart, User, Search } from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../utils/cn';

const mobileNavigation = [
  { name: 'Home', href: '/', icon: null },
  { name: 'Shop', href: '/shop', icon: null },
  { name: 'Categories', href: '/categories', icon: null },
  { name: 'Our Story', href: '/about', icon: null },
  { name: 'Contact', href: '/contact', icon: null },
];

const mobileAccountLinks = [
  { name: 'My Account', href: '/account', icon: User },
  { name: 'My Orders', href: '/orders', icon: null },
  { name: 'Wishlist', href: '/wishlist', icon: Heart },
  { name: 'Addresses', href: '/account/addresses', icon: null },
  { name: 'Settings', href: '/account/settings', icon: null },
];

export function MobileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { cart, openCart, closeCart, getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const cartCount = getItemCount();
  const wishlistCount = wishlistItems.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      size="full"
      title="Menu"
      showCloseButton
      className="max-w-[300px]"
    >
      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-olive-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="input pl-10"
            autoFocus
          />
        </div>
      </form>

      {/* Cart & Wishlist Quick Access */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => { openCart(); onClose(); }}
          className="relative btn btn-outline btn-sm justify-center"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-olive-950 text-cream-50 text-xs font-medium rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        <Link
          to="/wishlist"
          onClick={() => onClose()}
          className="relative btn btn-outline btn-sm justify-center"
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist</span>
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 mb-6" aria-label="Main navigation">
        {mobileNavigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => onClose()}
            className={cn(
              'flex items-center justify-between px-3 py-3 rounded-lg transition-colors',
              location.pathname === item.href
                ? 'bg-sage-50 text-olive-950 font-medium'
                : 'text-olive-600 hover:bg-olive-50 hover:text-olive-950'
            )}
          >
            <span className="font-medium text-body">{item.name}</span>
            {location.pathname === item.href && (
              <motion.span
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                className="text-sage-600"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.span>
            )}
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="divider my-4" />

      {/* Account Section */}
      <div className="space-y-3">
        {isAuthenticated ? (
          <>
            <div className="px-3 py-3 bg-olive-50 rounded-lg">
              <p className="font-medium text-olive-900 text-body-sm">{user?.name}</p>
              <p className="text-olive-500 text-caption truncate">{user?.email}</p>
            </div>
            {mobileAccountLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => onClose()}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-olive-600 hover:bg-olive-50 hover:text-olive-950 transition-colors"
              >
                {link.icon && <link.icon className="w-5 h-5" />}
                <span className="font-medium text-body-sm">{link.name}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="font-medium text-body-sm">Logout</span>
            </button>
          </>
        ) : (
          <div className="space-y-3">
            <Link
              to="/login"
              onClick={() => onClose()}
              className="btn btn-primary btn-md w-full justify-center"
            >
              <User className="w-4 h-4" />
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => onClose()}
              className="btn btn-outline btn-md w-full justify-center"
            >
              <User className="w-4 h-4" />
              Create Account
            </Link>
          </div>
        )}
      </div>
    </Drawer>
  );
}

function handleSearch(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  // This is handled by the form's onSubmit
}

function handleLogout() {
  // Logout is handled by the auth store
}