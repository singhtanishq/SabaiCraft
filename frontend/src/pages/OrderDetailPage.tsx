import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, X, Eye, RotateCcw, MapPin, Phone, Mail, ChevronRight, Shield } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/Tabs';
import { formatPrice } from '@utils/format'
import { cn } from '@utils/cn';
import type { Order, OrderItem } from '@types';

const mockOrder: Order = {
  id: 'ord-1',
  userId: 'user-1',
  orderNumber: 'ORD-ABC123',
  status: 'delivered',
  paymentStatus: 'paid',
  paymentMethod: 'card',
  items: [
    { id: 'oi-1', orderId: 'ord-1', productId: 'prod-1', productName: 'Sabai Handle Basket', productSlug: 'sabai-handle-basket', variantId: 'var-1', variantName: 'Medium', variantAttributes: { size: 'Medium' }, quantity: 1, price: 120000, total: 120000, image: '/Images/p1.jpg' },
    { id: 'oi-2', orderId: 'ord-1', productId: 'prod-5', productName: 'Sabai Mat (Beige)', productSlug: 'sabai-mat-beige', variantId: 'var-5', variantName: '2x3 ft', variantAttributes: { size: '2x3 ft', color: 'Beige' }, quantity: 1, price: 110000, total: 110000, image: '/Images/p7.webp' },
  ],
  subtotal: 230000,
  discount: 0,
  shipping: 0,
  tax: 41400,
  total: 271400,
  shippingAddress: { id: 'addr-1', userId: 'user-1', name: 'John Doe', phone: '+91 98765 43210', addressLine1: '123 Main St', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001', country: 'India', isDefault: true, type: 'shipping' },
  billingAddress: { id: 'addr-1', userId: 'user-1', name: 'John Doe', phone: '+91 98765 43210', addressLine1: '123 Main St', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001', country: 'India', isDefault: true, type: 'billing' },
  placedAt: '2024-01-15T10:30:00Z',
  confirmedAt: '2024-01-15T11:00:00Z',
  shippedAt: '2024-01-16T09:00:00Z',
  deliveredAt: '2024-01-20T14:30:00Z',
  trackingNumber: 'TRK123456789',
  trackingUrl: 'https://tracking.example.com/TRK123456789',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-20T14:30:00Z',
};

const statusConfig: Record<Order['status'], { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  pending: { label: 'Pending', icon: <Clock className="w-4 h-4" />, color: 'text-amber-700', bgColor: 'bg-amber-100' },
  confirmed: { label: 'Confirmed', icon: <CheckCircle className="w-4 h-4" />, color: 'text-blue-700', bgColor: 'bg-blue-100' },
  processing: { label: 'Processing', icon: <Package className="w-4 h-4" />, color: 'text-sage-700', bgColor: 'bg-sage-100' },
  shipped: { label: 'Shipped', icon: <Truck className="w-4 h-4" />, color: 'text-purple-700', bgColor: 'bg-purple-100' },
  delivered: { label: 'Delivered', icon: <CheckCircle className="w-4 h-4 fill-current" />, color: 'text-green-700', bgColor: 'bg-green-100' },
  cancelled: { label: 'Cancelled', icon: <X className="w-4 h-4" />, color: 'text-red-700', bgColor: 'bg-red-100' },
  refunded: { label: 'Refunded', icon: <RotateCcw className="w-4 h-4" />, color: 'text-olive-700', bgColor: 'bg-olive-100' },
};

const statusSteps: Order['status'][] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { isAuthenticated } = useAuthStore();
  const order = mockOrder; // In real app, fetch by orderId

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream-50 py-16 lg:py-24">
        <div className="container-main max-w-md mx-auto text-center">
          <p className="text-olive-600 text-body-lg mb-6">Please sign in to view your order details.</p>
          <Button asChild variant="primary" size="lg">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-cream-50 py-16 lg:py-24">
        <div className="container-main max-w-md mx-auto text-center">
          <h1 className="heading-1 mb-4">Order Not Found</h1>
          <Button asChild variant="primary" size="lg">
            <Link to="/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.indexOf(order.status);
  const config = statusConfig[order.status];

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
              <Link to="/orders" className="inline-flex items-center gap-2 text-olive-600 hover:text-olive-900 text-body-sm mb-4">
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to Orders
              </Link>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="heading-1">{order.orderNumber}</h1>
                <Badge className={cn(config.bgColor, config.color)}>
                  {config.icon}
                  {config.label}
                </Badge>
              </div>
              <p className="text-olive-500 text-body-sm mt-2">
                Placed on {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link to="/orders">All Orders</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Progress Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card padding="lg">
            <h3 className="heading-3 mb-6">Order Progress</h3>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-olive-200" />
              <div className="absolute left-8 top-0 h-0.5 bg-sage-600" style={{ width: `${Math.min((currentStatusIndex + 1) / statusSteps.length, 1) * 100}%` }} />

              <div className="flex items-start justify-between">
                {statusSteps.map((step, index) => {
                  const isCompleted = index < currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const stepConfig = statusConfig[step];

                  return (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="relative flex flex-col items-center flex-1"
                    >
                      <div className={cn(
                        'relative w-16 h-16 rounded-full flex items-center justify-center transition-all z-10',
                        isCompleted ? `bg-${stepConfig.color.replace('text-', 'bg-').replace('700', '500')}` : isCurrent ? 'bg-sage-600 ring-4 ring-sage-600/20' : 'bg-olive-100'
                      )}>
                        {isCompleted ? (
                          <CheckCircle className="w-8 h-8 text-white" />
                        ) : (
                          <stepConfig.icon className={cn('w-8 h-8', isCurrent ? 'text-sage-600' : 'text-olive-400')} />
                        )}
                      </div>
                      <p className={cn(
                        'mt-3 text-center text-caption font-medium',
                        isCompleted ? 'text-olive-900' : isCurrent ? 'text-sage-600' : 'text-olive-400'
                      )}>
                        {stepConfig.label}
                      </p>
                      {order[step === 'pending' ? 'placedAt' : step === 'confirmed' ? 'confirmedAt' : step === 'processing' ? 'confirmedAt' : step === 'shipped' ? 'shippedAt' : 'deliveredAt'] && (
                        <p className="text-center text-caption text-olive-500 mt-1">
                          {new Date(order[step === 'pending' ? 'placedAt' : step === 'confirmed' ? 'confirmedAt' : step === 'processing' ? 'confirmedAt' : step === 'shipped' ? 'shippedAt' : 'deliveredAt']!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Items & Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Order Items */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="heading-3">Order Items ({order.items.length})</h3>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-4 p-4 bg-olive-50 rounded-xl"
                  >
                    <Link
                      to={`/product/${item.productSlug}`}
                      className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden"
                    >
                      <img src={item.image} alt={item.productName} className="w-full h-full object-cover" loading="lazy" />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.productSlug}`} className="font-medium text-olive-900 text-body hover:text-sage-700">
                        {item.productName}
                      </Link>
                      <p className="text-caption text-olive-500 mt-0.5">
                        {Object.entries(item.variantAttributes).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                      </p>
                      <p className="font-medium text-olive-900 text-body-sm mt-1">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-display font-medium text-olive-950 text-heading-sm">{formatPrice(item.total)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Shipping & Billing Addresses */}
            <div className="grid sm:grid-cols-2 gap-6">
              <Card padding="lg">
                <h3 className="heading-3 mb-4 flex items-center gap-2">
                  <Truck className="w-6 h-6 text-sage-600" />
                  Shipping Address
                </h3>
                <address className="text-olive-600 text-body-sm not-italic space-y-1">
                  <p className="font-medium text-olive-900">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-2 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {order.shippingAddress.phone}
                  </p>
                </address>
              </Card>

              <Card padding="lg">
                <h3 className="heading-3 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-sage-600" />
                  Payment Method
                </h3>
                <div className="space-y-2 text-olive-600 text-body-sm">
                  <p className="capitalize">{order.paymentMethod.replace('cod', 'Cash on Delivery').replace('upi', 'UPI').replace('netbanking', 'Net Banking')}</p>
                  <Badge variant="primary" className="mt-2">{order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}</Badge>
                </div>
              </Card>
            </div>

            {/* Tracking */}
            {order.trackingNumber && order.status === 'shipped' && (
              <Card padding="lg">
                <h3 className="heading-3 mb-4 flex items-center gap-2">
                  <Truck className="w-6 h-6 text-sage-600" />
                  Track Your Order
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-sage-50 rounded-xl">
                  <div>
                    <p className="caption text-olive-500">Tracking Number</p>
                    <p className="font-mono font-medium text-olive-900">{order.trackingNumber}</p>
                  </div>
                  <Button asChild variant="primary">
                    <Link to={order.trackingUrl!} target="_blank" rel="noopener noreferrer">
                      <Truck className="w-4 h-4 mr-2" />
                      Track Shipment
                    </Link>
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="sticky top-24 space-y-6" padding="lg">
              <h3 className="heading-3">Order Summary</h3>

              <div className="space-y-3 border-t border-olive-200 pt-4">
                <div className="flex justify-between text-body-sm">
                  <span className="text-olive-600">Subtotal</span>
                  <span className="font-medium text-olive-900">{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-body-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-body-sm">
                  <span className="text-olive-600">Shipping</span>
                  <span className="font-medium text-olive-900">
                    {order.shipping === 0 ? <span className="text-sage-600 flex items-center gap-1"><Truck className="w-4 h-4" /> Free</span> : formatPrice(order.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-olive-600">Tax (18% GST)</span>
                  <span className="font-medium text-olive-900">{formatPrice(order.tax)}</span>
                </div>
                <div className="flex justify-between text-heading-sm font-display font-medium text-olive-950 pt-2 border-t border-olive-200">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-olive-200">
                <p className="caption text-olive-500 text-center">
                  Secure payment • 18% GST included • Free shipping over ₹2,000
                </p>
              </div>
            </Card>

            {/* Actions */}
            <Card padding="lg" className="space-y-3">
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <Button asChild variant="primary" className="w-full" size="lg">
                  <Link to={order.trackingUrl || '#'} target="_blank" rel="noopener noreferrer">
                    <Truck className="w-5 h-5 mr-2" />
                    Track Order
                  </Link>
                </Button>
              )}
              {order.status === 'delivered' && (
                <Button asChild variant="primary" className="w-full" size="lg">
                  <Link to={`/product/${order.items[0].productSlug}`}>
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Buy Again
                  </Link>
                </Button>
              )}
              {['delivered', 'shipped'].includes(order.status) && (
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/returns?order=${order.id}`}>
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Return / Exchange
                  </Link>
                </Button>
              )}
              <Button asChild variant="ghost" className="w-full">
                <Link to="/orders">
                  ← Back to All Orders
                </Link>
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}