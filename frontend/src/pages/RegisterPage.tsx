import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Shield } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Card } from '@components/ui/Card';
import { useAuthStore } from '@store/authStore';
import { useToastHelpers } from '@components/ui';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const { success } = useToastHelpers();

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

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!formData.email.includes('@')) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      success('Account Created!', `Welcome to SabaiCraft, ${formData.firstName}!`);
      navigate('/account', { replace: true });
    } catch (err) {
      // Error handled by toast in the store
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
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              error={errors.firstName}
              placeholder="John"
              leftIcon={<User className="w-5 h-5" />}
              autoComplete="given-name"
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
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
            onChange={(e) => handleInputChange('email', e.target.value)}
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
              onChange={(e) => handleInputChange('password', e.target.value)}
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
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
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

          <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-olive-200" />
          </div>
          <div className="relative flex justify-center text-caption">
            <span className="bg-white px-4 text-olive-500">Or sign up with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="md" className="w-full">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </Button>
          <Button variant="outline" size="md" className="w-full">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.19 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.45-1.41-.45-1.41-.375-.48-.09-1.125.09-1.125.495.09.75.51.75.51.435.75 1.125 1.005 1.395.765.09-.6.345-1.005.63-1.23-2.22-.255-4.545-1.11-4.545-4.95 0-1.095.39-1.98 1.035-2.685-.105-.255-.45-1.275.105-2.655 0 0 .84-.27 2.75 1.02.795-.225 1.65-.345 2.505-.345.855 0 1.71.12 2.505.345 1.905-1.29 2.745-1.02 2.745-1.02.555 1.38.21 2.4 1.05 2.655.645.69 1.035 1.575 1.035 2.685 0 3.84-2.34 4.695-4.575 4.935.36.315.675.915.675 1.845 0 1.335-.015 2.415-.015 2.745 0 .315.225.69.825.57A11.98 11.98 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </Button>
        </div>

        <p className="text-center text-olive-600 text-body-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-sage-600 hover:text-sage-700 font-medium underline">
            Sign In
          </Link>
        </p>
      </Card>
    </motion.div>
  );
}