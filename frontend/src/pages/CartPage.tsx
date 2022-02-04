import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Plus, Minus, Trash2, ArrowRight, Shield, Truck, RotateCcw } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { cn, formatPrice } from '@utils/format';
import { EmptyCart } from '@components/ui/EmptyState';

export function CartPage() {
  const { cart, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 py-16 lg:py-24">
        <div className="container-main">
          <EmptyCart onContinueShopping={() => window.location.href = '/shop'} />
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shipping = subtotal >= 200000 ? 0 : 9900;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-cream-50 py-8 lg:py-12">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="heading-1 mb-2">Shopping Cart</h1>
          <p className="text-olive-600 text-body-lg">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-4"
          >
            {cart.items.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                exit={{ opacity: 0, x: -20 }}
                className="card p-4 flex gap-4"
              >
                <Link
                  to={`/product/${item.product.slug}`}
                  className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-olive-50"
                  aria-label={`View ${item.product.name}`}
                >
                  <img src={item.product.images[0]?.url} alt={item.product.name} className="w-full h-full object-cover" loading="lazy" />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="font-display font-medium text-olive-950 text-heading-sm truncate hover:text-sage-700"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-olive-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        aria-label={`Remove ${item.product.name} from cart`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-caption text-olive-500 mt-1">
                      {Object.values(item.variant.attributes).join(' / ')}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 pt-4 border-t border-olive-100">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-olive-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-4 py-2 text-olive-600 hover:bg-olive-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="px-4 py-2 font-medium text-body text-olive-900 w-12 text-center border-x border-olive-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.variant.inventory}
                          className="px-4 py-2 text-olive-600 hover:bg-olive-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-display font-medium text-heading-sm text-olive-950">
                          {formatPrice(item.variant.price * item.quantity)}
                        </p>
                        {item.variant.compareAtPrice && item.variant.compareAtPrice > item.variant.price && (
                          <p className="text-caption text-olive-400 line-through">
                            {formatPrice(item.variant.compareAtPrice * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="sticky top-24 space-y-6" padding="lg">
              <h2 className="heading-3">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-body-sm">
                  <span className="text-olive-600">Subtotal ({cart.items.length} items)</span>
                  <span className="font-medium text-olive-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-olive-600">Shipping</span>
                  <span className="font-medium text-olive-900 flex items-center gap-1">
                    {shipping === 0 ? (
                      <>
                        <Truck className="w-4 h-4 text-sage-600" />
                        Free
                      </>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-olive-600">Tax (18% GST)</span>
                  <span className="font-medium text-olive-900">{formatPrice(tax)}</span>
                </div>
              </div>

              {subtotal < 200000 && (
                <div className="p-3 bg-sabai-50 rounded-lg border border-sabai-200">
                  <p className="text-body-sm text-olive-700 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Add <span className="font-medium">{formatPrice(200000 - subtotal)}</span> more for free shipping!
                  </p>
                  <div className="mt-2 h-2 bg-olive-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(subtotal / 200000) * 100}%` }}
                      className="h-full bg-sabai-500 transition-all duration-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between text-heading-sm font-display font-medium text-olive-950 pt-3 border-t border-olive-200">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <Button asChild variant="primary" size="lg" className="w-full">
                <Link to="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <p className="text-caption text-olive-500 text-center">
                Secure checkout • 18% GST included • Free shipping over ₹2,000
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-olive-100">
                {[
                  { icon: Shield, label: 'Secure' },
                  { icon: Truck, label: 'Fast Ship' },
                  { icon: RotateCcw, label: 'Easy Return' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-600">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="caption text-olive-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}