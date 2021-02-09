import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToastHelpers } from '../ui/Toast';
import { cn } from '../../utils/cn';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { success, error } = useToastHelpers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      error('Invalid email', 'Please enter a valid email address');
      return;
    }

    setStatus('loading');
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus('success');
    success('Subscribed!', 'Thank you for joining our community. Check your inbox for a welcome offer.');
    setEmail('');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <section className="section-lg relative overflow-hidden" aria-labelledby="newsletter-heading">
      <div className="absolute inset-0 bg-gradient-to-br from-olive-950 via-olive-900 to-sage-800" />
      <div className="absolute inset-0 bg-[url('/Images/sabai mascot.png')] bg-center bg-cover opacity-[0.03]" />

      <div className="container-main relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <Mail className="w-4 h-4 text-sabai-300" aria-hidden="true" />
            <span className="text-body-sm font-medium text-cream-100">Join Our Community</span>
          </div>

          <h2 id="newsletter-heading" className="heading-1 text-cream-50 mb-4">
            Stay Connected with SabaiCraft
          </h2>

          <p className="body-lg text-olive-100 mb-8 max-w-lg mx-auto">
            Get early access to new collections, artisan stories, exclusive offers, and sustainability tips delivered to your inbox.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-4 mb-8 text-center">
            {[
              { icon: CheckCircle, text: 'New Arrivals' },
              { icon: ArrowRight, text: 'Exclusive Offers' },
              { icon: Mail, text: 'Artisan Stories' },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sabai-300">
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-body-sm text-olive-100 font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-cream-50 placeholder-olive-300 focus:border-sabai-400 focus:ring-sabai-400/20"
                  disabled={status === 'loading' || status === 'success'}
                  aria-label="Email address"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                variant="secondary"
                isLoading={status === 'loading'}
                className="whitespace-nowrap"
                aria-label={status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              >
                {status === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>

            <p className="text-caption text-olive-300 mt-3 text-center">
              No spam, unsubscribe anytime. <a href="/privacy" className="underline hover:text-cream-50">Privacy Policy</a>
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}