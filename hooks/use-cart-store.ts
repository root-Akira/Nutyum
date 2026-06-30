import { create } from "zustand";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  bgColor: string;
  category: string;
  vibes: string[];
  isNew: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  weight: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

interface CartStore {
  items: CartItem[];
  loaded: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  loadItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartStore>()((set) => ({
  items: [],
  loaded: false,

  addItem: (product, quantity = 1) =>
    set((state) => {
      const existing = state.items.find((item) => item.productId === product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, 99) }
              : item
          ),
        };
      }
      return {
        items: [...state.items, { productId: product.id, quantity: Math.min(quantity, 99), product }],
      };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((item) => item.productId !== productId) };
      }
      return {
        items: state.items.map((item) =>
          item.productId === productId ? { ...item, quantity: Math.min(quantity, 99) } : item
        ),
      };
    }),

  clearCart: () => set({ items: [] }),

  loadItems: (items) => set({ items, loaded: true }),
}));

export const selectTotalItems = (state: CartStore) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectSubtotal = (state: CartStore) =>
  state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
