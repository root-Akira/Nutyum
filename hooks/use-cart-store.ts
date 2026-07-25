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
  serverMode: boolean;
  couponCode: string;
  discount: DiscountInfo | null;
  couponError: string;
  couponPending: boolean;
  setCouponCode: (code: string) => void;
  applyCoupon: (subtotal: number) => Promise<void>;
  removeCoupon: () => void;
  addItem: (product: Product, quantity?: number, variant?: { variantId: string; variantName: string }) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  updateQuantity: (key: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadItems: (items: CartItem[]) => void;
  setServerMode: (on: boolean) => void;
  mergeGuestCart: () => Promise<void>;
}

function itemKey(item: { productId: string; variantId?: string }) {
  return `${item.productId}_${item.variantId || ''}`;
}

// Serialized mutation queue — ensures DB writes happen in order
let _mutating: Promise<void> = Promise.resolve();

function queueApiSync(items: CartItem[]): Promise<boolean> {
  const result = _mutating.then(() =>
    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })
  );
  _mutating = result.then(() => {}).catch(() => {});
  return result.then((r) => r.ok).catch(() => false);
}

function saveToLocal(items: CartItem[]) {
  try { localStorage.setItem("nutyum-cart", JSON.stringify(items)); } catch { /* ignore */ }
}

function removeFromLocal() {
  try { localStorage.removeItem("nutyum-cart"); } catch { /* ignore */ }
  try { localStorage.removeItem("nutyum-coupon"); } catch { /* ignore */ }
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  loaded: false,
  serverMode: false,
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

  setServerMode: (on) => set({ serverMode: on }),

  addItem: async (product, quantity = 1, variant) => {
    const state = get();
    const key = `${product.id}_${variant?.variantId || ''}`;
    const existing = state.items.find((item) => itemKey(item) === key);
    let updated: CartItem[];
    if (existing) {
      updated = state.items.map((item) =>
        itemKey(item) === key
          ? { ...item, quantity: Math.min(item.quantity + quantity, 99) }
          : item
      );
    } else {
      updated = [
        ...state.items,
        {
          productId: product.id,
          variantId: variant?.variantId,
          variantName: variant?.variantName,
          quantity: Math.min(quantity, 99),
          product,
        },
      ];
    }
    set({ items: updated });
    saveToLocal(updated);
    if (state.serverMode) {
      const ok = await queueApiSync(updated);
      if (!ok) {
        // Server rejected — refetch authoritative state from DB
        const data = await (await fetch("/api/cart")).json();
        set({ items: data.items || [], loaded: true });
      }
    }
  },

  removeItem: async (key) => {
    const state = get();
    const updated = state.items.filter((item) => itemKey(item) !== key);
    set({ items: updated });
    saveToLocal(updated);
    if (state.serverMode) {
      const ok = await queueApiSync(updated);
      if (!ok) {
        const data = await (await fetch("/api/cart")).json();
        set({ items: data.items || [], loaded: true });
      }
    }
  },

  updateQuantity: async (key, quantity) => {
    const state = get();
    if (quantity <= 0) {
      const updated = state.items.filter((item) => itemKey(item) !== key);
      set({ items: updated });
      saveToLocal(updated);
      if (state.serverMode) {
        const ok = await queueApiSync(updated);
        if (!ok) {
          const data = await (await fetch("/api/cart")).json();
          set({ items: data.items || [], loaded: true });
        }
      }
      return;
    }
    const updated = state.items.map((item) =>
      itemKey(item) === key ? { ...item, quantity: Math.min(quantity, 99) } : item
    );
    set({ items: updated });
    saveToLocal(updated);
    if (state.serverMode) {
      const ok = await queueApiSync(updated);
      if (!ok) {
        const data = await (await fetch("/api/cart")).json();
        set({ items: data.items || [], loaded: true });
      }
    }
  },

  clearCart: async () => {
    set({ items: [], couponCode: '', discount: null, couponError: '' });
    removeFromLocal();
    if (get().serverMode) {
      await queueApiSync([]);
    }
  },

  loadItems: (items) => set({ items, loaded: true }),

  mergeGuestCart: async () => {
    const state = get();
    if (!state.items.length) return;
    await queueApiSync(state.items);
    // After merge, fetch authoritative state from DB
    const data = await (await fetch("/api/cart")).json();
    set({ items: data.items || [], loaded: true, serverMode: true });
  },
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
