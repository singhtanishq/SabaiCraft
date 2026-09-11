import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Truck, Shield, RotateCcw, Mail, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { cn } from '@utils/cn';

export function OrderSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const orderId = (params as any).orderId || 'ORD-UNKNOWN';
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-cream-50 py-16 lg:py-24">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-sage-100 flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-sage-600" />
          </motion.div>

          <h1 className="heading-1 mb-4">Thank You for Your Order!</h1>
          <p className="body-lg text-olive-600 mb-8">
            Your order has been confirmed and is being prepared with care.
          </p>

          {/* Order Details Card */}
          <Card variant="elevated" padding="lg" className="mb-8 text-left">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-olive-100">
              <div>
                <p className="caption text-olive-500">Order Number</p>
                <p className="font-display font-medium text-olive-950 text-heading-md">{orderId}</p>
              </div>
              <div className="text-right">
                <p className="caption text-olive-500">Status</p>
                <span className="badge badge-success">Confirmed</span>
              </div>
            </div>

            <div className="space-y-3 text-body-sm">
              <div className="flex justify-between">
                <span className="text-olive-600">Confirmation Email</span>
                <span className="font-medium text-olive-900 flex items-center gap-1">
                  <Mail className="w-4 h-4 text-sage-600" />
                  Sent
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-olive-600">Estimated Delivery</span>
                <span className="font-medium text-olive-900 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {estimatedDelivery.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </div>
            </div>
          </Card>

          {/* What happens next */}
          <Card padding="lg" className="mb-8 text-left">
            <h3 className="heading-3 mb-6 flex items-center gap-2">
              <Truck className="w-6 h-6 text-sage-600" />
              What Happens Next
            </h3>
            <div className="space-y-4">
              {[
                { icon: CheckCircle, title: 'Order Confirmed', desc: 'Your order has been received and confirmed', done: true },
                { icon: Shield, title: 'Processing', desc: 'Our artisans are preparing your items', done: true },
                { icon: Truck, title: 'Shipped', desc: 'Your order will be shipped within 24-48 hours', done: false },
                { icon: MapPin, title: 'Delivered', desc: 'Estimated delivery within 5-7 business days', done: false },
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                    step.done ? 'bg-sage-100 text-sage-600' : 'bg-olive-100 text-olive-400'
                  )}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={cn('font-medium text-body-sm', step.done ? 'text-olive-900' : 'text-olive-600')}>
                      {step.title}
                    </p>
                    <p className="text-caption text-olive-500">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="primary" size="lg">
              <Link to="/account/orders">View Order Details</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 pt-8 border-t border-olive-200"
          >
            <p className="text-olive-500 text-body-sm mb-4">Need help with your order?</p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-body-sm">
              <a href="mailto:contact@sabaicraft.com" className="flex items-center gap-2 text-olive-600 hover:text-olive-900">
                <Mail className="w-4 h-4" />
                contact@sabaicraft.com
              </a>
              <a href="tel:+918881155518" className="flex items-center gap-2 text-olive-600 hover:text-olive-900">
                <Phone className="w-4 h-4" />
                +91 88811 55518
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}