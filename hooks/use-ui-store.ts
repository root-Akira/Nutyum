import { create } from 'zustand';

interface ToastState {
  message: string;
  visible: boolean;
}

interface UIStore {
  searchOpen: boolean;
  cartOpen: boolean;
  mobileMenuOpen: boolean;
  activeVibe: string | null;
  toast: ToastState;
  toggleSearch: () => void;
  openCart: () => void;
  closeCart: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setActiveVibe: (vibe: string | null) => void;
  showToast: (message: string) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  searchOpen: false,
  cartOpen: false,
  mobileMenuOpen: false,
  activeVibe: null,
  toast: { message: "", visible: false },

  toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setActiveVibe: (vibe) => set({ activeVibe: vibe }),
  showToast: (message) => set({ toast: { message, visible: true } }),
  hideToast: () => set({ toast: { message: "", visible: false } }),
}));
