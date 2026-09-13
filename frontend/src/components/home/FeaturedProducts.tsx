import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, ChevronRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';
import { formatPrice } from '../../utils/format';
import type { Product, ProductVariant } from '../../types';

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
}

function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [hoveredImage, setHoveredImage] = useState(0);

  const defaultVariant = product.variants[0];
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.basePrice) / product.compareAtPrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, defaultVariant, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product, defaultVariant);
  };

  const isWishlisted = isInWishlist(product.id, defaultVariant.id);

  const imageUrls = product.images.map((img) => img.url);
  const currentImage = imageUrls[hoveredImage] || imageUrls[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link
        to={`/product/${product.slug}`}
        className="block card-interactive h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2"
        aria-label={`View ${product.name}`}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-olive-50">
          <motion.img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Secondary image on hover */}
          {imageUrls.length > 1 && (
            <motion.img
              src={imageUrls[1]}
              alt={`${product.name} - alternate view`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasDiscount && (
              <Badge variant="danger" size="sm">
                -{discountPercent}%
              </Badge>
            )}
            {product.isFeatured && (
              <Badge variant="primary" size="sm">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute top-3 right-3 p-2 rounded-full transition-all duration-fast',
              'bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100',
              isWishlisted ? 'text-red-500 opacity-100' : 'text-olive-600 hover:text-red-500'
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={isWishlisted}
          >
            <Heart
              className={cn('w-5 h-5', isWishlisted ? 'fill-current' : '')}
              aria-hidden="true"
            />
          </button>

          {/* Quick Add */}
          <button
            onClick={handleAddToCart}
            className={cn(
              'absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg',
              'bg-olive-950 text-cream-50 font-medium text-body-sm',
              'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0',
              'transition-all duration-300 hover:bg-olive-900 shadow-lg'
            )}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
        </div>

        {/* Content */}
        <div className="p-4 pt-5 space-y-2">
          <p className="caption text-sage-600 font-medium uppercase tracking-wider">
            {categories.find((c) => c.id === product.categoryId)?.name || 'SabaiCraft'}
          </p>

          <h3 className="font-display font-medium text-olive-950 text-heading-sm truncate group-hover:text-sage-700 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
              <span className="text-body-sm font-medium text-olive-700">{product.rating.toFixed(1)}</span>
              <span className="text-caption text-olive-400">({product.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-display font-medium text-heading-sm text-olive-950">
              {formatPrice(product.basePrice)}
            </span>
            {hasDiscount && (
              <span className="text-body-sm text-olive-400 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

import { useState } from 'react';
import { categories } from '../../data/products';

export function FeaturedProducts({
  products,
  title = 'Featured Collection',
  subtitle = 'Handpicked treasures loved by our community',
  showViewAll = true,
  viewAllHref = '/shop',
}: FeaturedProductsProps) {
  return (
    <section className="section-lg" aria-labelledby="featured-heading">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
        >
          <h2 id="featured-heading" className="heading-1 mb-4">
            {title}
          </h2>
          <p className="body-lg text-olive-600">{subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          role="list"
        >
          {products.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </motion.div>

        {showViewAll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mt-10 lg:mt-12"
          >
            <Button asChild variant="outline" size="lg">
              <Link to={viewAllHref} className="flex items-center gap-2">
                View All Products
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}