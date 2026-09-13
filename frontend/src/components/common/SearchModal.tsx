import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, SearchX } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { products as localProducts, categories } from '../../data/products';
import { useUIStore } from '../../store/uiStore';
import { Button } from '../ui/Button';
import { formatPrice } from '@utils/format';
import type { Product } from '../../types';

const POPULAR_SEARCHES = ['baskets', 'mats', 'bags', 'coasters', 'gifts', 'eco-friendly'];

export function SearchModal() {
  const { isSearchOpen, closeSearch, openSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sabaicraft-recent-searches');
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {
      // ignore malformed storage
    }
  }, []);

  // Keyboard shortcuts: Cmd/Ctrl+K opens, Escape closes.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, openSearch, closeSearch]);

  // Lock body scroll while open + focus input.
  useEffect(() => {
    if (!isSearchOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(raf);
    };
  }, [isSearchOpen]);

  // Reset transient state when closed.
  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  // Debounced search: backend suggestions with local fallback.
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const response = await api.searchSuggestions(trimmed);
        setResults((response.data ?? []) as Product[]);
      } catch {
        const lower = trimmed.toLowerCase();
        setResults(
          localProducts
            .filter(
              (p) =>
                p.name.toLowerCase().includes(lower) ||
                p.description.toLowerCase().includes(lower) ||
                p.tags.some((t) => t.toLowerCase().includes(lower))
            )
            .slice(0, 6)
        );
      } finally {
        setIsSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const categoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name ?? '';

  const handleSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    const newRecent = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, 5);
    setRecentSearches(newRecent);
    try {
      localStorage.setItem('sabaicraft-recent-searches', JSON.stringify(newRecent));
    } catch {
      // storage unavailable
    }
    closeSearch();
    navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[500] flex items-start justify-center pt-20 px-4 bg-olive-950/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSearch();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-elevated overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-4 border-b border-olive-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-olive-400 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch(query);
                  }}
                  placeholder="Search products, categories..."
                  className="w-full pl-12 pr-24 py-3.5 text-body bg-olive-50 border border-olive-200 rounded-xl focus:outline-none focus:border-sage-600 focus:ring-2 focus:ring-sage-500/20 placeholder-olive-400"
                  aria-label="Search products"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="p-2 text-olive-400 hover:text-olive-600 rounded-lg hover:bg-olive-100"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={closeSearch}
                    className="p-2 text-olive-400 hover:text-olive-600 rounded-lg hover:bg-olive-100"
                    aria-label="Close search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-caption text-olive-500 mt-2 text-center">
                Press <kbd className="px-2 py-0.5 bg-olive-100 rounded text-olive-700 font-mono text-xs">⌘K</kbd> to open,{' '}
                <kbd className="px-2 py-0.5 bg-olive-100 rounded text-olive-700 font-mono text-xs">Esc</kbd> to close
              </p>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim() ? (
                isSearching ? (
                  <div className="p-8 text-center text-olive-500 text-body-sm">Searching…</div>
                ) : results.length > 0 ? (
                  <div className="p-4">
                    <h3 className="font-medium text-olive-900 text-body-sm mb-3">Products</h3>
                    <div className="space-y-1">
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.slug}`}
                          onClick={closeSearch}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-olive-50 transition-colors"
                        >
                          <img
                            src={product.images[0]?.url}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-olive-50"
                            loading="lazy"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-olive-900 text-body-sm truncate">{product.name}</p>
                            <p className="text-caption text-olive-500">{categoryName(product.categoryId)}</p>
                          </div>
                          <span className="font-display font-medium text-olive-950 text-body-sm flex-shrink-0">
                            {formatPrice(product.basePrice)}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="text-center mt-3">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/shop?q=${encodeURIComponent(query.trim())}`} onClick={closeSearch}>
                          View All Results
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <SearchX className="w-12 h-12 mx-auto text-olive-300 mb-3" aria-hidden="true" />
                    <p className="text-olive-600 text-body">
                      No products found for &ldquo;{query.trim()}&rdquo;
                    </p>
                    <p className="text-olive-400 text-body-sm mt-1">
                      Try different keywords or browse our categories
                    </p>
                  </div>
                )
              ) : (
                <>
                  {recentSearches.length > 0 && (
                    <div className="p-4 border-b border-olive-100">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-olive-900 text-body-sm">Recent Searches</h3>
                        <button
                          onClick={() => {
                            setRecentSearches([]);
                            localStorage.removeItem('sabaicraft-recent-searches');
                          }}
                          className="text-caption text-olive-500 hover:text-olive-700"
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search) => (
                          <button
                            key={search}
                            onClick={() => handleSearch(search)}
                            className="px-3 py-1.5 bg-olive-50 text-olive-700 rounded-full text-caption hover:bg-olive-100 transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-medium text-olive-900 text-body-sm mb-3">Popular Searches</h3>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="px-4 py-2 bg-olive-50 text-olive-700 rounded-full text-body-sm hover:bg-olive-100 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
