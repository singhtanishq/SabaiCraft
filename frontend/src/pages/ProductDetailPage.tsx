import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ShoppingBag, Heart, Star, Truck, Shield, RotateCcw, CheckCircle, ImageOff } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@services/api';
import { getProductBySlug, categories as localCategories } from '@data/products';
import { normalizeProduct } from '@hooks/useCatalog';
import { ProductCard } from '@components/product/ProductCard';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { Modal } from '@components/ui/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/Tabs';
import { Skeleton } from '@components/ui/Skeleton';
import { EmptyState } from '@components/ui/EmptyState';
import { formatPrice, calculateDiscountPercent } from '@utils/format';
import { cn } from '@utils/cn';
import { useCartStore } from '@store/cartStore';
import { useWishlistStore } from '@store/wishlistStore';
import { useToastHelpers } from '@components/ui';
import { useAuthStore } from '@store/authStore';
import type { Product, ProductVariant, Review } from '@app-types';

interface ReviewWithName extends Review {
  userName: string;
}

function StarRating({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)} aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'w-4 h-4',
            star <= Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : star - rating < 1 ? 'fill-yellow-200 text-yellow-400' : 'text-olive-200'
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { success, error: toastError } = useToastHelpers();

  // All hooks run unconditionally and before any early return.
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ReviewWithName[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Load product (and its reviews) whenever the slug changes.
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);
    setSelectedImage(0);
    setSelectedVariantId(null);
    setQuantity(1);

    (async () => {
      try {
        const response = await api.getProductBySlug(slug);
        if (cancelled) return;
        const data = response.data as any;
        const { related: _related, ...rawProduct } = data;
        setProduct(normalizeProduct(rawProduct));
        setReviews((data.reviews ?? []) as ReviewWithName[]);
        document.title = `${rawProduct.name} | SabaiCraft`;
      } catch {
        // API unavailable or product missing — fall back to local dataset.
        const localProduct = getProductBySlug(slug);
        if (cancelled) return;
        if (localProduct) {
          setProduct(localProduct);
          setReviews([]);
          document.title = `${localProduct.name} | SabaiCraft`;
        } else {
          setNotFound(true);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const variant: ProductVariant | null = useMemo(() => {
    if (!product) return null;
    if (product.variants.length === 0) return null;
    return product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];
  }, [product, selectedVariantId]);

  const imageUrls = product?.images.map((img) => img.url) ?? [];

  if (isLoading) {
    return (
      <div className="bg-cream-50">
        <div className="container-main py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="bg-cream-50 flex items-center justify-center px-4 py-24">
        <EmptyState
          title="Product Not Found"
          description="The product you're looking for doesn't exist or has been removed."
          action={{ label: 'Continue Shopping', onClick: () => navigate('/shop'), variant: 'primary' }}
        />
      </div>
    );
  }

  const hasVariant = !!variant;
  const wishlisted = hasVariant ? isInWishlist(product.id, variant.id) : isInWishlist(product.id);
  const hasDiscount = !!product.compareAtPrice && product.compareAtPrice > product.basePrice;
  const discountPercent = calculateDiscountPercent(product.basePrice, product.compareAtPrice);
  const inStock = hasVariant && variant!.inventory > 0;
  const lowStock = inStock && variant!.inventory <= 5;

  const relatedProducts = product
    ? product.relatedOverride
    : [];

  const categorySlug = product.category?.slug ?? localCategories.find((c) => c.id === product.categoryId)?.slug;
  const categoryName = product.category?.name ?? localCategories.find((c) => c.id === product.categoryId)?.name;

  const related = relatedProducts.length > 0 ? relatedProducts : [];

  const handleAddToCart = () => {
    if (!hasVariant || !inStock) return;
    addItem(product, variant!, quantity);
    openCart();
  };

  const handleBuyNow = () => {
    if (!hasVariant || !inStock) return;
    addItem(product, variant!, quantity);
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toastError('Sign in required', 'Please sign in to save items to your wishlist.');
      navigate('/login?redirect=' + encodeURIComponent(location.pathname));
      return;
    }
    toggleItem(product, variant ?? undefined);
  };

  return (
    <div className="bg-cream-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-olive-100" aria-label="Breadcrumb">
        <div className="container-main py-4">
          <ol className="flex items-center gap-2 text-body-sm text-olive-500 flex-wrap">
            <li><Link to="/" className="hover:text-olive-700">Home</Link></li>
            <li aria-hidden="true"><ChevronRight className="w-4 h-4 flex-shrink-0" /></li>
            <li><Link to="/shop" className="hover:text-olive-700">Shop</Link></li>
            {categorySlug && (
              <>
                <li aria-hidden="true"><ChevronRight className="w-4 h-4 flex-shrink-0" /></li>
                <li>
                  <Link to={`/category/${categorySlug}`} className="hover:text-olive-700">{categoryName}</Link>
                </li>
              </>
            )}
            <li aria-hidden="true"><ChevronRight className="w-4 h-4 flex-shrink-0" /></li>
            <li className="text-olive-900 font-medium truncate max-w-[200px]" aria-current="page">{product.name}</li>
          </ol>
        </div>
      </nav>

      {/* Product Content */}
      <div className="container-main py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-olive-50 mb-4 group">
              {imageUrls.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="absolute inset-0 w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2"
                  aria-label="Zoom product image"
                >
                  <img
                    src={imageUrls[selectedImage] ?? imageUrls[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-olive-300">
                  <ImageOff className="w-12 h-12" aria-hidden="true" />
                </div>
              )}

              {/* Image Navigation */}
              {imageUrls.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedImage((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm text-olive-600 hover:text-olive-900 hover:bg-white shadow-lg transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedImage((prev) => (prev + 1) % imageUrls.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm text-olive-600 hover:text-olive-900 hover:bg-white shadow-lg transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {imageUrls.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2" role="tablist" aria-label="Product images">
                {imageUrls.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all',
                      index === selectedImage
                        ? 'border-sage-600 ring-2 ring-sage-600/20'
                        : 'border-transparent hover:border-olive-300'
                    )}
                    aria-label={`View image ${index + 1}`}
                    aria-current={index === selectedImage}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { icon: Truck, label: 'Free Shipping', desc: 'Over ₹2,000' },
                { icon: Shield, label: 'Secure Payment', desc: '100% Protected' },
                { icon: RotateCcw, label: 'Easy Returns', desc: '7 Days' },
                { icon: CheckCircle, label: 'Quality Check', desc: 'Verified' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-600">
                    <item.icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="font-medium text-body-sm text-olive-900">{item.label}</span>
                  <span className="caption text-olive-500">{item.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="space-y-6">
              {/* Category & Rating */}
              <div className="flex items-center gap-3 flex-wrap">
                {categorySlug && (
                  <Link to={`/category/${categorySlug}`} className="badge badge-primary">
                    {categoryName}
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <StarRating rating={product.rating} />
                  <span className="text-body-sm font-medium text-olive-700">{product.rating.toFixed(1)}</span>
                  <span className="text-caption text-olive-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="heading-1 text-balance">{product.name}</h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-display font-medium text-heading-xl text-olive-950">
                  {formatPrice(hasVariant ? variant!.price : product.basePrice)}
                </span>
                {hasDiscount && (
                  <span className="text-heading-sm text-olive-400 line-through">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                )}
                {hasDiscount && <Badge variant="danger">Save {discountPercent}%</Badge>}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="body-lg text-olive-600 border-t border-olive-100 pt-6">
                  {product.shortDescription}
                </p>
              )}

              {/* Variant Selector */}
              {product.variants.length > 1 && (
                <div className="space-y-3">
                  <label className="label" id="variant-label">Select Variant</label>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="variant-label">
                    {product.variants.map((v) => {
                      const isSelected = variant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            if (v.inventory === 0) return;
                            setSelectedVariantId(v.id);
                            setQuantity(1);
                          }}
                          className={cn(
                            'px-4 py-3 rounded-lg border-2 font-medium text-body-sm transition-all',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2',
                            v.inventory === 0
                              ? 'border-olive-200 bg-olive-50 text-olive-400 cursor-not-allowed'
                              : isSelected
                                ? 'border-sage-600 bg-sage-50 text-sage-800'
                                : 'border-olive-200 hover:border-olive-300 hover:bg-olive-50 text-olive-700'
                          )}
                          disabled={v.inventory === 0}
                          aria-pressed={isSelected}
                        >
                          {Object.values(v.attributes).join(' / ') || v.name}
                          {v.inventory === 0 && <span className="ml-2 text-caption text-red-500">(Out of Stock)</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-3">
                <label className="label" htmlFor="quantity-input">Quantity</label>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center border border-olive-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      disabled={quantity <= 1 || !inStock}
                      className="px-4 py-2 bg-olive-50 text-olive-600 hover:bg-olive-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                    </button>
                    <input
                      id="quantity-input"
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const next = parseInt(e.target.value, 10) || 1;
                        const max = hasVariant ? Math.max(1, variant!.inventory) : 1;
                        setQuantity(Math.min(Math.max(1, next), max));
                      }}
                      min="1"
                      max={hasVariant ? variant!.inventory : 1}
                      disabled={!inStock}
                      className="w-16 text-center border-x border-olive-200 bg-white focus:outline-none text-body font-medium"
                      aria-label="Quantity"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.min(hasVariant ? variant!.inventory : 1, prev + 1))}
                      disabled={!inStock || quantity >= (hasVariant ? variant!.inventory : 1)}
                      className="px-4 py-2 bg-olive-50 text-olive-600 hover:bg-olive-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Increase quantity"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                  {lowStock && (
                    <Badge variant="warning" size="sm">
                      Only {variant!.inventory} left in stock
                    </Badge>
                  )}
                  {!inStock && (
                    <Badge variant="danger" size="sm">Out of Stock</Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                >
                  <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="flex-1"
                  onClick={handleBuyNow}
                  disabled={!inStock}
                >
                  Buy Now
                </Button>
              </div>

              {/* Wishlist */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={cn(
                  'flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium text-body-sm transition-all w-full',
                  wishlisted
                    ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'border-olive-200 hover:border-olive-300 text-olive-700'
                )}
                aria-pressed={wishlisted}
              >
                <Heart className={cn('w-5 h-5', wishlisted && 'fill-current')} aria-hidden="true" />
                {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>

              {/* Description Tabs */}
              <Tabs defaultValue="description">
                <TabsList className="border-olive-200">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="pt-6">
                  <p className="body-lg text-olive-700 leading-relaxed">{product.description}</p>
                </TabsContent>

                <TabsContent value="specifications" className="pt-6">
                  <dl className="space-y-4">
                    {Object.entries({
                      Material: '100% Natural Sabai Grass',
                      Origin: 'Handwoven in India',
                      'Care Instructions': 'Wipe clean with damp cloth. Avoid prolonged moisture.',
                      Sustainability: 'Biodegradable, renewable resource, fair trade',
                      'Color Variation': 'Natural variations in color and texture are expected',
                    }).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-olive-100 gap-6">
                        <dt className="text-olive-600 text-body-sm">{key}</dt>
                        <dd className="font-medium text-olive-900 text-body-sm text-right max-w-xs">{value}</dd>
                      </div>
                    ))}
                    {hasVariant && (
                      <>
                        <div className="flex justify-between py-2 border-b border-olive-100 gap-6">
                          <dt className="text-olive-600 text-body-sm">Variant</dt>
                          <dd className="font-medium text-olive-900 text-body-sm text-right">
                            {Object.values(variant!.attributes).join(' / ') || variant!.name}
                          </dd>
                        </div>
                        <div className="flex justify-between py-2 border-b border-olive-100 gap-6">
                          <dt className="text-olive-600 text-body-sm">SKU</dt>
                          <dd className="font-medium text-olive-900 text-body-sm text-right">{variant!.sku}</dd>
                        </div>
                        <div className="flex justify-between py-2 gap-6">
                          <dt className="text-olive-600 text-body-sm">Stock Available</dt>
                          <dd className={cn('font-medium text-body-sm text-right', inStock ? 'text-sage-600' : 'text-red-600')}>
                            {inStock ? `${variant!.inventory} units` : 'Out of Stock'}
                          </dd>
                        </div>
                      </>
                    )}
                  </dl>
                </TabsContent>

                <TabsContent value="shipping" className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-olive-900 text-body-sm mb-2">Shipping</h3>
                      <ul className="space-y-2 text-olive-600 text-body-sm">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0" aria-hidden="true" /> Free shipping on orders over ₹2,000</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0" aria-hidden="true" /> Standard delivery: 5-7 business days (₹99)</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0" aria-hidden="true" /> We ship across India with tracking</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-olive-900 text-body-sm mb-2">Returns & Exchanges</h3>
                      <ul className="space-y-2 text-olive-600 text-body-sm">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0" aria-hidden="true" /> 7-day return policy from delivery date</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0" aria-hidden="true" /> Items must be unused and in original packaging</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0" aria-hidden="true" /> Full refund or exchange available</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0" aria-hidden="true" /> Return shipping covered for defective items</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="pt-6">
                  {reviews.length > 0 ? (
                    <div className="space-y-5">
                      {reviews.map((review) => (
                        <article key={review.id} className="border-b border-olive-100 pb-5 last:border-b-0 last:pb-0">
                          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                            <div className="flex items-center gap-3">
                              <StarRating rating={review.rating} />
                              {review.isVerifiedPurchase && (
                                <Badge variant="success" size="sm">Verified Purchase</Badge>
                              )}
                            </div>
                            <time className="text-caption text-olive-400" dateTime={review.createdAt}>
                              {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </time>
                          </div>
                          {review.title && (
                            <h4 className="font-medium text-olive-900 text-body-sm mb-1">{review.title}</h4>
                          )}
                          <p className="text-olive-600 text-body-sm leading-relaxed">{review.content}</p>
                          <p className="text-caption text-olive-400 mt-2">— {review.userName}</p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="w-10 h-10 mx-auto text-olive-200 mb-3" aria-hidden="true" />
                      <p className="text-olive-600 text-body-sm">
                        No reviews yet. {product.reviewCount > 0 ? 'Check back soon.' : 'Be the first to share your experience with this product.'}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 lg:mt-20"
            aria-label="Related products"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="heading-2">You May Also Like</h2>
              {categorySlug && (
                <Button asChild variant="outline">
                  <Link to={`/category/${categorySlug}`}>
                    View All <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Zoom Modal */}
      <Modal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        size="full"
        showCloseButton
        aria-label="Product image zoom"
      >
        <div className="relative aspect-square max-h-[80vh] mx-auto">
          {imageUrls[selectedImage] && (
            <img
              src={imageUrls[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          )}
          {imageUrls.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setSelectedImage((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-sm text-olive-600 hover:text-olive-900 hover:bg-white shadow-lg transition-all"
                aria-label="Previous image"
              >
                <ChevronRight className="w-6 h-6 rotate-180" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedImage((prev) => (prev + 1) % imageUrls.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-sm text-olive-600 hover:text-olive-900 hover:bg-white shadow-lg transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
