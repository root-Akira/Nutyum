"use client";

import { useCallback, useState } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useWishlistStore } from "@/hooks/use-wishlist-store";
import type { Product } from "@/types";

export function WishlistButton({
  product,
  className = "",
  size = 16,
}: {
  product: Product;
  className?: string;
  size?: number;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const has = useWishlistStore((s) => s.has(product.id));
  const add = useWishlistStore((s) => s.add);
  const remove = useWishlistStore((s) => s.remove);
  const [saving, setSaving] = useState(false);

  const handleToggle = useCallback(async () => {
    if (!session) {
      router.push(`/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setSaving(true);
    try {
      if (has) {
        const res = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
        if (res.ok) remove(product.id);
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id, product }),
        });
        if (res.ok) add(product.id);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }, [session, router, has, product, add, remove]);

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={saving}
      aria-label={has ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex items-center justify-center transition-all ${className}`}
    >
      <Heart
        size={size}
        strokeWidth={has ? 2.5 : 2}
        className={`transition-all ${has ? "fill-red-500 stroke-red-500" : "stroke-[#4C5A48] hover:stroke-red-400"}`}
      />
    </button>
  );
}
