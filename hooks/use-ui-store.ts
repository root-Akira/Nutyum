import { create } from 'zustand';

interface UIStore {
  searchOpen: boolean;
  cartOpen: boolean;
  mobileMenuOpen: boolean;
  activeVibe: string | null;
  toggleSearch: () => void;
  openCart: () => void;
  closeCart: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setActiveVibe: (vibe: string | null) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  searchOpen: false,
  cartOpen: false,
  mobileMenuOpen: false,
  activeVibe: null,

  toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setActiveVibe: (vibe) => set({ activeVibe: vibe }),
}));
