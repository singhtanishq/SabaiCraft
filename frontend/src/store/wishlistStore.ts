import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, ProductVariant, WishlistItem } from '../../types';

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product, variant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: string) => void;
  toggleItem: (product: Product, variant?: ProductVariant) => void;
  isInWishlist: (productId: string, variantId?: string) => boolean;
  clearWishlist: () => void;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant) => {
        set((state) => {
          const exists = state.items.some(
            (item) => item.productId === product.id && item.variantId === variant?.id
          );
          if (exists) return state;

          const newItem: WishlistItem = {
            id: `wish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: 'guest', // Will be replaced when user logs in
            productId: product.id,
            product,
            variantId: variant?.id,
            createdAt: new Date().toISOString(),
          };
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          ),
        }));
      },

      toggleItem: (product, variant) => {
        const { isInWishlist, addItem, removeItem } = get();
        if (isInWishlist(product.id, variant?.id)) {
          removeItem(product.id, variant?.id);
        } else {
          addItem(product, variant);
        }
      },

      isInWishlist: (productId, variantId) => {
        const { items } = get();
        return items.some(
          (item) => item.productId === productId && item.variantId === variantId
        );
      },

      clearWishlist: () => set({ items: [] }),

      getItemCount: () => get().items.length,
    }),
    {
      name: 'sabaicraft-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);