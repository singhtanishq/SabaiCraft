import { useEffect, useState } from 'react';
import { api } from '@services/api';
import { normalizeVariant } from '@utils/normalize';
import { products as localProducts, categories as localCategories } from '@data/products';
import type { Category, Product, ProductVariant } from '@app-types';

/**
 * Fetches the catalog from the backend API with a graceful fallback to the
 * bundled local dataset, so the storefront keeps working when the API is
 * unreachable (e.g. backend not started). Exposes loading/error state so
 * pages can render skeletons or error banners.
 */

export function normalizeProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? '',
    shortDescription: p.shortDescription ?? undefined,
    categoryId: p.categoryId,
    category: p.category
      ? {
          id: p.category.id,
          name: p.category.name,
          slug: p.category.slug,
          productCount: 0,
          createdAt: '',
          updatedAt: '',
        }
      : undefined,
    images: (p.images ?? []).map((img: any) => ({
      id: img.id,
      url: img.url,
      alt: img.alt ?? p.name,
      position: img.position ?? 0,
    })),
    variants: (p.variants ?? []).map(normalizeVariant),
    basePrice: p.basePrice,
    compareAtPrice: p.compareAtPrice ?? undefined,
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    isActive: p.isActive ?? true,
    isFeatured: p.isFeatured ?? false,
    tags: Array.isArray(p.tags)
      ? p.tags
      : String(p.tags ?? '')
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean),
    createdAt: p.createdAt ?? '',
    updatedAt: p.updatedAt ?? '',
  };
}

export function normalizeCategory(c: any): Category {
  const childCount = (c.children ?? []).reduce(
    (sum: number, child: any) => sum + (child._count?.products ?? 0),
    0
  );
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? undefined,
    image: c.image ?? undefined,
    parentId: c.parentId ?? undefined,
    children: (c.children ?? []).map(normalizeCategory),
    productCount: c._count?.products ?? c.productCount ?? childCount,
    createdAt: c.createdAt ?? '',
    updatedAt: c.updatedAt ?? '',
  };
}

export interface CatalogState {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  usingFallback: boolean;
}

export function useCatalog(): CatalogState {
  const [state, setState] = useState<CatalogState>({
    products: [],
    categories: [],
    isLoading: true,
    error: null,
    usingFallback: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.getProducts({ limit: 50 }),
          api.getCategories(),
        ]);
        if (cancelled) return;
        const products = (productsResponse.data ?? []).map(normalizeProduct);
        const categories = (categoriesResponse.data ?? []).map(normalizeCategory);
        if (products.length === 0) throw new Error('Catalog is empty');
        setState({ products, categories, isLoading: false, error: null, usingFallback: false });
      } catch {
        // API unavailable — fall back to the bundled dataset.
        if (cancelled) return;
        setState({
          products: localProducts,
          categories: localCategories,
          isLoading: false,
          error: null,
          usingFallback: true,
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/** Client-side helpers shared by catalog pages. */
export function searchLocalProducts(list: Product[], query: string): Product[] {
  const lower = query.toLowerCase();
  return list.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.tags.some((t) => t.toLowerCase().includes(lower))
  );
}

export function sortProducts(
  list: Product[],
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular'
): Product[] {
  const result = [...list];
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
    case 'newest':
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
  }
  return result;
}
