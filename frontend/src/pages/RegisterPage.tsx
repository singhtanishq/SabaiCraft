import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Card } from '@components/ui/Card';
import { useAuthStore } from '@store/authStore';
import { useToastHelpers } from '@components/ui';

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuthStore();
  const { success, error } = useToastHelpers();

  const redirectTo =
    new URLSearchParams(location.search).get('redirect') ||
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    '/account';

  useEffect(() => {
    document.title = 'Create Account | SabaiCraft';
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=[A-Za-z])/.test(formData.password) || !/(?=\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain letters and numbers';
    }
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      useCartStore.getState().enableBackendSync();
      useWishlistStore.getState().enableBackendSync();
      useCartStore.getState().enableBackendSync();
      useWishlistStore.getState().enableBackendSync();
      success('Account created!', `Welcome to SabaiCraft, ${formData.firstName}!`);
      navigate(redirectTo.startsWith('/') ? redirectTo : '/account', { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to create your account. Please try again.';
      error('Registration failed', message);
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
        <h1 className="heading-1 mb-2">Create Your Account</h1>
        <p className="text-olive-600 text-body-lg">Join our community of conscious consumers</p>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
              error={errors.firstName}
              placeholder="John"
              leftIcon={<User className="w-5 h-5" />}
              autoComplete="given-name"
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
              error={errors.lastName}
              placeholder="Doe"
              leftIcon={<User className="w-5 h-5" />}
              autoComplete="family-name"
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder="you@example.com"
            leftIcon={<Mail className="w-5 h-5" />}
            autoComplete="email"
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
              error={errors.password}
              placeholder="••••••••"
              leftIcon={<Lock className="w-5 h-5" />}
              autoComplete="new-password"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-olive-400 hover:text-olive-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />
          </div>

          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            placeholder="••••••••"
            leftIcon={<Lock className="w-5 h-5" />}
            autoComplete="new-password"
          />

          <div className="space-y-3">
            <p className="text-caption text-olive-500 flex items-start gap-2">
              <span className="w-4 h-4 flex-shrink-0 mt-0.5">✓</span>
              By creating an account, you agree to our <Link to="/terms" className="underline hover:text-olive-700">Terms of Service</Link> and <Link to="/privacy" className="underline hover:text-olive-700">Privacy Policy</Link>.
            </p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 text-sage-600 border-olive-300 rounded focus:ring-sage-500" />
              <span className="text-caption text-olive-600">
                Subscribe to our newsletter for artisan stories, new arrivals, and exclusive offers
              </span>
            </label>
          </div>

          <Button type="submit" size="lg" className="w-full" isLoading={isLoading} disabled={isLoading}>
            {isLoading ? 'Creating Account…' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-olive-600 text-body-sm mt-6">
          Already have an account?{' '}
          <Link
            to={redirectTo !== '/account' ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login'}
            className="text-sage-600 hover:text-sage-700 font-medium underline"
          >
            Sign In
          </Link>
        </p>
      </Card>
    </motion.div>
  );
}