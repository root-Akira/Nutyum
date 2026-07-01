"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import type { Product } from "@/types";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type WishlistItem = {
  id: string;
  productId: string;
  product: Product;
  createdAt: string;
};

function formatPrice(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

import { useCartStore } from "@/hooks/use-cart-store";
import { useRequireAuth } from "@/lib/use-require-auth";

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

  async function handleRemove(productId: string) {
    const res = await fetch("/api/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    }
  }

  function handleAddToCart(product: Product) {
    requireAuth(() => addItem(product, 1));
  }

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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
          className="group relative rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-5"
        >
          <div className="mb-3 flex items-start justify-between">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-xl text-2xl"
              style={{ backgroundColor: item.product.bgColor || "#FAF7EE" }}
            >
              🪷
            </div>
            <button
              onClick={() => handleRemove(item.productId)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-white text-red-500 opacity-0 transition-all hover:border-red-400 hover:bg-red-50 group-hover:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <Link href={`/shop/${item.product.slug}`}>
            <h3 className="mb-1 text-sm font-semibold text-[#173D22] transition-colors hover:text-[#E0961A]" style={{ fontFamily: "var(--font-heading)" }}>
              {item.product.name}
            </h3>
          </Link>
          <p className="mb-3 text-xs text-[#4C5A48]">{item.product.weight}</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-[#173D22]">{formatPrice(item.product.price)}</p>
            <button
              onClick={() => handleAddToCart(item.product)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#173D22] px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#0e2616]"
            >
              <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
