import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products, searchProducts } from '../../data/products';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '@utils/cn';
import { formatPrice } from '@utils/format';

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sabaicraft-recent-searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Save to recent searches
      const newRecent = [searchQuery.trim(), ...recentSearches.filter(s => s !== searchQuery.trim())].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('sabaicraft-recent-searches', JSON.stringify(newRecent));

      setIsOpen(false);
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const filteredProducts = query.trim()
    ? searchProducts(query.trim()).slice(0, 5)
    : [];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-start justify-center pt-20"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-elevated overflow-hidden"
              ref={modalRef}
            >
              {/* Search Input */}
              <div className="p-4 border-b border-olive-100">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-olive-400" />
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search products, categories..."
                    className="w-full pl-12 pr-16 py-4 text-body-lg bg-olive-50 border border-olive-200 rounded-xl focus:outline-none focus:border-sage-600 focus:ring-2 focus:ring-sage-500/20 placeholder-olive-400"
                    autoFocus
                    aria-label="Search"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-olive-400 hover:text-olive-600 rounded-lg hover:bg-olive-100"
                      aria-label="Clear search"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-olive-400 hover:text-olive-600 rounded-lg hover:bg-olive-100"
                    aria-label="Close search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Keyboard hint */}
                <p className="text-caption text-olive-500 mt-2 text-center">
                  Press <kbd className="px-2 py-0.5 bg-olive-100 rounded text-olive-700 font-mono text-xs">⌘K</kbd> to open, <kbd className="px-2 py-0.5 bg-olive-100 rounded text-olive-700 font-mono text-xs">Esc</kbd> to close
                </p>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {query.trim() ? (
                  <>
                    {filteredProducts.length > 0 && (
                      <div className="p-4 border-b border-olive-100">
                        <h3 className="font-medium text-olive-900 text-body-sm mb-3">Products</h3>
                        <div className="space-y-2">
                          {filteredProducts.map((product) => (
                            <Link
                              key={product.id}
                              to={`/product/${product.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-olive-50 transition-colors"
                            >
                              <img
                                src={product.images[0]?.url}
                                alt={product.name}
                                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                loading="lazy"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-olive-900 text-body-sm truncate">{product.name}</p>
                                <p className="text-caption text-olive-500">{product.categoryId}</p>
                              </div>
                              <span className="font-display font-medium text-olive-950 text-body">{formatPrice(product.basePrice)}</span>
                            </Link>
                          ))}
                        </div>
                        <div className="text-center mt-3">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/shop?q=${encodeURIComponent(query)}`} onClick={() => setIsOpen(false)}>
                              View All Results
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}

                    {filteredProducts.length === 0 && query.trim() && (
                      <div className="p-8 text-center">
                        <Search className="w-12 h-12 mx-auto text-olive-300 mb-3" />
                        <p className="text-olive-600 text-body">No products found for &ldquo;{query}&rdquo;</p>
                        <p className="text-olive-400 text-body-sm mt-1">Try different keywords or browse our categories</p>
                      </div>
                    )}
                  </>
                ) : (
                  // Recent searches
                  recentSearches.length > 0 && (
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
                            onClick={() => {
                              setQuery(search);
                              handleSearch(search);
                            }}
                            className="px-3 py-1.5 bg-olive-50 text-olive-700 rounded-full text-caption hover:bg-olive-100 transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {/* Popular searches */}
                {!query.trim() && (
                  <div className="p-4">
                    <h3 className="font-medium text-olive-900 text-body-sm mb-3">Popular Searches</h3>
                    <div className="flex flex-wrap gap-2">
                      {['baskets', 'mats', 'bags', 'coasters', 'gifts', 'eco-friendly'].map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setQuery(term);
                            handleSearch(term);
                          }}
                          className="px-4 py-2 bg-olive-50 text-olive-700 rounded-full text-body-sm hover:bg-olive-100 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger - this is controlled by keyboard shortcut */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.openSearchModal = function() {
              const event = new CustomEvent('open-search-modal');
              window.dispatchEvent(event);
            };
          `,
        }}
      />
    </>
  );
}

// Listen for custom event to open search
if (typeof window !== 'undefined') {
  window.addEventListener('open-search-modal', () => {
    // This will be handled by the component's internal state
  });
}