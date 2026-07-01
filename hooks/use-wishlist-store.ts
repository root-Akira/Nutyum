"use client";

import { create } from "zustand";

interface WishlistStore {
  ids: Set<string>;
  loaded: boolean;
  load: (ids: string[]) => void;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()((set, get) => ({
  ids: new Set(),
  loaded: false,

  load: (ids) => set({ ids: new Set(ids), loaded: true }),

  add: (productId) =>
    set((state) => {
      const next = new Set(state.ids);
      next.add(productId);
      return { ids: next };
    }),

  remove: (productId) =>
    set((state) => {
      const next = new Set(state.ids);
      next.delete(productId);
      return { ids: next };
    }),

  has: (productId) => get().ids.has(productId),
}));
