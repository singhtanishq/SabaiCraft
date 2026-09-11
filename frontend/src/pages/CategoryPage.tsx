import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Grid, List, Filter, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { products, categories, getProductsByCategory } from '@data/products';
import { ProductCard } from '@components/product/ProductCard';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { SkeletonProductGrid } from '@components/ui/Skeleton';
import { EmptyState, EmptySearch } from '@components/ui/EmptyState';
import { cn, formatPrice } from '@utils/format';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import type { Product } from '../../types';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find((c) => c.slug === slug);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  if (!category) {
    return (
      <div className="min-h-screen bg-cream-50 py-16 lg:py-24">
        <div className="container-main max-w-md mx-auto text-center">
          <h1 className="heading-1 mb-4">Category Not Found</h1>
          <Button asChild variant="primary" size="lg">
            <Link to="/categories">Browse All Categories</Link>
          </Button>
        </div>
      </div>
    );
  }

  const filteredProducts = useMemo(() => {
    let result = getProductsByCategory(category.id);

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
      );
    }

    if (inStockOnly) {
      result = result.filter((p) => p.variants.some((v) => v.inventory > 0));
    }

    result = result.filter(
      (p) => p.basePrice >= priceRange[0] && p.basePrice <= priceRange[1]
    );

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price_desc':
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [category.id, searchQuery, sortBy, priceRange, inStockOnly]);

  const handleAddToCart = (product: Product) => {
    addItem(product, product.variants[0], 1);
  };

  const handleWishlist = (product: Product) => {
    toggleItem(product, product.variants[0]);
  };

  const clearFilters = () => {
    setSortBy('newest');
    setPriceRange([0, 300000]);
    setInStockOnly(false);
  };

  const hasActiveFilters = sortBy !== 'newest' || priceRange[0] > 0 || priceRange[1] < 300000 || inStockOnly;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Category Hero */}
      <section className="relative bg-olive-950 text-cream-50 py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/Images/sabai mascot.png')] bg-center bg-cover opacity-[0.03]" />
        <div className="absolute inset-0 bg-gradient-to-br from-olive-950 via-olive-900 to-sage-800" />

        <div className="container-main relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-olive-300 hover:text-sabai-400 text-body-sm mb-4"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              All Categories
            </Link>
            <h1 className="heading-1 mb-3">{category.name}</h1>
            <p className="body-lg text-olive-300 max-w-2xl">
              {category.description || `Explore our collection of ${category.name.toLowerCase()} handcrafted with care.`}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <div className="container-main py-8 lg:py-12">
        <div className="flex lg:gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden btn btn-secondary w-full justify-between"
              >
                <span>Filters</span>
                <ChevronRight className={cn('w-5 h-5 transition-transform', isFilterOpen && 'rotate-180')} />
              </button>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn('space-y-6 lg:block', isFilterOpen ? 'block' : 'hidden lg:block')}
              >
                {/* Search */}
                <div>
                  <label htmlFor="search" className="label">Search in Category</label>
                  <Input
                    id="search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    leftIcon={<Search className="w-5 h-5" />}
                  />
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="label mb-2 flex justify-between">
                    Price Range
                    <span className="text-body-sm text-olive-500">
                      {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    </span>
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="300000"
                      step="5000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full h-2 bg-olive-200 rounded-lg appearance-none cursor-pointer accent-sage-600"
                    />
                    <input
                      type="range"
                      min="0"
                      max="300000"
                      step="5000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-olive-200 rounded-lg appearance-none cursor-pointer accent-sage-600"
                    />
                    <div className="flex justify-between text-caption text-olive-500">
                      <span>Min: {formatPrice(priceRange[0])}</span>
                      <span>Max: {formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 text-sage-600 border-olive-300 rounded focus:ring-sage-500"
                    />
                    <span className="text-body-sm text-olive-700">In Stock Only</span>
                  </label>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
                    Clear All Filters
                  </Button>
                )}
              </motion.div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
              <div className="flex items-center gap-3">
                <span className="text-body-sm text-olive-600">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                </span>
                {hasActiveFilters && (
                  <Badge variant="primary" size="sm">
                    <Filter className="w-3 h-3 mr-1" />
                    Filters Applied
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="input py-2 px-3 text-sm appearance-none bg-white"
                  aria-label="Sort products"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>

                <div className="flex bg-olive-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2 rounded-md transition-colors',
                      viewMode === 'grid' ? 'bg-white shadow-sm text-olive-900' : 'text-olive-500 hover:text-olive-700'
                    )}
                    aria-label="Grid view"
                    aria-pressed={viewMode === 'grid'}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 rounded-md transition-colors',
                      viewMode === 'list' ? 'bg-white shadow-sm text-olive-900' : 'text-olive-500 hover:text-olive-700'
                    )}
                    aria-label="List view"
                    aria-pressed={viewMode === 'list'}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <EmptySearch query={searchQuery || 'your filters'} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  'gap-6',
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'flex flex-col'
                )}
                role="list"
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    variant={viewMode === 'list' ? 'list' : 'grid'}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleWishlist}
                  />
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 12 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((page) => (
                    <button
                      key={page}
                      className={cn(
                        'w-10 h-10 rounded-lg font-medium text-body-sm transition-colors',
                        page === 1
                          ? 'bg-olive-950 text-cream-50'
                          : 'text-olive-600 hover:bg-olive-100 hover:text-olive-900'
                      )}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}