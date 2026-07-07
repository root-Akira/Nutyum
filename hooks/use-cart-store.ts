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
  variantId?: string;
  variantName?: string;
  quantity: number;
  product: Product;
}

interface DiscountInfo {
  code: string;
  type: 'flat' | 'percentage';
  value: number;
  discountAmount: number;
}

interface CartStore {
  items: CartItem[];
  loaded: boolean;
  couponCode: string;
  discount: DiscountInfo | null;
  couponError: string;
  couponPending: boolean;
  setCouponCode: (code: string) => void;
  applyCoupon: (subtotal: number) => Promise<void>;
  removeCoupon: () => void;
  addItem: (product: Product, quantity?: number, variant?: { variantId: string; variantName: string }) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  loadItems: (items: CartItem[]) => void;
}

function itemKey(item: { productId: string; variantId?: string }) {
  return `${item.productId}_${item.variantId || ''}`;
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  loaded: false,
  couponCode: '',
  discount: null,
  couponError: '',
  couponPending: false,

  setCouponCode: (code) => set({ couponCode: code, couponError: '' }),

  applyCoupon: async (subtotal) => {
    set({ couponPending: true, couponError: '' });
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: get().couponCode, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        set({ couponError: data.error || 'Invalid coupon', discount: null, couponPending: false });
        return;
      }
      set({
        discount: {
          code: data.code,
          type: data.type,
          value: data.value,
          discountAmount: data.discountAmount,
        },
        couponError: '',
        couponPending: false,
      });
    } catch {
      set({ couponError: 'Failed to validate coupon', discount: null, couponPending: false });
    }
  },

  removeCoupon: () => set({ couponCode: '', discount: null, couponError: '' }),

  addItem: (product, quantity = 1, variant) =>
    set((state) => {
      const key = `${product.id}_${variant?.variantId || ''}`;
      const existing = state.items.find((item) => itemKey(item) === key);
      if (existing) {
        return {
          items: state.items.map((item) =>
            itemKey(item) === key
              ? { ...item, quantity: Math.min(item.quantity + quantity, 99) }
              : item
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            productId: product.id,
            variantId: variant?.variantId,
            variantName: variant?.variantName,
            quantity: Math.min(quantity, 99),
            product,
          },
        ],
      };
    }),

  removeItem: (key) =>
    set((state) => ({
      items: state.items.filter((item) => itemKey(item) !== key),
    })),

  updateQuantity: (key, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((item) => itemKey(item) !== key) };
      }
      return {
        items: state.items.map((item) =>
          itemKey(item) === key ? { ...item, quantity: Math.min(quantity, 99) } : item
        ),
      };
    }),

  clearCart: () => set({ items: [], couponCode: '', discount: null, couponError: '' }),

  loadItems: (items) => set({ items, loaded: true }),
}));

export function getCartItemKey(item: { productId: string; variantId?: string }) {
  return `${item.productId}_${item.variantId || ''}`;
}

export const selectTotalItems = (state: CartStore) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectSubtotal = (state: CartStore) =>
  state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

export const selectDiscount = (state: CartStore) => state.discount;

export const selectTotal = (state: CartStore) => {
  const subtotal = selectSubtotal(state);
  const discount = state.discount;
  return discount ? Math.max(0, subtotal - discount.discountAmount) : subtotal;
};
