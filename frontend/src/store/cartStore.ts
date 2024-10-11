import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '../services/api';
import { normalizeVariant } from '../utils/normalize';
import type { Cart, CartItem, Product, ProductVariant } from '../types';

interface CartState {
  cart: Cart | null;
  isCartOpen: boolean;
  isLoading: boolean;
  syncWithBackend: boolean;
  setCart: (cart: Cart | null) => void;
  fetchCart: () => Promise<void>;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  enableBackendSync: (options?: { merge?: boolean }) => Promise<void>;
  disableBackendSync: () => void;
}

const createEmptyCart = (): Cart => ({
  id: `cart_${Date.now()}`,
  items: [],
  subtotal: 0,
  discount: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
  const shipping = subtotal >= 200000 ? 0 : 9900;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total, discount: 0 };
};

const transformBackendCart = (backendCart: any): Cart => {
  if (!backendCart) return createEmptyCart();
  const items: CartItem[] = (backendCart.items || []).map((item: any) => ({
    id: item.id,
    productId: item.productId,
    product: item.product,
    variantId: item.variantId,
    variant: normalizeVariant(item.variant),
    quantity: item.quantity,
  }));
  return {
    id: backendCart.id,
    items,
    subtotal: backendCart.subtotal,
    discount: backendCart.discount,
    shipping: backendCart.shipping,
    tax: backendCart.tax,
    total: backendCart.total,
    couponCode: backendCart.couponCode,
    createdAt: backendCart.createdAt,
    updatedAt: backendCart.updatedAt,
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isCartOpen: false,
      isLoading: false,
      syncWithBackend: false,

      setCart: (cart) => set({ cart }),

      fetchCart: async () => {
        const { syncWithBackend } = get();
        if (!syncWithBackend) return;

        set({ isLoading: true });
        try {
          const response = await api.getCart();
          if (response.success) {
            set({ cart: transformBackendCart(response.data), isLoading: false });
          }
        } catch (error) {
          console.error('Failed to fetch cart:', error);
          set({ isLoading: false });
        }
      },

      addItem: async (product, variant, quantity = 1) => {
        const { syncWithBackend, cart } = get();
        
        // Optimistic update
        const currentCart = cart || createEmptyCart();
        const existingItemIndex = currentCart.items.findIndex(
          (item) => item.productId === product.id && item.variantId === variant.id
        );

        let newItems: CartItem[];
        if (existingItemIndex >= 0) {
          newItems = currentCart.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const newItem: CartItem = {
            id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            productId: product.id,
            product,
            variantId: variant.id,
            variant,
            quantity,
          };
          newItems = [...currentCart.items, newItem];
        }

        const { subtotal, shipping, tax, total, discount } = calculateTotals(newItems);
        const updatedCart = {
          ...currentCart,
          items: newItems,
          subtotal,
          discount,
          shipping,
          tax,
          total,
          updatedAt: new Date().toISOString(),
        };

        set({ cart: updatedCart, isCartOpen: true });

        // Sync with backend if enabled
        if (syncWithBackend) {
          try {
            await api.addToCart(product.id, variant.id, quantity);
            await get().fetchCart();
          } catch (error) {
            console.error('Failed to sync cart with backend:', error);
            // Revert optimistic update on failure
            set({ cart: currentCart });
          }
        }
      },

      removeItem: async (itemId) => {
        const { syncWithBackend, cart } = get();
        if (!cart) return;

        const currentCart = cart;
        const newItems = currentCart.items.filter((item) => item.id !== itemId);
        const { subtotal, shipping, tax, total, discount } = calculateTotals(newItems);
        const updatedCart = {
          ...currentCart,
          items: newItems,
          subtotal,
          discount,
          shipping,
          tax,
          total,
          updatedAt: new Date().toISOString(),
        };

        set({ cart: updatedCart });

        if (syncWithBackend) {
          try {
            await api.removeCartItem(itemId);
            await get().fetchCart();
          } catch (error) {
            console.error('Failed to sync cart with backend:', error);
            set({ cart: currentCart });
          }
        }
      },

      updateQuantity: async (itemId, quantity) => {
        const { syncWithBackend, cart } = get();
        if (!cart) return;

        if (quantity <= 0) {
          return get().removeItem(itemId);
        }

        const currentCart = cart;
        const item = currentCart.items.find((i) => i.id === itemId);
        if (!item || quantity > item.variant.inventory) return;

        const newItems = currentCart.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
        const { subtotal, shipping, tax, total, discount } = calculateTotals(newItems);
        const updatedCart = {
          ...currentCart,
          items: newItems,
          subtotal,
          discount,
          shipping,
          tax,
          total,
          updatedAt: new Date().toISOString(),
        };

        set({ cart: updatedCart });

        if (syncWithBackend) {
          try {
            await api.updateCartItem(itemId, quantity);
            await get().fetchCart();
          } catch (error) {
            console.error('Failed to sync cart with backend:', error);
            set({ cart: currentCart });
          }
        }
      },

      clearCart: async () => {
        const { syncWithBackend } = get();
        set({ cart: createEmptyCart() });

        if (syncWithBackend) {
          try {
            await api.clearCart();
          } catch (error) {
            console.error('Failed to clear cart on backend:', error);
          }
        }
      },

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      getItemCount: () => {
        const cart = get().cart;
        return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
      },

      getSubtotal: () => {
        const cart = get().cart;
        return cart?.subtotal || 0;
      },

      enableBackendSync: async (options) => {
        // Merge the guest cart into the backend cart so items added before
        // sign-in survive the handoff instead of being overwritten by the
        // (usually empty) server-side cart. Only fresh logins merge — session
        // restores must not, or every reload would duplicate the same items.
        const shouldMerge = options?.merge === true;
        const localCart = get().cart;
        set({ syncWithBackend: true });

        if (shouldMerge && localCart && localCart.items.length > 0) {
          try {
            for (const item of localCart.items) {
              await api.addToCart(item.productId, item.variantId, item.quantity);
            }
            // Backend is now the source of truth for these items.
            set({ cart: createEmptyCart() });
          } catch (error) {
            console.error('Failed to merge guest cart into backend:', error);
            // Keep local items on failure; the fetch below still runs.
          }
        }

        await get().fetchCart();
      },

      disableBackendSync: () => set({ syncWithBackend: false }),
    }),
    {
      name: 'sabaicraft-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);