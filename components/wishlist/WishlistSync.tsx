"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/hooks/use-wishlist-store";

export function WishlistSync() {
  const { data: session } = useSession();
  const loaded = useWishlistStore((s) => s.loaded);
  const load = useWishlistStore((s) => s.load);
  const fetched = useRef(false);

  useEffect(() => {
    if (!session?.user?.id || fetched.current) return;
    fetched.current = true;
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          load(data.map((item: { productId: string }) => item.productId));
        }
      })
      .catch(() => {});
  }, [session?.user?.id, load]);

  // Reset on sign-out
  useEffect(() => {
    if (!session?.user?.id && loaded) {
      fetched.current = false;
      load([]);
    }
  }, [session?.user?.id, loaded, load]);

  return null;
}
