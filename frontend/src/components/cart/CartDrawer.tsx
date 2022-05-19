import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';
import { cn } from '@utils/cn';
import { formatPrice } from '@utils/format';
import { Link } from 'react-router-dom';

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore();

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const subtotal = getSubtotal();
  const shipping = subtotal >= 200000 ? 0 : 9900;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <Drawer
          isOpen={isCartOpen}
          onClose={closeCart}
          position="right"
          size="lg"
          title="Shopping Cart"
          showCloseButton
        >
          {cart.items.length > 0 ? (
            <div className="flex flex-col h-full">
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {cart.items.map((item, index) => (
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
                      className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden"
                      aria-label={`View ${item.product.name}`}
                    >
                      <img src={item.product.images[0]?.url} alt={item.product.name} className="w-full h-full object-cover" />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="font-medium text-olive-900 text-body-sm truncate hover:text-sage-700"
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

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-olive-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 text-olive-600 hover:bg-olive-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1 font-medium text-body-sm text-olive-900 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.variant.inventory}
                            className="px-3 py-1 text-olive-600 hover:bg-olive-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-olive-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Remove from cart"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-olive-200 pt-6 space-y-4">
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

                {subtotal < 200000 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 bg-sabai-50 rounded-lg border border-sabai-200"
                  >
                    <p className="text-body-sm text-olive-700 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Add <span className="font-medium">{formatPrice(200000 - subtotal)}</span> more for free shipping!
                    </p>
                  </motion.div>
                )}

                <div className="flex justify-between text-heading-sm font-display font-medium text-olive-950 pt-2 border-t border-olive-200">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/cart">View Cart</Link>
                  </Button>
                  <Button variant="primary" className="flex-1" asChild>
                    <Link to="/checkout">
                      Checkout
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="w-16 h-16 text-olive-200 mb-4" />
              <h3 className="font-display font-medium text-olive-950 text-heading-lg mb-2">Your cart is empty</h3>
              <p className="text-olive-600 text-body mb-6">Add some treasures to get started</p>
              <Button asChild variant="primary" size="lg" onClick={closeCart}>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          )}
        </Drawer>
      )}
    </AnimatePresence>
  );
}