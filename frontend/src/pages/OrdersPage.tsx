import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, X, Eye, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@services/api';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { EmptyOrders } from '@components/ui/EmptyState';
import { Skeleton } from '@components/ui/Skeleton';
import { useToastHelpers } from '@components/ui';
import { formatPrice } from '@utils/format';
import { cn } from '@utils/cn';
import type { Order } from '@app-types';

type NormalizedStatus =
  | 'pending' | 'confirmed' | 'processing' | 'shipped'
  | 'delivered' | 'cancelled' | 'refunded';

const normalizeStatus = (status: string): NormalizedStatus => {
  const lower = (status ?? '').toLowerCase() as NormalizedStatus;
  return [
    'pending', 'confirmed', 'processing', 'shipped',
    'delivered', 'cancelled', 'refunded',
  ].includes(lower) ? lower : 'pending';
};

const statusConfig: Record<NormalizedStatus, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  pending: { label: 'Pending', icon: <Clock className="w-4 h-4" />, color: 'text-amber-700', bgColor: 'bg-amber-100' },
  confirmed: { label: 'Confirmed', icon: <CheckCircle className="w-4 h-4" />, color: 'text-blue-700', bgColor: 'bg-blue-100' },
  processing: { label: 'Processing', icon: <Package className="w-4 h-4" />, color: 'text-sage-700', bgColor: 'bg-sage-100' },
  shipped: { label: 'Shipped', icon: <Truck className="w-4 h-4" />, color: 'text-purple-700', bgColor: 'bg-purple-100' },
  delivered: { label: 'Delivered', icon: <CheckCircle className="w-4 h-4 fill-current" />, color: 'text-green-700', bgColor: 'bg-green-100' },
  cancelled: { label: 'Cancelled', icon: <X className="w-4 h-4" />, color: 'text-red-700', bgColor: 'bg-red-100' },
  refunded: { label: 'Refunded', icon: <RotateCcw className="w-4 h-4" />, color: 'text-olive-700', bgColor: 'bg-olive-100' },
};

const paymentLabel = (method: string) =>
  ({
    COD: 'Cash on Delivery',
    CARD: 'Card',
    UPI: 'UPI',
    NETBANKING: 'Net Banking',
    WALLET: 'Wallet',
  }[String(method).toUpperCase()] ?? method);

export function OrdersPage() {
  const { error: toastError } = useToastHelpers();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    document.title = 'My Orders | SabaiCraft';
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    api
      .getOrders({ page, limit: 10 })
      .then((response) => {
        if (cancelled) return;
        setOrders(response.data ?? []);
        setTotalPages(response.pagination?.totalPages ?? 1);
      })
      .catch((error) => {
        if (!cancelled) {
          toastError('Could not load orders', error instanceof Error ? error.message : 'Please try again.');
          setOrders([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, toastError]);

  const handlePageChange = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-cream-50 py-8 lg:py-12">
      <div className="container-main">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="heading-1">My Orders</h1>
              <p className="text-olive-600 text-body-lg mt-1">Track and manage your orders</p>
            </div>
            <Button asChild variant="primary">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyOrders onStartShopping={() => (window.location.href = '/shop')} />
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const status = normalizeStatus(order.status);
              const config = statusConfig[status];

              return (
                <article
                  key={order.id}
                  style={{ animationDelay: `${index * 60}ms` }}
                  className="card p-6 animate-in"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 min-w-0">
                      <div className="flex items-center">
                        {order.items.slice(0, 2).map((item, i) => (
                          <div
                            key={item.id}
                            className={cn(
                              'relative w-16 h-16 rounded-lg overflow-hidden border border-olive-200 bg-olive-50 flex-shrink-0',
                              i === 1 && '-ml-4 z-10'
                            )}
                          >
                            {item.image && (
                              <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                            )}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="relative w-16 h-16 rounded-lg border border-olive-200 bg-olive-50 flex items-center justify-center -ml-4 z-10">
                            <span className="font-medium text-olive-600">+{order.items.length - 2}</span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Link
                            to={`/orders/${order.id}`}
                            className="font-display font-medium text-olive-950 text-heading-md hover:text-sage-700"
                          >
                            {order.orderNumber}
                          </Link>
                          <Badge className={cn(config.bgColor, config.color)}>
                            <span className="inline-flex">{config.icon}</span>
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-olive-500 text-body-sm mt-1">
                          Placed on {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          {' · '}
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s) · {paymentLabel(order.paymentMethod)}
                        </p>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="flex items-center justify-between lg:justify-end gap-4">
                      <div className="text-right lg:hidden">
                        <p className="font-display font-medium text-olive-950 text-heading-md">{formatPrice(order.total)}</p>
                      </div>
                      <div className="text-right hidden lg:block">
                        <p className="font-display font-medium text-olive-950 text-heading-lg">{formatPrice(order.total)}</p>
                        <p className="caption text-olive-500">Incl. GST & Shipping</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/orders/${order.id}`}>
                            <Eye className="w-4 h-4 mr-1" aria-hidden="true" />
                            View
                          </Link>
                        </Button>
                        {status === 'delivered' && (
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/orders/${order.id}`}>
                              <RotateCcw className="w-4 h-4 mr-1" aria-hidden="true" />
                              Reorder
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Orders pagination">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Previous
            </Button>
            <span className="text-body-sm text-olive-600 px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </nav>
        )}
      </div>
    </div>
  );
}
