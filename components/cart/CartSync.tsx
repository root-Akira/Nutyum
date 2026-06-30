"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/hooks/use-cart-store";

const STORAGE_KEY = "nutyum-cart";

let syncing = false;

export function CartSync() {
  const { data: session, status } = useSession();
  const items = useCartStore((s) => s.items);
  const loadItems = useCartStore((s) => s.loadItems);
  const loaded = useCartStore((s) => s.loaded);
  const lastUserId = useRef<string | null>(null);

  // 1. Load cart from localStorage immediately on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          loadItems(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, [loadItems]);

  // 2. Save cart to localStorage whenever items change
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // quota exceeded
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [items]);

  // 3. Load cart from API when user signs in (overwrites localStorage cache)
  useEffect(() => {
    const uid = session?.user?.id ?? null;
    if (uid && uid !== lastUserId.current) {
      lastUserId.current = uid;
      fetch("/api/cart")
        .then((r) => r.json())
        .then((data) => {
          if (data.items?.length) loadItems(data.items);
          else loadItems([]);
        })
        .catch(() => loadItems([]));
    }
    if (!uid && status === "unauthenticated") {
      lastUserId.current = null;
      localStorage.removeItem(STORAGE_KEY);
      useCartStore.setState({ loaded: false });
    }
  }, [session?.user?.id, status, loadItems]);

  // 4. Sync cart to API when items change (only when signed in)
  useEffect(() => {
    if (!session?.user?.id) return;
    if (!loaded || syncing) return;

    syncing = true;
    const timeout = setTimeout(() => {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })
        .catch((err) => console.error("Cart sync failed:", err))
        .finally(() => { syncing = false; });
    }, 500);

    return () => { clearTimeout(timeout); syncing = false; };
  }, [items, session?.user?.id, loaded]);

  return null;
}
