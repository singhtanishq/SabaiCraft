import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  ShoppingBag,
  Heart,
  User,
  LogIn,
  LogOut,
  UserPlus,
  ChevronDown,
  Package,
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../utils/cn';
import { useToastHelpers } from '../ui/Toast';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Categories', href: '/categories' },
  { name: 'Our Story', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const accountLinks = [
  { name: 'My Account', href: '/account', icon: User },
  { name: 'My Orders', href: '/orders', icon: Package },
  { name: 'Wishlist', href: '/wishlist', icon: Heart },
];

function isActivePath(current: string, href: string) {
  if (href === '/') return current === '/';
  return current === href || current.startsWith(`${href}/`);
}

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { openCart, getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { openSearch } = useUIStore();
  const { success } = useToastHelpers();

  const cartCount = getItemCount();
  const wishlistCount = wishlistItems.length;

  // Close user menu on outside click or Escape.
  useEffect(() => {
    if (!isUserMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsUserMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isUserMenuOpen]);

  // Close the user menu whenever the route changes.
  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
    useCartStore.getState().disableBackendSync();
    useWishlistStore.getState().disableBackendSync();
    success('Logged out', 'You have been successfully logged out');
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[200] bg-white/95 backdrop-blur-md border-b border-olive-100 transition-all duration-normal">
      {/* Mobile bar */}
      <div className="lg:hidden bg-olive-950 text-cream-50 px-4 py-2.5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="SabaiCraft Home">
            <img src="/Images/logo.png" alt="" className="w-8 h-8" />
            <span className="font-display font-medium text-body-sm">SabaiCraft</span>
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={openSearch}
              className="p-2 text-cream-50 hover:text-sabai-400 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={openCart}
              className="relative p-2 text-cream-50 hover:text-sabai-400 transition-colors"
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-sabai-500 text-olive-950 text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
            <button
              onClick={onMenuClick}
              className="p-2 text-cream-50 hover:text-sabai-400 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:flex items-center justify-between px-6 xl:px-10 py-3.5 max-w-[1600px] mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0" aria-label="SabaiCraft Home">
          <img src="/Images/logo.png" alt="" className="w-10 h-10" />
          <span className="font-display font-medium text-olive-950 text-heading-md">SabaiCraft</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'font-medium text-body-sm transition-colors relative py-1',
                isActivePath(location.pathname, item.href)
                  ? 'text-olive-950'
                  : 'text-olive-600 hover:text-olive-950'
              )}
              aria-current={isActivePath(location.pathname, item.href) ? 'page' : undefined}
            >
              {item.name}
              {isActivePath(location.pathname, item.href) && (
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="absolute bottom-[-2px] left-0 h-0.5 bg-sage-600 rounded-full"
                  aria-hidden="true"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={openSearch}
            className="btn-ghost btn-icon-lg"
            aria-label="Search products"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            to="/wishlist"
            className="relative btn-ghost btn-icon-lg"
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>

          <button
            onClick={openCart}
            className="relative btn-ghost btn-icon-lg"
            aria-label={`Cart, ${cartCount} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-olive-950 text-cream-50 text-[10px] font-semibold rounded-full flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Account menu */}
          <div className="relative ml-1" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen((v) => !v)}
              className="flex items-center gap-2 btn-ghost btn-sm"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
              aria-label={isAuthenticated ? 'Account menu' : 'Sign in menu'}
            >
              {isAuthenticated ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-sage-600" />
                  </div>
                  <span className="hidden xl:block text-body-sm font-medium text-olive-700 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span className="hidden xl:block text-body-sm font-medium text-olive-700">Account</span>
                </>
              )}
              <ChevronDown className={cn('w-4 h-4 text-olive-500 transition-transform', isUserMenuOpen && 'rotate-180')} aria-hidden="true" />
            </button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl border border-olive-100 shadow-elevated py-2 z-[300]"
                  role="menu"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-olive-100">
                        <p className="font-medium text-olive-900 text-body-sm truncate">{user?.name}</p>
                        <p className="text-olive-500 text-caption truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        {accountLinks.map((link) => (
                          <Link
                            key={link.name}
                            to={link.href}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-olive-700 hover:bg-olive-50 hover:text-olive-950 transition-colors"
                            role="menuitem"
                          >
                            <link.icon className="w-4 h-4 text-olive-400" aria-hidden="true" />
                            {link.name}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-olive-100 pt-1 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-body-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                          role="menuitem"
                        >
                          <LogOut className="w-4 h-4" aria-hidden="true" />
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 space-y-2">
                      <Link
                        to="/login"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn btn-primary btn-md w-full"
                        role="menuitem"
                      >
                        <LogIn className="w-4 h-4" />
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn btn-outline btn-md w-full"
                        role="menuitem"
                      >
                        <UserPlus className="w-4 h-4" />
                        Create Account
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
