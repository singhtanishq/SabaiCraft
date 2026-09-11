import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  Heart,
  User,
  LogIn,
  UserPlus,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { MobileDrawer } from './MobileDrawer';
import { Drawer } from '../ui/Drawer';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
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
  { name: 'My Account', href: '/account' },
  { name: 'Orders', href: '/orders' },
  { name: 'Wishlist', href: '/wishlist' },
  { name: 'Addresses', href: '/account/addresses' },
  { name: 'Settings', href: '/account/settings' },
];

export function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { cart, isCartOpen, openCart, closeCart, getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { success } = useToastHelpers();

  const cartCount = getItemCount();
  const wishlistCount = wishlistItems.length;

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleLogout = () => {
    logout();
    success('Logged out', 'You have been successfully logged out');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[200] bg-white/95 backdrop-blur-md border-b border-olive-100 transition-all duration-normal">
      {/* Top Bar - Mobile only */}
      <div className="lg:hidden bg-olive-950 text-cream-50 px-4 py-2">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="SabaiCraft Home">
            <img src="/Images/logo.png" alt="SabaiCraft" className="w-8 h-8" />
            <span className="font-display font-medium text-body-sm">SabaiCraft</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openCart()}
              className="relative p-2 text-cream-50 hover:text-sabai-400 transition-colors"
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-sabai-500 text-cream-50 text-xs font-medium rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-cream-50 hover:text-sabai-400 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Header - Desktop */}
      <div className="hidden lg:flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3" aria-label="SabaiCraft Home">
          <img src="/Images/logo.png" alt="SabaiCraft" className="w-10 h-10" />
          <span className="font-display font-medium text-olive-950 text-heading-md hidden sm:block">
            SabaiCraft
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'font-medium text-body-sm transition-colors relative',
                location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href))
                  ? 'text-olive-950'
                  : 'text-olive-600 hover:text-olive-950'
              )}
              aria-current={location.pathname === item.href ? 'page' : undefined}
            >
              {item.name}
              {location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href)) && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="absolute bottom-[-6px] left-0 h-0.5 bg-sage-600 rounded-full"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Search, Cart, Wishlist, Account */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden sm:block" ref={searchRef}>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="btn-ghost btn-icon-lg relative"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  onSubmit={handleSearch}
                  className="absolute right-0 top-full mt-2 w-72"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-olive-400" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="input pl-10 pr-4 py-2 text-sm"
                      autoFocus
                    />
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative btn-ghost btn-icon-lg"
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative btn-ghost btn-icon-lg"
            aria-label={`Cart, ${cartCount} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-olive-950 text-cream-50 text-xs font-medium rounded-full flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Account */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 btn-ghost btn-sm"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              {isAuthenticated ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-sage-600" />
                  </div>
                  <span className="hidden sm:block text-body-sm font-medium text-olive-700">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span className="hidden sm:block text-body-sm font-medium text-olive-700">Account</span>
                </>
              )}
              <ChevronDown className={cn('w-4 h-4 text-olive-500 transition-transform', isUserMenuOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-olive-100 shadow-elevated py-2 z-[300]"
                  role="menu"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-olive-100">
                        <p className="font-medium text-olive-900 text-body-sm">{user?.name}</p>
                        <p className="text-olive-500 text-caption truncate">{user?.email}</p>
                      </div>
                      {accountLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.href}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-olive-700 hover:bg-olive-50 hover:text-olive-950 transition-colors"
                          role="menuitem"
                        >
                          {link.name}
                        </Link>
                      ))}
                      <div className="border-t border-olive-100 pt-2 mt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-body-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                          role="menuitem"
                        >
                          <LogIn className="w-5 h-5" />
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-2 space-y-2">
                      <Link
                        to="/login"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn btn-primary btn-md w-full justify-center"
                        role="menuitem"
                      >
                        <LogIn className="w-4 h-4" />
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn btn-outline btn-md w-full justify-center"
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