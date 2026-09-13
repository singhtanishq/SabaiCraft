import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Card } from '@components/ui/Card';
import { useAuthStore } from '@store/authStore';
import { useCartStore } from '@store/cartStore';
import { useWishlistStore } from '@store/wishlistStore';
import { useToastHelpers } from '@components/ui/Toast';

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const { success, error } = useToastHelpers();

  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefer ?redirect= query param, then router state, then account.
  const redirectTo =
    new URLSearchParams(location.search).get('redirect') ||
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    '/account';

  useEffect(() => {
    document.title = 'Sign In | SabaiCraft';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email.trim(), formData.password);
      useCartStore.getState().enableBackendSync();
      useWishlistStore.getState().enableBackendSync();
      success('Welcome back!', 'You have been signed in successfully.');
      navigate(redirectTo.startsWith('/') ? redirectTo : '/account', { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to sign in. Please check your credentials.';
      error('Sign in failed', message);
      setErrors({ password: ' ' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-3 mb-6" aria-label="SabaiCraft Home">
          <img src="/Images/logo.png" alt="SabaiCraft" className="w-12 h-12" />
          <span className="font-display font-medium text-olive-950 text-heading-xl">SabaiCraft</span>
        </Link>
        <h1 className="heading-1 mb-2">Welcome Back</h1>
        <p className="text-olive-600 text-body-lg">Sign in to your account to continue</p>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder="you@example.com"
            leftIcon={<Mail className="w-5 h-5" />}
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password || undefined}
            placeholder="••••••••"
            leftIcon={<Lock className="w-5 h-5" />}
            autoComplete="current-password"
            required
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-olive-400 hover:text-olive-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
          />

          <Button type="submit" size="lg" className="w-full" isLoading={isLoading} disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-olive-600 text-body-sm mt-6">
          Don't have an account?{' '}
          <Link
            to={redirectTo !== '/account' ? `/register?redirect=${encodeURIComponent(redirectTo)}` : '/register'}
            className="text-sage-600 hover:text-sage-700 font-medium underline"
          >
            Create one
          </Link>
        </p>
      </Card>
    </motion.div>
  );
}
