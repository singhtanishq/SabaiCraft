import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';
import { EmptyCart } from '../ui/EmptyState';
import { formatPrice } from '../../utils/format';
import { Link } from 'react-router-dom';

const FREE_SHIPPING_THRESHOLD = 200000; // ₹2,000 in paise

export function CartDrawer() {
  const navigate = useNavigate();
  const { cart, isCartOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore();

  const isOpen = isCartOpen;
  const items = cart?.items ?? [];
  const subtotal = getSubtotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9900;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeCart}
      position="right"
      size="lg"
      title="Shopping Cart"
      showCloseButton
      bodyClassName={items.length > 0 ? 'p-0' : undefined}
    >
      {items.length === 0 ? (
        <EmptyCart
          onContinueShopping={() => {
            closeCart();
            navigate('/shop');
          }}
        />
      ) : (
        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-0 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex gap-3 p-3 bg-olive-50 rounded-xl"
              >
                <Link
                  to={`/product/${item.product.slug}`}
                  onClick={closeCart}
                  className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white"
                  aria-label={`View ${item.product.name}`}
                >
                  <img
                    src={item.product.images[0]?.url}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <Link
                      to={`/product/${item.product.slug}`}
                      onClick={closeCart}
                      className="font-medium text-olive-900 text-body-sm truncate block hover:text-sage-700"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-caption text-olive-500 mt-0.5">
                      {Object.values(item.variant.attributes).join(' / ')}
                    </p>
                    <p className="font-medium text-olive-900 text-body-sm mt-1">
                      {formatPrice(item.variant.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-olive-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1.5 text-olive-600 hover:bg-olive-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1.5 font-medium text-body-sm text-olive-900 w-9 text-center" aria-live="polite">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.variant.inventory}
                        className="px-3 py-1.5 text-olive-600 hover:bg-olive-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-olive-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label={`Remove ${item.product.name} from cart`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="border-t border-olive-200 p-4 sm:p-6 space-y-4 bg-white">
            <div className="flex justify-between text-body-sm">
              <span className="text-olive-600">Subtotal</span>
              <span className="font-medium text-olive-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-body-sm">
              <span className="text-olive-600">Shipping</span>
              <span className="font-medium text-olive-900">
                {shipping === 0 ? 'Free' : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between text-body-sm">
              <span className="text-olive-600">Tax (18% GST)</span>
              <span className="font-medium text-olive-900">{formatPrice(tax)}</span>
            </div>

            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <div className="p-3 bg-sabai-50 rounded-lg border border-sabai-200">
                <p className="text-caption text-olive-700 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 flex-shrink-0" />
                  Add <span className="font-medium">{formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}</span> more for free shipping
                </p>
                <div className="mt-2 h-1.5 bg-olive-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sabai-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between text-heading-sm font-display font-medium text-olive-950 pt-3 border-t border-olive-200">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" asChild onClick={closeCart}>
                <Link to="/cart">View Cart</Link>
              </Button>
              <Button variant="primary" className="flex-1" asChild onClick={closeCart}>
                <Link to="/checkout">
                  Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
