import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight, Bell, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useToastHelpers } from '../../components/ui/Toast';

const accountSections = [
  { id: 'overview', label: 'Overview', icon: User, href: '/account' },
  { id: 'orders', label: 'My Orders', icon: Package, href: '/orders' },
  { id: 'wishlist', label: 'Wishlist', icon: Heart, href: '/wishlist' },
  { id: 'addresses', label: 'Addresses', icon: MapPin, href: '/account/addresses' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/account/settings' },
];

export function AccountPage() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { success } = useToastHelpers();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream-50 py-16 lg:py-24">
        <div className="container-main max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <User className="w-20 h-20 mx-auto text-olive-200" />
            <h1 className="heading-1">Welcome to SabaiCraft</h1>
            <p className="text-olive-600 text-body-lg">
              Sign in to access your orders, wishlist, and personalized experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="primary" size="lg">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    success('Logged out', 'You have been successfully logged out');
  };

  return (
    <div className="min-h-screen bg-cream-50 py-8 lg:py-12">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="heading-1">My Account</h1>
              <p className="text-olive-600 text-body-lg mt-1">Manage your profile and preferences</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="space-y-1" padding="none">
              <div className="p-6 border-b border-olive-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-sage-100 flex items-center justify-center">
                    <User className="w-7 h-7 text-sage-600" />
                  </div>
                  <div>
                    <p className="font-display font-medium text-olive-950 text-heading-md">{user?.name}</p>
                    <p className="text-olive-500 text-body-sm">{user?.email}</p>
                  </div>
                </div>
              </div>

              <nav className="p-2" aria-label="Account navigation">
                {accountSections.map((section) => (
                  <Link
                    key={section.id}
                    to={section.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-olive-600 hover:bg-olive-50 hover:text-olive-900 transition-colors"
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium text-body-sm">{section.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-olive-100">
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50" onClick={handleLogout}>
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </div>
            </Card>
          </motion.aside>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Profile Card */}
            <Card padding="lg">
              <h2 className="heading-3 mb-6">Profile Information</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="caption text-olive-500">Full Name</p>
                  <p className="font-medium text-olive-900 text-body-lg">{user?.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="caption text-olive-500">Email</p>
                  <p className="font-medium text-olive-900 text-body-lg">{user?.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="caption text-olive-500">Member Since</p>
                  <p className="font-medium text-olive-900 text-body-lg">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="caption text-olive-500">Account Type</p>
                  <p className="font-medium text-olive-900 text-body-lg capitalize">{user?.role}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-olive-200">
                <Button asChild variant="outline">
                  <Link to="/account/settings">Edit Profile</Link>
                </Button>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card padding="md" className="text-center">
                <p className="font-display font-medium text-olive-950 text-heading-xl">0</p>
                <p className="caption text-olive-500 mt-1">Total Orders</p>
              </Card>
              <Card padding="md" className="text-center">
                <p className="font-display font-medium text-olive-950 text-heading-xl">₹0</p>
                <p className="caption text-olive-500 mt-1">Total Spent</p>
              </Card>
              <Card padding="md" className="text-center">
                <p className="font-display font-medium text-olive-950 text-heading-xl">0</p>
                <p className="caption text-olive-500 mt-1">Wishlist Items</p>
              </Card>
              <Card padding="md" className="text-center">
                <p className="font-display font-medium text-olive-950 text-heading-xl">0</p>
                <p className="caption text-olive-500 mt-1">Saved Addresses</p>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card padding="lg">
              <h2 className="heading-3 mb-6">Quick Actions</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                  <Link to="/orders">
                    <Package className="w-8 h-8" />
                    <span>My Orders</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                  <Link to="/wishlist">
                    <Heart className="w-8 h-8" />
                    <span>Wishlist</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                  <Link to="/account/addresses">
                    <MapPin className="w-8 h-8" />
                    <span>Addresses</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                  <Link to="/account/settings">
                    <Settings className="w-8 h-8" />
                    <span>Settings</span>
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}