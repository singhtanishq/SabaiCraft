import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, X, Eye, RotateCcw, MapPin, Phone, ChevronRight, Shield } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState, EmptyOrders } from '../components/ui/EmptyState';
import { formatPrice } from '../utils/format';
import { cn } from '../utils/cn';
import type { Order, OrderItem } from '@app-types';

// Mock orders data
const mockOrders: Order[] = [
  {
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
  },
  {
    id: 'ord-2',
    userId: 'user-1',
    orderNumber: 'ORD-DEF456',
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    items: [
      { id: 'oi-3', orderId: 'ord-2', productId: 'prod-2', productName: 'Sabai Fruit Basket', productSlug: 'sabai-fruit-basket', variantId: 'var-2', variantName: 'Large', variantAttributes: { size: 'Large' }, quantity: 1, price: 130000, total: 130000, image: '/Images/p4.jpg' },
    ],
    subtotal: 130000,
    discount: 0,
    shipping: 9900,
    tax: 23400,
    total: 163300,
    shippingAddress: { id: 'addr-1', userId: 'user-1', name: 'John Doe', phone: '+91 98765 43210', addressLine1: '123 Main St', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001', country: 'India', isDefault: true, type: 'shipping' },
    placedAt: '2024-01-25T14:20:00Z',
    confirmedAt: '2024-01-25T15:00:00Z',
    shippedAt: '2024-01-26T11:00:00Z',
    createdAt: '2024-01-25T14:20:00Z',
    updatedAt: '2024-01-26T11:00:00Z',
  },
  {
    id: 'ord-3',
    userId: 'user-1',
    orderNumber: 'ORD-GHI789',
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'cod',
    items: [
      { id: 'oi-4', orderId: 'ord-3', productId: 'prod-12', productName: 'Sabai Tote Bag', productSlug: 'sabai-tote-bag', variantId: 'var-12', variantName: 'Natural', variantAttributes: { color: 'Natural' }, quantity: 1, price: 140000, total: 140000, image: '/Images/p6.jpg' },
    ],
    subtotal: 140000,
    discount: 0,
    shipping: 9900,
    tax: 25200,
    total: 175100,
    shippingAddress: { id: 'addr-1', userId: 'user-1', name: 'John Doe', phone: '+91 98765 43210', addressLine1: '123 Main St', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001', country: 'India', isDefault: true, type: 'shipping' },
    placedAt: '2024-02-01T09:15:00Z',
    confirmedAt: '2024-02-01T10:00:00Z',
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
];

const statusConfig: Record<Order['status'], { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  pending: { label: 'Pending', icon: <Clock className="w-4 h-4" />, color: 'text-amber-700', bgColor: 'bg-amber-100' },
  confirmed: { label: 'Confirmed', icon: <CheckCircle className="w-4 h-4" />, color: 'text-blue-700', bgColor: 'bg-blue-100' },
  processing: { label: 'Processing', icon: <Package className="w-4 h-4" />, color: 'text-sage-700', bgColor: 'bg-sage-100' },
  shipped: { label: 'Shipped', icon: <Truck className="w-4 h-4" />, color: 'text-purple-700', bgColor: 'bg-purple-100' },
  delivered: { label: 'Delivered', icon: <CheckCircle className="w-4 h-4 fill-current" />, color: 'text-green-700', bgColor: 'bg-green-100' },
  cancelled: { label: 'Cancelled', icon: <X className="w-4 h-4" />, color: 'text-red-700', bgColor: 'bg-red-100' },
  refunded: { label: 'Refunded', icon: <RotateCcw className="w-4 h-4" />, color: 'text-olive-700', bgColor: 'bg-olive-100' },
};

export function OrdersPage() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream-50 py-16 lg:py-24">
        <div className="container-main max-w-md mx-auto text-center">
          <EmptyOrders onStartShopping={() => window.location.href = '/shop'} />
        </div>
      </div>
    );
  }

  const userOrders = mockOrders;

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
              <h1 className="heading-1">My Orders</h1>
              <p className="text-olive-600 text-body-lg mt-1">Track and manage your orders</p>
            </div>
            <Button asChild variant="primary">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </motion.div>

        {/* Orders List */}
        {userOrders.length === 0 ? (
          <EmptyOrders onStartShopping={() => window.location.href = '/shop'} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {userOrders.map((order, index) => {
              const orderStatusConfig = statusConfig[order.status];

              return (
                <motion.article
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  className="card p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      <div className="flex items-center gap-4">
                        {order.items.slice(0, 2).map((item, i) => (
                          <Link
                            key={item.id}
                            to={`/product/${item.productSlug}`}
                            className={cn('relative w-16 h-16 rounded-lg overflow-hidden border border-olive-200', i === 1 && '-ml-4 z-10')}
                          >
                            <img src={item.image} alt={item.productName} className="w-full h-full object-cover" loading="lazy" />
                          </Link>
                        ))}
                        {order.items.length > 2 && (
                          <div className="relative w-16 h-16 rounded-lg border border-olive-200 bg-olive-50 flex items-center justify-center -ml-4 z-10">
                            <span className="font-medium text-olive-600">+{order.items.length - 2}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Link
                            to={`/orders/${order.id}`}
                            className="font-display font-medium text-olive-950 text-heading-md hover:text-sage-700"
                          >
                            {order.orderNumber}
                          </Link>
                          <Badge className={cn(statusConfig[order.status].bgColor, statusConfig[order.status].color)}>
                            <span className="inline-flex">{statusConfig[order.status].icon}</span>
                            {statusConfig[order.status].label}
                          </Badge>
                        </div>
                        <p className="text-olive-500 text-body-sm mt-1">
                          Placed on {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden lg:block">
                        <p className="font-display font-medium text-olive-950 text-heading-lg">{formatPrice(order.total)}</p>
                        <p className="caption text-olive-500">Incl. GST & Shipping</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/orders/${order.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <Button asChild variant="primary" size="sm">
                            <Link to={`/orders/${order.id}`}>
                              Track
                            </Link>
                          </Button>
                        )}
                        {order.status === 'delivered' && (
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/orders/${order.id}`}>
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Reorder
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
    </div>
  );
}