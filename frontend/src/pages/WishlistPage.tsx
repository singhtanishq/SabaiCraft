import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@store/wishlistStore';
import { ProductCard } from '@components/product/ProductCard';
import { Button } from '@components/ui/Button';
import { EmptyWishlist } from '@components/ui/EmptyState';
import type { Product } from '@app-types';

export function WishlistPage() {
  const { items } = useWishlistStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'My Wishlist | SabaiCraft';
  }, []);

  // Wishlist entries synced from the backend should always embed a product;
  // guard anyway so one malformed entry cannot break the page.
  const savedItems = items.filter((item) => !!item.product?.variants);

  return (
    <div className="bg-cream-50 py-8 lg:py-12">
      <div className="container-main">
        {savedItems.length === 0 ? (
          <EmptyWishlist onBrowseProducts={() => navigate('/shop')} />
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="heading-1 flex items-center gap-3">
                    <Heart className="w-8 h-8 text-red-500 fill-current" aria-hidden="true" />
                    My Wishlist
                  </h1>
                  <p className="text-olive-600 text-body-lg mt-1">
                    {savedItems.length} item{savedItems.length !== 1 ? 's' : ''} saved for later
                  </p>
                </div>
                <Button asChild variant="primary">
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>

            {/* Wishlist Items */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              role="list"
            >
              {savedItems.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                >
                  <ProductCard product={item.product as Product} index={index} />
                </motion.article>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
