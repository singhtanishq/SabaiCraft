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
    variantId: item.variantId,
    variant: item.variant,
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
          id: `wish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
        const currentItems = items.filter(
          (item) => !(item.productId === productId && item.variantId === variantId)
        );
        set({ items: currentItems });

        if (syncWithBackend) {
          // Find the wishlist item ID to remove from backend
          const item = items.find(
            (i) => i.productId === productId && i.variantId === variantId
          );
          if (item) {
            try {
              await api.removeFromWishlist(item.id);
              await get().fetchWishlist();
            } catch (error) {
              console.error('Failed to sync wishlist with backend:', error);
              set({ items }); // Revert
            }
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
          (item) => item.productId === productId && item.variantId === variantId
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
    }
  )
);