import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Search, Filter, ChevronDown, Grid, List } from 'lucide-react';
import { useState, useMemo } from 'react';
import { products, categories, searchProducts, getProductsByCategory } from '@data/products';
import { ProductCard } from '@components/product/ProductCard';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { SkeletonProductGrid } from '@components/ui/Skeleton';
import { EmptyState, EmptySearch } from '@components/ui/EmptyState';
import { formatPrice } from '@utils/format'
import { cn } from '@utils/cn';
import { useCartStore } from '@store/cartStore';
import { useWishlistStore } from '@store/wishlistStore';
import type { Product } from '../../types';

export function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.isActive);

    if (searchQuery) {
      result = searchProducts(searchQuery);
    }

    if (selectedCategory) {
      result = result.filter((p) => p.categoryId === selectedCategory);
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
      default:
        // newest - keep original order
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy, priceRange, inStockOnly]);

  const handleAddToCart = (product: Product) => {
    addItem(product, product.variants[0], 1);
  };

  const handleWishlist = (product: Product) => {
    toggleItem(product, product.variants[0]);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSortBy('newest');
    setPriceRange([0, 300000]);
    setInStockOnly(false);
  };

  const hasActiveFilters = selectedCategory || sortBy !== 'newest' || priceRange[0] > 0 || priceRange[1] < 300000 || inStockOnly;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Page Header */}
      <section className="bg-white border-b border-olive-100">
        <div className="container-main py-10 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="heading-1 mb-2">Shop All Products</h1>
            <p className="body-lg text-olive-600">
              Discover our complete collection of handcrafted Sabai grass treasures
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-main py-8 lg:py-12">
        <div className="flex lg:gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden btn btn-secondary w-full justify-between"
              >
                <span>Filters</span>
                <ChevronDown className={cn('w-5 h-5 transition-transform', isFilterOpen && 'rotate-180')} />
              </button>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn('space-y-6 lg:block', isFilterOpen ? 'block' : 'hidden lg:block')}
              >
                {/* Search */}
                <div>
                  <label htmlFor="search" className="label">Search Products</label>
                  <Input
                    id="search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    leftIcon={<Search className="w-5 h-5" />}
                  />
                </div>

                {/* Categories */}
                <div>
                  <h3 className="label">Categories</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={!selectedCategory}
                        onChange={() => setSelectedCategory(null)}
                        className="w-4 h-4 text-sage-600 border-olive-300 focus:ring-sage-500"
                      />
                      <span className="text-body-sm text-olive-700">All Categories</span>
                    </label>
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat.id}
                          onChange={() => setSelectedCategory(cat.id)}
                          className="w-4 h-4 text-sage-600 border-olive-300 focus:ring-sage-500"
                        />
                        <span className="text-body-sm text-olive-700">{cat.name}</span>
                        <span className="text-caption text-olive-400 ml-auto">({cat.productCount})</span>
                      </label>
                    ))}
                  </div>
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
                {/* Sort */}
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

                {/* View Toggle */}
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