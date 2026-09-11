import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ShoppingBag, Heart, Star, Truck, Shield, RotateCcw, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { products, getProductBySlug, getRelatedProducts, categories } from '../../data/products';
import { ProductCard } from '../product/ProductCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { SkeletonProductCard } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { cn, formatPrice, calculateDiscountPercent } from '../../../utils/format';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import type { Product, ProductVariant } from '../../types';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : null;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  if (!product) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <EmptyState
          illustration={<EmptyState />}
          title="Product Not Found"
          description="The product you're looking for doesn't exist or has been removed."
          action={{ label: 'Continue Shopping', onClick: () => window.location.href = '/shop', variant: 'primary' }}
        />
      </div>
    );
  }

  if (!selectedVariant) {
    setSelectedVariant(product.variants[0]);
  }

  const wishlisted = isInWishlist(product.id, selectedVariant.id);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.basePrice;
  const discountPercent = calculateDiscountPercent(product.basePrice, product.compareAtPrice);
  const inStock = selectedVariant.inventory > 0;
  const lowStock = inStock && selectedVariant.inventory <= 5;
  const relatedProducts = getRelatedProducts(product.id, product.categoryId, 4);

  const imageUrls = product.images.map((img) => img.url);

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    addItem(product, selectedVariant, quantity);
    window.location.href = '/checkout';
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-olive-100" aria-label="Breadcrumb">
        <div className="container-main py-4">
          <ol className="flex items-center gap-2 text-body-sm text-olive-500">
            <li><Link to="/" className="hover:text-olive-700">Home</Link></li>
            <li><ChevronRight className="w-4 h-4 flex-shrink-0" /></li>
            <li><Link to="/shop" className="hover:text-olive-700">Shop</Link></li>
            <li><ChevronRight className="w-4 h-4 flex-shrink-0" /></li>
            <li><Link to={`/category/${categories.find(c => c.id === product.categoryId)?.slug}`} className="hover:text-olive-700">{categories.find(c => c.id === product.categoryId)?.name}</Link></li>
            <li><ChevronRight className="w-4 h-4 flex-shrink-0" /></li>
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
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-olive-50 mb-4">
              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute inset-0 w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2"
                aria-label="Zoom product image"
              >
                <motion.img
                  src={imageUrls[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  loading="eager"
                />
              </button>

              {/* Image Navigation */}
              {imageUrls.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-sm text-olive-600 hover:text-olive-900 hover:bg-white shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % imageUrls.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-sm text-olive-600 hover:text-olive-900 hover:bg-white shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {imageUrls.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
                {imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all',
                      index === selectedImage
                        ? 'border-sage-600 ring-2 ring-sage-600/20'
                        : 'border-transparent hover:border-olive-300'
                    )}
                    aria-label={`View image ${index + 1}`}
                    aria-current={index === selectedImage ? 'true' : 'false'}
                  >
                    <img src={url} alt={`${product.name} - view ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-4 gap-4 text-center">
              {[
                { icon: Truck, label: 'Free Shipping', desc: 'Over ₹2,000' },
                { icon: Shield, label: 'Secure Payment', desc: '100% Protected' },
                { icon: RotateCcw, label: 'Easy Returns', desc: '7 Days' },
                { icon: CheckCircle, label: 'Quality Check', desc: 'Verified' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-600">
                    <item.icon className="w-5 h-5" />
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
                <Link
                  to={`/category/${categories.find(c => c.id === product.categoryId)?.slug}`}
                  className="badge badge-primary"
                >
                  {categories.find(c => c.id === product.categoryId)?.name}
                </Link>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn('w-5 h-5', star <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-olive-200')}
                    />
                  ))}
                  <span className="text-body-sm font-medium text-olive-700 ml-1">{product.rating.toFixed(1)}</span>
                  <span className="text-caption text-olive-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="heading-1 text-balance">{product.name}</h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-display font-medium text-heading-xl text-olive-950">
                  {formatPrice(selectedVariant.price || product.basePrice)}
                </span>
                {hasDiscount && (
                  <span className="text-heading-sm text-olive-400 line-through">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                )}
                {hasDiscount && (
                  <Badge variant="danger">Save {discountPercent}%</Badge>
                )}
              </div>

              {/* Short Description */}
              <p className="body-lg text-olive-600 border-t border-olive-100 pt-6">
                {product.shortDescription}
              </p>

              {/* Variant Selector */}
              {product.variants.length > 1 && (
                <div className="space-y-3">
                  <label className="label">Select Variant</label>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Product variants">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => {
                          setSelectedVariant(variant);
                          setQuantity(1);
                        }}
                        className={cn(
                          'px-4 py-3 rounded-lg border-2 font-medium text-body-sm transition-all',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2',
                          variant.inventory === 0
                            ? 'border-olive-200 bg-olive-50 text-olive-400 cursor-not-allowed'
                            : selectedVariant.id === variant.id
                              ? 'border-sage-600 bg-sage-50 text-sage-800'
                              : 'border-olive-200 hover:border-olive-300 hover:bg-olive-50 text-olive-700'
                        )}
                        disabled={variant.inventory === 0}
                        aria-pressed={selectedVariant.id === variant.id}
                      >
                        {Object.values(variant.attributes).join(' / ')}
                        {variant.compareAtPrice && variant.compareAtPrice > variant.price && (
                          <span className="ml-2 text-caption text-olive-400 line-through">
                            {formatPrice(variant.compareAtPrice)}
                          </span>
                        )}
                        {variant.inventory === 0 && <span className="ml-2 text-caption text-red-500">(Out of Stock)</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-3">
                <label className="label">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-olive-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      disabled={quantity <= 1 || !inStock}
                      className="px-4 py-2 bg-olive-50 text-olive-600 hover:bg-olive-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={selectedVariant.inventory}
                      className="w-16 text-center border-x border-olive-200 bg-white focus:outline-none text-body font-medium"
                      aria-label="Quantity"
                    />
                    <button
                      onClick={() => setQuantity((prev) => Math.min(selectedVariant.inventory, prev + 1))}
                      disabled={quantity >= selectedVariant.inventory || !inStock}
                      className="px-4 py-2 bg-olive-50 text-olive-600 hover:bg-olive-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Increase quantity"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                  {lowStock && (
                    <Badge variant="warning" size="sm">
                      Only {selectedVariant.inventory} left in stock
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
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
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
                onClick={() => toggleItem(product, selectedVariant)}
                className={cn(
                  'flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium text-body-sm transition-all w-full sm:w-auto',
                  wishlisted ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100' : 'border-olive-200 hover:border-olive-300 text-olive-700'
                )}
              >
                <Heart className={cn('w-5 h-5', wishlisted ? 'fill-current' : '')} />
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
                  <div className="prose prose-olive max-w-none">
                    <p className="body-lg text-olive-700 leading-relaxed">{product.description}</p>
                  </div>
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
                      <div key={key} className="flex justify-between py-2 border-b border-olive-100">
                        <dt className="text-olive-600 text-body-sm">{key}</dt>
                        <dd className="font-medium text-olive-900 text-body-sm text-right max-w-xs truncate">{value}</dd>
                      </div>
                    ))}
                    {selectedVariant && (
                      <>
                        <div className="flex justify-between py-2 border-b border-olive-100">
                          <dt className="text-olive-600 text-body-sm">Variant</dt>
                          <dd className="font-medium text-olive-900 text-body-sm text-right">
                            {Object.values(selectedVariant.attributes).join(' / ')}
                          </dd>
                        </div>
                        <div className="flex justify-between py-2 border-b border-olive-100">
                          <dt className="text-olive-600 text-body-sm">SKU</dt>
                          <dd className="font-medium text-olive-900 text-body-sm text-right">{selectedVariant.sku}</dd>
                        </div>
                        <div className="flex justify-between py-2">
                          <dt className="text-olive-600 text-body-sm">Stock Available</dt>
                          <dd className={cn('font-medium text-body-sm text-right', inStock ? 'text-sage-600' : 'text-red-600')}>
                            {inStock ? `${selectedVariant.inventory} units` : 'Out of Stock'}
                          </dd>
                        </div>
                      </>
                    )}
                  </dl>
                </TabsContent>

                <TabsContent value="shipping" className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-olive-900 text-body-sm mb-2">Shipping</h4>
                      <ul className="space-y-2 text-olive-600 text-body-sm">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0" /> Free shipping on orders over ₹2,000</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0" /> Standard delivery: 5-7 business days</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0" /> Express delivery: 2-3 business days (additional charge)</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0" /> We ship across India</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-olive-900 text-body-sm mb-2">Returns & Exchanges</h4>
                      <ul className="space-y-2 text-olive-600 text-body-sm">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0" /> 7-day return policy from delivery date</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0" /> Items must be unused and in original packaging</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0" /> Full refund or exchange available</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0" /> Return shipping covered for defective items</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="pt-6">
                  <div className="space-y-4">
                    <p className="text-olive-600 text-body-sm">Reviews will be displayed here. Connect your review system to show customer feedback.</p>
                    <Button variant="outline" onClick={() => setShowReviewModal(true)}>
                      Write a Review
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 lg:mt-20"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="heading-2">You May Also Like</h2>
              <Button asChild variant="outline">
                <Link to={`/category/${categories.find(c => c.id === product.categoryId)?.slug}`}>
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={toggleItem}
                />
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
      >
        <div className="relative aspect-square">
          <img
            src={imageUrls[selectedImage]}
            alt={product.name}
            className="w-full h-full object-contain"
          />
          {imageUrls.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImage((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-sm text-olive-600 hover:text-olive-900 hover:bg-white shadow-lg transition-all"
              >
                <ChevronRight className="w-6 h-6 rotate-180" />
              </button>
              <button
                onClick={() => setSelectedImage((prev) => (prev + 1) % imageUrls.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-sm text-olive-600 hover:text-olive-900 hover:bg-white shadow-lg transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Write a Review"
        size="md"
      >
        <form className="space-y-4">
          <div>
            <label className="label">Your Rating</label>
            <div className="flex gap-1" role="radiogroup">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-2 text-olive-200 hover:text-yellow-400 transition-colors"
                  aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Input label="Review Title" placeholder="Summarize your experience" />
          </div>
          <div>
            <label className="label">Your Review</label>
            <textarea className="input min-h-[120px] resize-y" placeholder="Share your thoughts..." />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowReviewModal(false)}>Cancel</Button>
            <Button variant="primary">Submit Review</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}