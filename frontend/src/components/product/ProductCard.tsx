import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, ImageOff } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { useToastHelpers } from '../ui/Toast';
import { formatPrice } from '../../utils/format';
import { cn } from '../../utils/cn';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: 'grid' | 'list';
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
}

function WishlistButton({
  isWishlisted,
  onToggle,
  floating,
}: {
  isWishlisted: boolean;
  onToggle: () => void;
  floating?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        'p-2 rounded-full transition-all duration-fast',
        floating && 'bg-white/90 backdrop-blur-sm shadow-sm',
        isWishlisted ? 'text-red-500 bg-red-50' : 'text-olive-500 hover:bg-olive-100 hover:text-red-500',
        isWishlisted && floating && 'bg-red-50'
      )}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={isWishlisted}
    >
      <Heart className={cn('w-5 h-5', isWishlisted && 'fill-current')} aria-hidden="true" />
    </button>
  );
}

function ProductImage({ product, className }: { product: Product; className?: string }) {
  const url = product.images[0]?.url;
  if (!url) {
    return (
      <div className={cn('flex items-center justify-center bg-olive-100 text-olive-400', className)}>
        <ImageOff className="w-8 h-8" aria-hidden="true" />
        <span className="sr-only">{product.name}</span>
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={product.name}
      className={cn('object-cover bg-olive-50', className)}
      loading="lazy"
    />
  );
}

export function ProductCard({
  product,
  index = 0,
  variant = 'grid',
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { error: toastError, success } = useToastHelpers();

  const defaultVariant = product.variants[0];
  const isWishlisted = isInWishlist(product.id, defaultVariant?.id);

  const hasDiscount = !!product.compareAtPrice && product.compareAtPrice > product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.basePrice) / product.compareAtPrice!) * 100)
    : 0;

  const categoryLabel =
    product.category?.name ?? (product.categoryId ? `#${product.categoryId.slice(-4)}` : 'SabaiCraft');

  const handleAddToCart = () => {
    if (!defaultVariant) {
      toastError('Out of stock', 'This product is currently unavailable.');
      return;
    }
    if (defaultVariant.inventory <= 0) {
      toastError('Out of stock', 'This variant is currently out of stock.');
      return;
    }
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addItem(product, defaultVariant, 1);
      success('Added to cart', product.name);
    }
  };

  const handleToggleWishlist = () => {
    if (onToggleWishlist) {
      onToggleWishlist(product);
      return;
    }
    toggleItem(product, defaultVariant);
  };

  if (variant === 'list') {
    return (
      <motion.article
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
        className="card flex gap-4 sm:gap-6 p-4 relative"
      >
        <Link
          to={`/product/${product.slug}`}
          className="absolute inset-0 z-10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-600"
          aria-label={`View ${product.name}`}
        />
        <div className="relative w-32 sm:w-40 aspect-square flex-shrink-0 overflow-hidden rounded-xl bg-olive-50">
          <ProductImage product={product} className="w-full h-full" />
          {hasDiscount && (
            <Badge variant="danger" size="sm" className="absolute top-2 left-2">
              -{discountPercent}%
            </Badge>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <p className="caption text-sage-600 font-medium uppercase tracking-wider mb-1">
              {categoryLabel}
            </p>
            <h3 className="font-display font-medium text-olive-950 text-heading-md truncate group-hover:text-sage-700">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                <span className="text-body-sm font-medium text-olive-700">{product.rating.toFixed(1)}</span>
                <span className="text-caption text-olive-400">({product.reviewCount})</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-olive-100">
            <div className="flex items-center gap-2">
              <span className="font-display font-medium text-heading-md text-olive-950">
                {formatPrice(product.basePrice)}
              </span>
              {hasDiscount && (
                <span className="text-body-sm text-olive-400 line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 relative z-20">
              <WishlistButton isWishlisted={isWishlisted} onToggle={handleToggleWishlist} />
              <button type="button" onClick={handleAddToCart} className="btn btn-primary btn-sm flex-1 sm:flex-none">
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative card card-interactive h-full flex flex-col"
    >
      {/* Stretched link covers the card; buttons sit above it with z-20. */}
      <Link
        to={`/product/${product.slug}`}
        className="absolute inset-0 z-10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2"
        aria-label={`View ${product.name}`}
      />

      <div className="relative aspect-square overflow-hidden bg-olive-50 rounded-t-xl">
        <ProductImage
          product={product}
          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <Badge variant="danger" size="sm">
              -{discountPercent}%
            </Badge>
          )}
          {product.isFeatured && (
            <Badge variant="primary" size="sm">
              <Star className="w-3 h-3 mr-1" aria-hidden="true" />
              Featured
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 z-20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-fast">
          <WishlistButton isWishlisted={isWishlisted} onToggle={handleToggleWishlist} floating />
        </div>

        <div className="absolute bottom-3 inset-x-3 z-20 hidden lg:block">
          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              'w-full px-4 py-2 rounded-lg bg-olive-950 text-cream-50 font-medium text-body-sm',
              'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0',
              'transition-all duration-300 hover:bg-olive-900 shadow-lg'
            )}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-4 h-4 mr-2 inline" aria-hidden="true" />
            Add to Cart
          </button>
        </div>
      </div>

      <div className="p-4 pt-5 space-y-2 flex-1 flex flex-col">
        <p className="caption text-sage-600 font-medium uppercase tracking-wider">{categoryLabel}</p>
        <h3 className="font-display font-medium text-olive-950 text-heading-sm truncate group-hover:text-sage-700 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
          <span className="text-body-sm font-medium text-olive-700">{product.rating.toFixed(1)}</span>
          <span className="text-caption text-olive-400">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2 mt-auto">
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

      {/* Mobile: always-visible add-to-cart row */}
      <div className="lg:hidden p-4 pt-0">
        <button type="button" onClick={handleAddToCart} className="btn btn-primary btn-sm w-full">
          <ShoppingBag className="w-4 h-4" aria-hidden="true" />
          Add to Cart
        </button>
      </div>
    </motion.article>
  );
}
