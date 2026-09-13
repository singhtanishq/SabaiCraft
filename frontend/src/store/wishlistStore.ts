import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '../services/api';
import type { Product, ProductVariant, WishlistItem } from '../types';

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  syncWithBackend: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (product: Product, variant?: ProductVariant) => Promise<void>;
  removeItem: (productId: string, variantId?: string) => Promise<void>;
  toggleItem: (product: Product, variant?: ProductVariant) => Promise<void>;
  isInWishlist: (productId: string, variantId?: string) => boolean;
  clearWishlist: () => Promise<void>;
  clearLocal: () => void;
  getItemCount: () => number;
  enableBackendSync: () => void;
  disableBackendSync: () => void;
}

const transformBackendWishlist = (backendItems: any[]): WishlistItem[] => {
  return (backendItems || []).map((item: any) => ({
    id: item.id,
    userId: item.userId,
    productId: item.productId,
    product: item.product,
    variantId: item.variantId ?? undefined,
    createdAt: item.createdAt,
  }));
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      syncWithBackend: false,

      fetchWishlist: async () => {
        const { syncWithBackend } = get();
        if (!syncWithBackend) return;

        set({ isLoading: true });
        try {
          const response = await api.getWishlist();
          if (response.success) {
            set({ items: transformBackendWishlist(response.data), isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
          set({ isLoading: false });
        }
      },

      addItem: async (product, variant) => {
        const { syncWithBackend, items } = get();
        const exists = items.some(
          (item) => item.productId === product.id && item.variantId === variant?.id
        );
        if (exists) return;

        const newItem: WishlistItem = {
          id: `wish_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
          userId: 'guest',
          productId: product.id,
          product,
          variantId: variant?.id,
          createdAt: new Date().toISOString(),
        };
        set({ items: [...items, newItem] });

        if (syncWithBackend) {
          try {
            await api.addToWishlist(product.id, variant?.id);
            await get().fetchWishlist();
          } catch (error) {
            console.error('Failed to sync wishlist with backend:', error);
            set({ items }); // Revert
          }
        }
      },

      removeItem: async (productId, variantId) => {
        const { syncWithBackend, items } = get();
        // Without a variantId, remove every entry for the product. With one,
        // remove the exact variant entry plus any variant-less entry for the
        // product (a generic save covers all variants).
        const targets = items.filter(
          (item) =>
            item.productId === productId &&
            (variantId === undefined || item.variantId === variantId || item.variantId === undefined)
        );
        if (targets.length === 0) return;

        const currentItems = items.filter((item) => !targets.includes(item));
        set({ items: currentItems });

        if (syncWithBackend) {
          try {
            await Promise.all(targets.map((item) => api.removeFromWishlist(item.id)));
            await get().fetchWishlist();
          } catch (error) {
            console.error('Failed to sync wishlist with backend:', error);
            set({ items }); // Revert
          }
        }
      },

      toggleItem: async (product, variant) => {
        const { isInWishlist, addItem, removeItem } = get();
        if (isInWishlist(product.id, variant?.id)) {
          await removeItem(product.id, variant?.id);
        } else {
          await addItem(product, variant);
        }
      },

      isInWishlist: (productId, variantId) => {
        const { items } = get();
        return items.some(
          (item) =>
            item.productId === productId &&
            (variantId === undefined || item.variantId === variantId || item.variantId === undefined)
        );
      },

      clearWishlist: async () => {
        const { syncWithBackend } = get();
        set({ items: [] });

        if (syncWithBackend) {
          try {
            await api.clearWishlist();
          } catch (error) {
            console.error('Failed to clear wishlist on backend:', error);
          }
        }
      },

      clearLocal: () => set({ items: [] }),

      getItemCount: () => get().items.length,

      enableBackendSync: () => {
        set({ syncWithBackend: true });
        get().fetchWishlist();
      },

      disableBackendSync: () => set({ syncWithBackend: false }),
    }),
    {
      name: 'sabaicraft-wishlist',
      storage: createJSONStorage(() => localStorage),
      // Never persist the sync flag; items only (cleared on logout).
      partialize: (state) => ({ items: state.items }),
    }
  )
);
