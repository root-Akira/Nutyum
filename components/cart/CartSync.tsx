"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/hooks/use-cart-store";

let syncing = false;

export function CartSync() {
  const { data: session, status } = useSession();
  const items = useCartStore((s) => s.items);
  const loadItems = useCartStore((s) => s.loadItems);
  const loaded = useCartStore((s) => s.loaded);
  const lastUserId = useRef<string | null>(null);

  // Load cart from API when user signs in (detect user ID change)
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
      useCartStore.setState({ loaded: false });
    }
  }, [session?.user?.id, status, loadItems]);

  // Sync cart to API when items change (only when signed in)
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
        .catch(() => {})
        .finally(() => { syncing = false; });
    }, 500);

    return () => { clearTimeout(timeout); syncing = false; };
  }, [items, session?.user?.id, loaded]);

  return null;
}
