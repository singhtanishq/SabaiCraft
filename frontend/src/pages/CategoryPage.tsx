import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown, Grid, List, Filter, Search, ChevronLeft } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useCatalog, searchLocalProducts, sortProducts } from '@hooks/useCatalog';
import { ProductCard } from '@components/product/ProductCard';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { SkeletonProductGrid } from '@components/ui/Skeleton';
import { EmptySearch } from '@components/ui/EmptyState';
import { formatPrice } from '@utils/format';
import { cn } from '@utils/cn';

const PAGE_SIZE = 12;
const MAX_PRICE = 300000;

type SortKey = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, categories, isLoading } = useCatalog();

  // All hooks run unconditionally, before any early return.
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const category = useMemo(
    () => categories.find((c) => c.slug === slug),
    [categories, slug]
  );

  useEffect(() => {
    setPage(1);
    setSearchQuery('');
  }, [slug]);

  const categoryProducts = useMemo(() => {
    if (!category) return [];
    const categoryIds = [category.id, ...(category.children?.map((c) => c.id) ?? [])];
    return products.filter((p) => categoryIds.includes(p.categoryId));
  }, [category, products]);

  const filteredProducts = useMemo(() => {
    let result = categoryProducts;

    if (searchQuery) {
      result = searchLocalProducts(result, searchQuery);
    }

    if (inStockOnly) {
      result = result.filter((p) => p.variants.some((v) => v.inventory > 0));
    }

    result = result.filter(
      (p) => p.basePrice >= priceRange[0] && p.basePrice <= priceRange[1]
    );

    return sortProducts(result, sortBy);
  }, [categoryProducts, searchQuery, sortBy, priceRange, inStockOnly]);

  if (isLoading) {
    return (
      <div className="bg-cream-50">
        <div className="bg-olive-950 py-16 lg:py-24" />
        <div className="container-main py-8 lg:py-12">
          <SkeletonProductGrid count={8} />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="bg-cream-50 py-16 lg:py-24">
        <div className="container-main max-w-md mx-auto text-center">
          <h1 className="heading-1 mb-4">Category Not Found</h1>
          <p className="body text-olive-600 mb-8">
            The category you're looking for doesn't exist or may have been moved.
          </p>
          <Button asChild variant="primary" size="lg">
            <Link to="/categories">Browse All Categories</Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const clearFilters = () => {
    setSortBy('newest');
    setPriceRange([0, MAX_PRICE]);
    setInStockOnly(false);
    setPage(1);
  };

  const hasActiveFilters =
    sortBy !== 'newest' || priceRange[0] > 0 || priceRange[1] < MAX_PRICE || inStockOnly;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    document.getElementById('category-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-cream-50">
      {/* Category Hero */}
      <section className="relative bg-olive-950 text-cream-50 py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/Images/sabai mascot.png')] bg-center bg-cover opacity-[0.03]" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-olive-950 via-olive-900 to-sage-800" aria-hidden="true" />

        <div className="container-main relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <nav aria-label="Breadcrumb" className="mb-4">
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 text-olive-300 hover:text-sabai-400 text-body-sm"
              >
                <ChevronRight className="w-4 h-4 rotate-180" aria-hidden="true" />
                All Categories
              </Link>
            </nav>
            <h1 className="heading-1 mb-3 text-cream-50">{category.name}</h1>
            <p className="body-lg text-olive-300 max-w-2xl">
              {category.description || `Explore our collection of ${category.name.toLowerCase()} handcrafted with care.`}
            </p>
            <p className="text-olive-400 text-caption mt-3">
              {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} in this collection
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <div className="container-main py-8 lg:py-12">
        <div className="flex lg:gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0" aria-label="Product filters">
            <div className="sticky top-24 space-y-6">
              <button
                onClick={() => setIsFilterOpen((v) => !v)}
                className="lg:hidden btn btn-secondary w-full justify-between"
                aria-expanded={isFilterOpen}
              >
                <span>Filters</span>
                <ChevronDown className={cn('w-5 h-5 transition-transform', isFilterOpen && 'rotate-180')} aria-hidden="true" />
              </button>

              <div className={cn('space-y-6 lg:block', isFilterOpen ? 'block' : 'hidden lg:block')}>
                {/* Search */}
                <div>
                  <label htmlFor="category-search" className="label">Search in Category</label>
                  <Input
                    id="category-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search..."
                    leftIcon={<Search className="w-5 h-5" />}
                  />
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="label mb-2 flex justify-between">
                    Price Range
                    <span className="text-body-sm font-normal text-olive-500">
                      {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
                    </span>
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max={MAX_PRICE}
                      step="5000"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const min = Math.min(parseInt(e.target.value, 10), priceRange[1]);
                        setPriceRange([min, priceRange[1]]);
                        setPage(1);
                      }}
                      className="w-full h-2 bg-olive-200 rounded-lg appearance-none cursor-pointer accent-sage-600"
                      aria-label="Minimum price"
                    />
                    <input
                      type="range"
                      min="0"
                      max={MAX_PRICE}
                      step="5000"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const max = Math.max(parseInt(e.target.value, 10), priceRange[0]);
                        setPriceRange([priceRange[0], max]);
                        setPage(1);
                      }}
                      className="w-full h-2 bg-olive-200 rounded-lg appearance-none cursor-pointer accent-sage-600"
                      aria-label="Maximum price"
                    />
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => {
                        setInStockOnly(e.target.checked);
                        setPage(1);
                      }}
                      className="w-4 h-4 text-sage-600 border-olive-300 rounded focus:ring-sage-500"
                    />
                    <span className="text-body-sm text-olive-700">In Stock Only</span>
                  </label>
                </div>

                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0" id="category-results">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
              <div className="flex items-center gap-3">
                <span className="text-body-sm text-olive-600" aria-live="polite">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                </span>
                {hasActiveFilters && (
                  <Badge variant="primary" size="sm">
                    <Filter className="w-3 h-3 mr-1" aria-hidden="true" />
                    Filters Applied
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
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
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2 rounded-md transition-colors',
                      viewMode === 'grid' ? 'bg-white shadow-sm text-olive-900' : 'text-olive-500 hover:text-olive-700'
                    )}
                    aria-label="Grid view"
                    aria-pressed={viewMode === 'grid'}
                  >
                    <Grid className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 rounded-md transition-colors',
                      viewMode === 'list' ? 'bg-white shadow-sm text-olive-900' : 'text-olive-500 hover:text-olive-700'
                    )}
                    aria-label="List view"
                    aria-pressed={viewMode === 'list'}
                  >
                    <List className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {pageProducts.length === 0 ? (
              <EmptySearch query={searchQuery || 'your filters'} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  'gap-6',
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'flex flex-col gap-4'
                )}
                role="list"
              >
                {pageProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} variant={viewMode} />
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => handlePageChange(pageNumber)}
                      className={cn(
                        'w-10 h-10 rounded-lg font-medium text-body-sm transition-colors',
                        pageNumber === currentPage
                          ? 'bg-olive-950 text-cream-50'
                          : 'text-olive-600 hover:bg-olive-100 hover:text-olive-900'
                      )}
                      aria-label={`Page ${pageNumber}`}
                      aria-current={pageNumber === currentPage ? 'page' : undefined}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
