import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  ShoppingBag,
  Heart,
  User,
  Search,
  LogIn,
  LogOut,
  Package,
} from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../utils/cn';

const mobileNavigation = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Categories', href: '/categories' },
  { name: 'Our Story', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const mobileAccountLinks = [
  { name: 'My Account', href: '/account', icon: User },
  { name: 'My Orders', href: '/orders', icon: Package },
  { name: 'Wishlist', href: '/wishlist', icon: Heart },
];

export function MobileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const openSearch = useUIStore((s) => s.openSearch);

  const { openCart, getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const cartCount = getItemCount();
  const wishlistCount = wishlistItems.length;

  const handleLogout = async () => {
    onClose();
    await logout();
    useCartStore.getState().disableBackendSync();
    useWishlistStore.getState().disableBackendSync();
    navigate('/');
  };

  const linkClasses = (isActive: boolean) =>
    cn(
      'flex items-center justify-between px-3 py-3 rounded-lg transition-colors',
      isActive
        ? 'bg-sage-50 text-olive-950 font-medium'
        : 'text-olive-600 hover:bg-olive-50 hover:text-olive-950'
    );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      size="md"
      title="Menu"
      showCloseButton
    >
      {/* Search shortcut */}
      <button
        onClick={() => {
          onClose();
          openSearch();
        }}
        className="mb-5 w-full flex items-center gap-3 input text-left text-olive-400"
        aria-label="Search products"
      >
        <Search className="w-5 h-5" />
        <span className="text-body-sm">Search products…</span>
      </button>

      {/* Cart & Wishlist Quick Access */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          onClick={() => {
            onClose();
            openCart();
          }}
          className="relative btn btn-outline btn-sm justify-center"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-olive-950 text-cream-50 text-[10px] font-semibold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        <Link
          to="/wishlist"
          onClick={onClose}
          className="relative btn btn-outline btn-sm justify-center"
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist</span>
          {wishlistCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 mb-4" aria-label="Mobile navigation">
        {mobileNavigation.map((item) => {
          const isActive =
            item.href === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={linkClasses(isActive)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="font-medium text-body">{item.name}</span>
              <ChevronRight className="w-4 h-4 text-olive-300" aria-hidden="true" />
            </Link>
          );
        })}
      </nav>

      <div className="divider my-4" />

      {/* Account Section */}
      <div className="space-y-1">
        {isAuthenticated ? (
          <>
            <div className="px-3 py-3 mb-2 bg-olive-50 rounded-lg">
              <p className="font-medium text-olive-900 text-body-sm truncate">{user?.name}</p>
              <p className="text-olive-500 text-caption truncate">{user?.email}</p>
            </div>
            {mobileAccountLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={onClose}
                  className={cn(linkClasses(isActive), 'gap-3')}
                >
                  <link.icon className="w-5 h-5 text-olive-400" aria-hidden="true" />
                  <span className="font-medium text-body-sm">{link.name}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium text-body-sm">Logout</span>
            </button>
          </>
        ) : (
          <div className="space-y-3 px-1 pb-2">
            <Link
              to="/login"
              onClick={onClose}
              className="btn btn-primary btn-md w-full"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="btn btn-outline btn-md w-full"
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
