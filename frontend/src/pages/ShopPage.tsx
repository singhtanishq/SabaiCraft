import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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

const VALID_SORTS: SortKey[] = ['newest', 'price_asc', 'price_desc', 'rating', 'popular'];

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, isLoading } = useCatalog();

  const query = searchParams.get('q') ?? '';
  const sortParam = searchParams.get('sort') as SortKey | null;
  const sortBy: SortKey = sortParam && VALID_SORTS.includes(sortParam) ? sortParam : 'newest';

  const [searchInput, setSearchInput] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Keep the input in sync when the URL query changes (e.g. header search).
  useEffect(() => {
    setSearchInput(query);
    setPage(1);
  }, [query]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.isActive);

    if (query) {
      result = searchLocalProducts(result, query);
    }

    if (selectedCategory) {
      const category = categories.find((c) => c.id === selectedCategory);
      const categoryIds = [selectedCategory, ...(category?.children?.map((c) => c.id) ?? [])];
      result = result.filter((p) => categoryIds.includes(p.categoryId));
    }

    if (inStockOnly) {
      result = result.filter((p) => p.variants.some((v) => v.inventory > 0));
    }

    result = result.filter(
      (p) => p.basePrice >= priceRange[0] && p.basePrice <= priceRange[1]
    );

    return sortProducts(result, sortBy);
  }, [products, categories, query, selectedCategory, sortBy, priceRange, inStockOnly]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const updateQuery = (nextQuery: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (nextQuery) next.set('q', nextQuery);
        else next.delete('q');
        return next;
      },
      { replace: true }
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange([0, MAX_PRICE]);
    setInStockOnly(false);
    if (query) updateQuery('');
  };

  const hasActiveFilters =
    !!query || selectedCategory || priceRange[0] > 0 || priceRange[1] < MAX_PRICE || inStockOnly;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    document.getElementById('shop-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-cream-50">
      {/* Page Header */}
      <section className="bg-white border-b border-olive-100">
        <div className="container-main py-10 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="heading-1 mb-2">
              {query ? `Search results for "${query}"` : 'Shop All Products'}
            </h1>
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
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateQuery(searchInput.trim());
                  }}
                >
                  <label htmlFor="shop-search" className="label">Search Products</label>
                  <Input
                    id="shop-search"
                    type="search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search..."
                    leftIcon={<Search className="w-5 h-5" />}
                  />
                </form>

                {/* Categories */}
                <div>
                  <h3 className="label">Categories</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={!selectedCategory}
                        onChange={() => {
                          setSelectedCategory(null);
                          setPage(1);
                        }}
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
                          onChange={() => {
                            setSelectedCategory(cat.id);
                            setPage(1);
                          }}
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
          <div className="flex-1 min-w-0" id="shop-results">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
              <div className="flex items-center gap-3">
                <span className="text-body-sm text-olive-600" aria-live="polite">
                  {isLoading
                    ? 'Loading products…'
                    : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
                </span>
                {hasActiveFilters && !isLoading && (
                  <Badge variant="primary" size="sm">
                    <Filter className="w-3 h-3 mr-1" aria-hidden="true" />
                    Filters Applied
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    const next = e.target.value as SortKey;
                    setSearchParams(
                      (prev) => {
                        const nextParams = new URLSearchParams(prev);
                        if (next === 'newest') nextParams.delete('sort');
                        else nextParams.set('sort', next);
                        return nextParams;
                      },
                      { replace: true }
                    );
                  }}
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
            {isLoading ? (
              <SkeletonProductGrid count={8} />
            ) : pageProducts.length === 0 ? (
              <EmptySearch query={query || 'your filters'} />
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
            {!isLoading && totalPages > 1 && (
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
