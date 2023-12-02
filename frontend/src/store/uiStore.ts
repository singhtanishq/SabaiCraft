import { create } from 'zustand';

interface UIState {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
}));
