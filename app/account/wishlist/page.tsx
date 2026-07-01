"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { useCartStore } from "@/hooks/use-cart-store";
import { useRequireAuth } from "@/lib/use-require-auth";
import type { Product } from "@/types";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type WishlistItem = {
  id: string;
  productId: string;
  product: Product;
  createdAt: string;
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const requireAuth = useRequireAuth();

  useEffect(() => {
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[rgba(23,61,34,0.15)] border-t-[#173D22]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8 text-center"
      >
        <Heart className="mx-auto mb-4 h-12 w-12 text-[#4C5A48]" />
        <h2 className="mb-2 text-xl font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Your wishlist is empty
        </h2>
        <p className="mb-6 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          Save your favourite flavours for later!
        </p>
        <Link
          href="/shop"
          className="inline-flex rounded-full bg-[#173D22] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0e2616]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Browse Products
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
        >
          <ProductCard
            product={item.product}
            index={i}
            onAddToCart={(p) => requireAuth(() => addItem(p))}
          />
        </motion.div>
      ))}
    </div>
  );
}
