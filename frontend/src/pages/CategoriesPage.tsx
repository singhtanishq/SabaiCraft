import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { categories, products } from '@data/products';
import { ProductCard } from '@components/product/ProductCard';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { EmptyState } from '@components/ui/EmptyState';
import { formatPrice, calculateDiscountPercent } from '@utils/format';
import { cn } from '@utils/cn';
import { useCartStore } from '@store/cartStore';
import { useWishlistStore } from '@store/wishlistStore';
import type { Product } from '@app-types';

export function CategoriesPage() {
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  const topLevelCategories = categories.filter((c) => !c.parentId);
  const categoriesWithProducts = topLevelCategories.map((category) => ({
    ...category,
    productCount: products.filter((p) => p.categoryId === category.id || categories.find((c) => c.parentId === category.id)?.id === p.categoryId).length,
    featuredProducts: products
      .filter((p) => p.categoryId === category.id || categories.find((c) => c.parentId === category.id)?.id === p.categoryId)
      .slice(0, 4),
  }));

  const handleAddToCart = (product: Product) => {
    addItem(product, product.variants[0], 1);
  };

  const handleWishlist = (product: Product) => {
    toggleItem(product, product.variants[0]);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="relative bg-olive-950 text-cream-50 py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/Images/sabai mascot.png')] bg-center bg-cover opacity-[0.03]" />
        <div className="absolute inset-0 bg-gradient-to-br from-olive-950 via-olive-900 to-sage-800" />

        <div className="container-main relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <span className="text-body-sm font-medium">Explore Our Collections</span>
            </div>
            <h1 className="heading-display text-display-md lg:text-display-lg mb-4 text-balance">
              Discover Handcrafted Treasures
            </h1>
            <p className="body-lg text-olive-300 max-w-2xl mx-auto text-pretty">
              Browse our curated categories of sustainable Sabai grass products. Each piece is handwoven by skilled artisans using traditional techniques passed down through generations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section-lg">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesWithProducts.map((category, index) => (
              <motion.article
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link
                  to={`/category/${category.slug}`}
                  className="block card-interactive h-full overflow-hidden"
                  aria-label={`View ${category.name} collection`}
                >
                  {/* Category Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-olive-50">
                    {category.image ? (
                      <motion.img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-olive-300">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-olive-950/80 via-olive-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Product Count Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-caption font-medium text-olive-900">
                        {category.productCount} product{category.productCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="p-6">
                    <h3 className="font-display font-medium text-olive-950 text-heading-lg mb-2 group-hover:text-sage-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-olive-600 text-body-sm mb-4 line-clamp-2">
                      {category.description || `Explore our collection of ${category.name.toLowerCase()} handcrafted with care.`}
                    </p>

                    {/* Featured Products Preview */}
                    {category.featuredProducts.length > 0 && (
                      <div className="space-y-3 mb-4 border-t border-olive-100 pt-4">
                        <p className="caption text-olive-500">Featured products:</p>
                        <div className="flex flex-wrap gap-2">
                          {category.featuredProducts.slice(0, 3).map((product) => (
                            <span key={product.id} className="px-2 py-1 bg-olive-50 text-olive-700 text-caption rounded border border-olive-100 truncate max-w-[120px]">
                              {product.name}
                            </span>
                          ))}
                          {category.featuredProducts.length > 3 && (
                            <span className="px-2 py-1 bg-olive-100 text-olive-600 text-caption rounded border border-olive-200">
                              +{category.featuredProducts.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* View Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-olive-100">
                      <span className="font-medium text-olive-700 text-body-sm">
                        View Collection
                      </span>
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        className="text-sage-600 group-hover:text-sage-700 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 lg:mt-20 text-center"
          >
            <div className="max-w-2xl mx-auto">
              <Card variant="elevated" padding="lg" className="bg-olive-950 text-cream-50">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-sage-100/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-sabai-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="heading-3">Can't Find What You're Looking For?</h4>
                    <p className="text-olive-300 text-body-sm mt-1">Browse all products or use our search to find exactly what you need.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                    <Button asChild variant="primary" size="lg" className="w-full sm:w-auto">
                      <Link to="/shop">View All Products</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-cream-50/30 text-cream-50 hover:bg-cream-50/10">
                      <Link to="/contact">Contact Us</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}