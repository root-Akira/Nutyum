"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/hooks/use-cart-store";

export function CartSync() {
  const { data: session } = useSession();
  const items = useCartStore((s) => s.items);
  const loadItems = useCartStore((s) => s.loadItems);
  const loaded = useCartStore((s) => s.loaded);
  const prevUserId = useRef<string | null>(null);

  // Load cart from API when user signs in
  useEffect(() => {
    if (session?.user?.id && session.user.id !== prevUserId.current) {
      prevUserId.current = session.user.id;
      fetch("/api/cart")
        .then((r) => r.json())
        .then((data) => {
          if (data.items?.length) loadItems(data.items);
          else loadItems([]);
        })
        .catch(() => loadItems([]));
    }
  }, [session?.user?.id, loadItems]);

  // Sync cart to API when items change (only when signed in)
  useEffect(() => {
    if (!session?.user?.id) return;
    if (!loaded) return;

    const timeout = setTimeout(() => {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      }).catch(() => {});
    }, 500);

    return () => clearTimeout(timeout);
  }, [items, session?.user?.id, loaded]);

  return null;
}
