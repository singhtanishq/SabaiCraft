import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { InfoPage } from './pages/InfoPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthLayout } from './components/layout/AuthLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/common/SearchModal';

// Routes that should render their own document titles.
const ROUTE_TITLES: [RegExp, string][] = [
  [/^\/$/, 'SabaiCraft | Handcrafted Sabai Grass Treasures'],
  [/^\/shop/, 'Shop All Products | SabaiCraft'],
  [/^\/categories/, 'Categories | SabaiCraft'],
  [/^\/cart/, 'Shopping Cart | SabaiCraft'],
  [/^\/checkout/, 'Checkout | SabaiCraft'],
  [/^\/about/, 'Our Story | SabaiCraft'],
  [/^\/contact/, 'Contact Us | SabaiCraft'],
  [/^\/wishlist/, 'Wishlist | SabaiCraft'],
  [/^\/login/, 'Sign In | SabaiCraft'],
  [/^\/register/, 'Create Account | SabaiCraft'],
];

function ScrollAndTitleManager() {
  const location = useLocation();

  // Scroll to top on navigation (unless navigating to a hash target).
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [location.pathname, location.hash]);

  // Basic per-route document titles; pages may override for detail views.
  useEffect(() => {
    if (location.hash) return;
    for (const [pattern, title] of ROUTE_TITLES) {
      if (pattern.test(location.pathname)) {
        document.title = title;
        return;
      }
    }
  }, [location.pathname, location.hash]);

  return null;
}

function App() {
  return (
    <MotionConfig transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
      <BrowserRouter>
        <ScrollAndTitleManager />
        <MainLayout>
          <ErrorBoundary>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />

              {/* Informational / legal pages */}
              <Route path="/:slug" element={<InfoPage />} />

              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/account" element={<AccountPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailPage />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>

          {/* Global Components */}
          <CartDrawer />
          <SearchModal />
        </MainLayout>
      </BrowserRouter>
    </MotionConfig>
  );
}

export default App;
