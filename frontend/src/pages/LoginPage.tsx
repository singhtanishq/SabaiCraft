import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Card } from '@components/ui/Card';
import { useAuthStore } from '@store/authStore';
import { useToastHelpers } from '@components/ui/Toast';
import { cn } from '@utils/cn';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const { success, error } = useToastHelpers();

  const from = (location.state as any)?.from?.pathname || '/account';

  interface LoginFormData {
  email: string;
  password: string;
}

const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.email) setErrors.email = 'Email is required';
    else if (!formData.email.includes('@')) setErrors.email = 'Invalid email';
    if (!formData.password) setErrors.password = 'Password is required';
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo login - in real app, this would call an API
    const demoUser = {
      id: 'user-1',
      email: formData.email,
      name: formData.email.split('@')[0],
      role: 'customer' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    login(formData.email, formData.password);
    success('Welcome back!', `Hello, ${demoUser.name}`);
    navigate(from, { replace: true });
    setIsLoading(false);
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
              autoComplete="current-password"
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

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-sage-600 border-olive-300 rounded focus:ring-sage-500"
              />
              <span className="text-body-sm text-olive-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-body-sm text-sage-600 hover:text-sage-700">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-olive-200" />
          </div>
          <div className="relative flex justify-center text-caption">
            <span className="bg-white px-4 text-olive-500">Or continue with</span>
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
          Don't have an account?{' '}
          <Link to="/register" className="text-sage-600 hover:text-sage-700 font-medium underline">
            Create one
          </Link>
        </p>
      </Card>
    </motion.div>
  );
}