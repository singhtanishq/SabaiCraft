import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api, ApiError } from '../services/api';
import { useCartStore } from './cartStore';
import { useWishlistStore } from './wishlistStore';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await api.login(email, password);
          if (response.success && response.data) {
            api.setToken(response.data.token);
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            useCartStore.getState().enableBackendSync();
            useWishlistStore.getState().enableBackendSync();
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error) {
          set({ isLoading: false });
          if (error instanceof ApiError) {
            throw new Error(error.message);
          }
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await api.register(data);
          if (response.success && response.data) {
            api.setToken(response.data.token);
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            useCartStore.getState().enableBackendSync();
            useWishlistStore.getState().enableBackendSync();
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        } catch (error) {
          set({ isLoading: false });
          if (error instanceof ApiError) {
            throw new Error(error.message);
          }
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          api.setToken(null);
          useCartStore.getState().disableBackendSync();
          useWishlistStore.getState().disableBackendSync();
          useWishlistStore.getState().clearLocal();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      initAuth: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          set({ isLoading: false });
          return;
        }

        api.setToken(token);
        try {
          const response = await api.getMe();
          if (response.success && response.data) {
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
            useCartStore.getState().enableBackendSync();
            useWishlistStore.getState().enableBackendSync();
          } else {
            api.setToken(null);
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch (error) {
          // Only log the user out for an explicit auth rejection; transient
          // network/server errors keep the session for a later retry.
          if (error instanceof ApiError && error.status === 401) {
            api.setToken(null);
            useCartStore.getState().disableBackendSync();
            useWishlistStore.getState().disableBackendSync();
            set({ user: null, isAuthenticated: false, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        }
      },
    }),
    {
      name: 'sabaicraft-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initAuth();
        }
      },
    }
  )
);