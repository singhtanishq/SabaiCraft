import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Cart, CartItem, Product, ProductVariant, WishlistItem } from '../../types';

interface CartState {
  cart: Cart | null;
  isCartOpen: boolean;
  setCart: (cart: Cart | null) => void;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
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
  const shipping = subtotal >= 200000 ? 0 : 9900; // Free shipping over ₹2000
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total, discount: 0 };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isCartOpen: false,

      setCart: (cart) => set({ cart }),

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const cart = state.cart || createEmptyCart();
          const existingItemIndex = cart.items.findIndex(
            (item) => item.productId === product.id && item.variantId === variant.id
          );

          let newItems: CartItem[];
          if (existingItemIndex >= 0) {
            newItems = cart.items.map((item, index) =>
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
            newItems = [...cart.items, newItem];
          }

          const { subtotal, shipping, tax, total, discount } = calculateTotals(newItems);
          return {
            cart: {
              ...cart,
              items: newItems,
              subtotal,
              discount,
              shipping,
              tax,
              total,
              updatedAt: new Date().toISOString(),
            },
            isCartOpen: true, // Auto-open cart when adding item
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => {
          if (!state.cart) return state;
          const newItems = state.cart.items.filter((item) => item.id !== itemId);
          const { subtotal, shipping, tax, total, discount } = calculateTotals(newItems);
          return {
            cart: {
              ...state.cart,
              items: newItems,
              subtotal,
              discount,
              shipping,
              tax,
              total,
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          if (!state.cart) return state;
          if (quantity <= 0) {
            const newItems = state.cart.items.filter((item) => item.id !== itemId);
            const { subtotal, shipping, tax, total, discount } = calculateTotals(newItems);
            return {
              cart: {
                ...state.cart,
                items: newItems,
                subtotal,
                discount,
                shipping,
                tax,
                total,
                updatedAt: new Date().toISOString(),
              },
            };
          }
          const newItems = state.cart.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          );
          const { subtotal, shipping, tax, total, discount } = calculateTotals(newItems);
          return {
            cart: {
              ...state.cart,
              items: newItems,
              subtotal,
              discount,
              shipping,
              tax,
              total,
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      clearCart: () => set({ cart: createEmptyCart() }),

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
    }),
    {
      name: 'sabaicraft-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);