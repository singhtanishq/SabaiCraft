import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn, formatPrice } from '../../utils/format';
import type { Product, ProductVariant } from '../../types';

interface ProductCardProps {
  product: Product;
  index: number;
  variant?: 'grid' | 'list';
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
}

export function ProductCard({
  product,
  index,
  variant = 'grid',
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const defaultVariant = product.variants[0];
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.basePrice) / product.compareAtPrice!) * 100)
    : 0;

  const imageUrls = product.images.map((img) => img.url);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
    onToggleWishlist?.(product);
  };

  if (variant === 'list') {
    return (
      <motion.article
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
        className="card-interactive flex gap-6 p-4"
      >
        <Link to={`/product/${product.slug}`} className="relative w-40 h-40 flex-shrink-0 overflow-hidden rounded-xl bg-olive-50" aria-label={`View ${product.name}`}>
          <img src={imageUrls[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
          {hasDiscount && (
            <Badge variant="danger" className="absolute top-2 left-2">-{discountPercent}%</Badge>
          )}
        </Link>

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <p className="caption text-sage-600 font-medium uppercase tracking-wider mb-1">
              {product.categoryId}
            </p>
            <Link to={`/product/${product.slug}`} className="font-display font-medium text-olive-950 text-heading-md truncate hover:text-sage-700 transition-colors">
              {product.name}
            </Link>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-body-sm font-medium text-olive-700">{product.rating.toFixed(1)}</span>
                <span className="text-caption text-olive-400">({product.reviewCount})</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 pt-4 border-t border-olive-100">
            <div className="flex items-center gap-2">
              <span className="font-display font-medium text-heading-md text-olive-950">{formatPrice(product.basePrice)}</span>
              {hasDiscount && <span className="text-body-sm text-olive-400 line-through">{formatPrice(product.compareAtPrice!)}</span>}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleWishlist}
                className={cn('p-2 rounded-lg transition-colors', wishlisted ? 'text-red-500 bg-red-50' : 'text-olive-500 hover:bg-olive-100 hover:text-red-500')}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={cn('w-5 h-5', wishlisted ? 'fill-current' : '')} />
              </button>
              <button
                onClick={handleAddToCart}
                className="btn btn-primary btn-sm flex-1 sm:flex-none"
              >
                <ShoppingBag className="w-4 h-4" />
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
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block card-interactive h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2" aria-label={`View ${product.name}`}>
        <div className="relative aspect-square overflow-hidden bg-olive-50">
          <motion.img
            src={imageUrls[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {imageUrls.length > 1 && (
            <motion.img
              src={imageUrls[1]}
              alt={`${product.name} - alternate view`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
            />
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasDiscount && <Badge variant="danger" size="sm">-{discountPercent}%</Badge>}
            {product.isFeatured && <Badge variant="primary" size="sm"><Star className="w-3 h-3 mr-1" />Featured</Badge>}
          </div>

          <button
            onClick={handleWishlist}
            className={cn(
              'absolute top-3 right-3 p-2 rounded-full transition-all duration-fast',
              'bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100',
              wishlisted ? 'text-red-500 opacity-100' : 'text-olive-600 hover:text-red-500'
            )}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={cn('w-5 h-5', wishlisted ? 'fill-current' : '')} />
          </button>

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

        <div className="p-4 pt-5 space-y-2">
          <p className="caption text-sage-600 font-medium uppercase tracking-wider">{product.categoryId}</p>
          <h3 className="font-display font-medium text-olive-950 text-heading-sm truncate group-hover:text-sage-700 transition-colors">{product.name}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-body-sm font-medium text-olive-700">{product.rating.toFixed(1)}</span>
              <span className="text-caption text-olive-400">({product.reviewCount})</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-medium text-heading-sm text-olive-950">{formatPrice(product.basePrice)}</span>
            {hasDiscount && <span className="text-body-sm text-olive-400 line-through">{formatPrice(product.compareAtPrice!)}</span>}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}