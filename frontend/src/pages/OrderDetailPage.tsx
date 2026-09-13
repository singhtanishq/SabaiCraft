import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, X, RotateCcw, MapPin, Phone, ChevronRight, Shield } from 'lucide-react';
import { api } from '@services/api';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Skeleton } from '@components/ui/Skeleton';
import { formatPrice } from '@utils/format';
import { cn } from '@utils/cn';
import type { Order } from '@app-types';

type NormalizedStatus =
  | 'pending' | 'confirmed' | 'processing' | 'shipped'
  | 'delivered' | 'cancelled' | 'refunded';

const normalizeStatus = (status: string): NormalizedStatus => {
  const lower = (status ?? '').toLowerCase() as NormalizedStatus;
  return ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].includes(lower)
    ? lower
    : 'pending';
};

const statusConfig: Record<NormalizedStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  confirmed: { label: 'Confirmed', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  processing: { label: 'Processing', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  shipped: { label: 'Shipped', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  delivered: { label: 'Delivered', color: 'text-green-700', bgColor: 'bg-green-100' },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bgColor: 'bg-red-100' },
  refunded: { label: 'Refunded', color: 'text-olive-700', bgColor: 'bg-olive-100' },
};

const statusSteps: { key: NormalizedStatus; label: string; icon: React.ReactNode }[] = [
  { key: 'pending', label: 'Placed', icon: <Package className="w-6 h-6" /> },
  { key: 'confirmed', label: 'Confirmed', icon: <CheckCircle className="w-6 h-6" /> },
  { key: 'processing', label: 'Processing', icon: <Package className="w-6 h-6" /> },
  { key: 'shipped', label: 'Shipped', icon: <Truck className="w-6 h-6" /> },
  { key: 'delivered', label: 'Delivered', icon: <MapPin className="w-6 h-6" /> },
];

const stepTimestamp: Partial<Record<NormalizedStatus, keyof Order>> = {
  pending: 'placedAt',
  confirmed: 'confirmedAt',
  processing: 'confirmedAt',
  shipped: 'shippedAt',
  delivered: 'deliveredAt',
};

const paymentMethodLabel = (method: string) =>
  ({
    COD: 'Cash on Delivery',
    CARD: 'Card',
    UPI: 'UPI',
    NETBANKING: 'Net Banking',
    WALLET: 'Wallet',
  }[String(method).toUpperCase()] ?? method);

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    setIsLoading(true);
    api
      .getOrderById(orderId)
      .then((response) => {
        if (!cancelled) {
          setOrder((response.data as Order) ?? null);
          if (response.data?.orderNumber) {
            document.title = `Order ${response.data.orderNumber} | SabaiCraft`;
          }
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="bg-cream-50 py-8 lg:py-12">
        <div className="container-main space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="bg-cream-50 py-16 lg:py-24">
        <div className="container-main max-w-md mx-auto text-center">
          <h1 className="heading-1 mb-4">Order Not Found</h1>
          <p className="body text-olive-600 mb-8">
            We couldn't find this order. It may belong to a different account.
          </p>
          <Button asChild variant="primary" size="lg">
            <Link to="/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  const status = normalizeStatus(order.status);
  const config = statusConfig[status];
  const isTerminalBad = status === 'cancelled' || status === 'refunded';
  const currentStatusIndex = statusSteps.findIndex((s) => s.key === status);

  return (
    <div className="bg-cream-50 py-8 lg:py-12">
      <div className="container-main">
        {/* Header */}
        <div className="mb-8">
          <Link to="/orders" className="inline-flex items-center gap-2 text-olive-600 hover:text-olive-900 text-body-sm mb-4">
            <ChevronRight className="w-4 h-4 rotate-180" aria-hidden="true" />
            Back to Orders
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="heading-1">{order.orderNumber}</h1>
                <Badge className={cn(config.bgColor, config.color)}>{config.label}</Badge>
              </div>
              <p className="text-olive-500 text-body-sm mt-2">
                Placed on {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/orders">All Orders</Link>
            </Button>
          </div>
        </div>

        {/* Progress Timeline */}
        {!isTerminalBad && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card padding="lg">
              <h2 className="heading-3 mb-8">Order Progress</h2>
              <ol className="flex items-start">
                {statusSteps.map((step, index) => {
                  const isCompleted = index < currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const timestamp = order[stepTimestamp[step.key] as keyof Order] as string | undefined;

                  return (
                    <li key={step.key} className="flex items-start flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-2 flex-none">
                        <div
                          className={cn(
                            'w-12 h-12 rounded-full flex items-center justify-center transition-all',
                            isCompleted
                              ? 'bg-sage-600 text-cream-50'
                              : isCurrent
                                ? 'bg-sage-600 text-cream-50 ring-4 ring-sage-600/20'
                                : 'bg-olive-100 text-olive-400'
                          )}
                          aria-current={isCurrent ? 'step' : undefined}
                        >
                          {isCompleted ? <CheckCircle className="w-6 h-6" aria-hidden="true" /> : step.icon}
                        </div>
                        <span
                          className={cn(
                            'text-caption font-medium text-center',
                            isCompleted || isCurrent ? 'text-olive-900' : 'text-olive-400'
                          )}
                        >
                          {step.label}
                        </span>
                        {timestamp && (
                          <span className="text-caption text-olive-500">
                            {new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className="flex-1 h-0.5 mt-6 mx-2" aria-hidden="true">
                          <div className={cn('h-full rounded-full', index < currentStatusIndex ? 'bg-sage-600' : 'bg-olive-100')} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Order Items & Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Order Items */}
            <Card padding="lg">
              <h2 className="heading-3 mb-6">Order Items ({order.items.length})</h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-olive-50 rounded-xl">
                    <Link
                      to={`/product/${item.productSlug}`}
                      className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white"
                      aria-label={`View ${item.productName}`}
                    >
                      {item.image && (
                        <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.productSlug}`} className="font-medium text-olive-900 text-body hover:text-sage-700">
                        {item.productName}
                      </Link>
                      <p className="text-caption text-olive-500 mt-0.5">
                        {Object.entries(item.variantAttributes ?? {})
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(' • ') || item.variantName}
                      </p>
                      <p className="font-medium text-olive-900 text-body-sm mt-1">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-display font-medium text-olive-950 text-heading-sm">{formatPrice(item.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Shipping & Payment */}
            <div className="grid sm:grid-cols-2 gap-6">
              <Card padding="lg">
                <h2 className="heading-3 mb-4 flex items-center gap-2">
                  <Truck className="w-6 h-6 text-sage-600" aria-hidden="true" />
                  Shipping Address
                </h2>
                {order.shippingAddress ? (
                  <address className="text-olive-600 text-body-sm not-italic space-y-1">
                    <p className="font-medium text-olive-900">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                    <p className="mt-2 flex items-center gap-1">
                      <Phone className="w-4 h-4" aria-hidden="true" />
                      {order.shippingAddress.phone}
                    </p>
                  </address>
                ) : (
                  <p className="text-olive-500 text-body-sm">Address unavailable.</p>
                )}
              </Card>

              <Card padding="lg">
                <h2 className="heading-3 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-sage-600" aria-hidden="true" />
                  Payment
                </h2>
                <div className="space-y-2 text-olive-600 text-body-sm">
                  <p>{paymentMethodLabel(order.paymentMethod)}</p>
                  <Badge variant={String(order.paymentStatus).toUpperCase() === 'COD' ? 'neutral' : 'primary'} className="mt-2">
                    {String(order.paymentStatus).toUpperCase() === 'COD'
                      ? 'Pay on delivery'
                      : String(order.paymentStatus).toUpperCase() === 'PAID'
                        ? 'Paid'
                        : 'Payment pending'}
                  </Badge>
                </div>
              </Card>
            </div>

            {/* Tracking */}
            {order.trackingNumber && status === 'shipped' && (
              <Card padding="lg">
                <h2 className="heading-3 mb-4 flex items-center gap-2">
                  <Truck className="w-6 h-6 text-sage-600" aria-hidden="true" />
                  Track Your Order
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-sage-50 rounded-xl">
                  <div>
                    <p className="caption text-olive-500">Tracking Number</p>
                    <p className="font-mono font-medium text-olive-900">{order.trackingNumber}</p>
                  </div>
                  {order.trackingUrl && (
                    <Button asChild variant="primary">
                      <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">
                        <Truck className="w-4 h-4 mr-2" aria-hidden="true" />
                        Track Shipment
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <Card className="space-y-6 lg:sticky lg:top-24" padding="lg">
              <h2 className="heading-3">Order Summary</h2>

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
                    {order.shipping === 0 ? (
                      <span className="text-sage-600 flex items-center gap-1">
                        <Truck className="w-4 h-4" aria-hidden="true" /> Free
                      </span>
                    ) : (
                      formatPrice(order.shipping)
                    )}
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

            <Card padding="lg" className="space-y-3">
              {status === 'delivered' && order.items[0] && (
                <Button asChild variant="primary" className="w-full" size="lg">
                  <Link to={`/product/${order.items[0].productSlug}`}>
                    <RotateCcw className="w-5 h-5 mr-2" aria-hidden="true" />
                    Buy Again
                  </Link>
                </Button>
              )}
              {['delivered', 'shipped'].includes(status) && (
                <Button asChild variant="outline" className="w-full">
                  <Link to="/returns">Return Policy</Link>
                </Button>
              )}
              <Button asChild variant="ghost" className="w-full">
                <Link to="/orders">Back to All Orders</Link>
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
