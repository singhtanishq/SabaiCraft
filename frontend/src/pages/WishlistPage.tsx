import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, X, Star, ChevronRight } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { ProductCard } from '@components/product/ProductCard';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { EmptyState, EmptyWishlist } from '@components/ui/EmptyState';
import { cn, formatPrice } from '@utils/format';

export function WishlistPage() {
  const { items, removeItem, toggleItem, isInWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (product: any) => {
    addItem(product, product.variants[0], 1);
  };

  const handleWishlist = (product: any) => {
    toggleItem(product, product.variants[0]);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 py-16 lg:py-24">
        <div className="container-main">
          <EmptyWishlist onBrowseProducts={() => window.location.href = '/shop'} />
        </div>
      </div>
    );
  }

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
              <h1 className="heading-1 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500" />
                My Wishlist
              </h1>
              <p className="text-olive-600 text-body-lg mt-1">
                {items.length} item{items.length !== 1 ? 's' : ''} saved for later
              </p>
            </div>
            <Button asChild variant="primary">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </motion.div>

        {/* Wishlist Items */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          role="list"
        >
          {items.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ProductCard
                product={item.product}
                index={0}
                variant="grid"
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleWishlist}
              />
            </motion.article>
          ))}
        </motion.div>

        {/* Move all to cart */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 text-center"
          >
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                items.forEach((item) => addItem(item.product, item.product.variants[0], 1));
              }}
              className="w-full sm:w-auto"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Add All to Cart ({items.length} items)
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}