"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/hooks/use-wishlist-store";

const STORAGE_KEY = "nutyum-wishlist";

export function WishlistSync() {
  const { data: session, status } = useSession();
  const loaded = useWishlistStore((s) => s.loaded);
  const ids = useWishlistStore((s) => s.ids);
  const load = useWishlistStore((s) => s.load);
  const hasFetchedApi = useRef(false);

  // 1. Load wishlist from localStorage immediately on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          load(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, [load]);

  // 2. Save wishlist to localStorage whenever ids change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
    } catch {
      // quota exceeded
    }
  }, [ids]);

  // 3. Fetch from API when signed in
  useEffect(() => {
    if (!session?.user?.id || hasFetchedApi.current) return;
    hasFetchedApi.current = true;
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          load(data.map((item: { productId: string }) => item.productId));
        }
      })
      .catch(() => {});
  }, [session?.user?.id, load]);

  // 4. Reset on sign-out
  useEffect(() => {
    if (!session?.user?.id && status === "unauthenticated") {
      hasFetchedApi.current = false;
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      load([]);
    }
  }, [session?.user?.id, status, load]);

  return null;
}
