"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Plus } from "lucide-react";
import { PRODUCTS as STATIC_PRODUCTS } from "@/data/products";
import { useCartStore } from "@/hooks/use-cart-store";
import { useRequireAuth } from "@/lib/use-require-auth";
import type { Product } from "@/types";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: Product; index: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const requireAuth = useRequireAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.12 }}
      className="group flex-none w-[240px] sm:w-[260px] cursor-pointer will-change-transform"
    >
      {/* Image card */}
      <div
        className="relative mb-4 overflow-hidden rounded-2xl"
        style={{ backgroundColor: product.bgColor, aspectRatio: "3/4" }}
      >
        {/* Category badge */}
        <div className="absolute left-3 top-3 z-10">
          <span
            className="inline-block border-2 border-[#173D22] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#173D22] bg-white"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {product.badgeLabel || (product.isNew ? "NEW" : product.isBestSeller ? "BESTSELLER" : "")}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5">
          <Star size={10} fill="#E0961A" stroke="none" aria-hidden="true" />
          <span className="text-[10px] font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Product image */}
        <Image
          src={product.images[0] || "/placeholder.png"}
          alt={product.name}
          fill
          sizes="260px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Add button — appears on hover */}
        <div className="absolute bottom-3 right-3 z-10 opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
          <button
            type="button"
            onClick={() => requireAuth(() => addItem(product))}
            aria-label={`Add ${product.name} to cart`}
            className="flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#173D22] shadow-lg backdrop-blur-sm"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Plus size={12} strokeWidth={2.5} aria-hidden="true" />
            Add
          </button>
        </div>
      </div>

      {/* Text */}
      <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
        ₹{product.price}
      </p>
      <p className="mb-1.5 text-base font-medium leading-snug text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
        {product.name}
      </p>
      <p className="text-xs leading-relaxed text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
        {product.description}
      </p>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function BestSellers() {
  const [topProducts, setTopProducts] = useState<Product[]>(
    STATIC_PRODUCTS.slice(0, 3)
  );

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) setTopProducts(data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <section className="overflow-hidden bg-[#FDFAF3] py-20 sm:py-28" aria-labelledby="bestsellers-title">

      {/* ── Transition quote ── */}
      <div className="mb-16 px-6 text-center">
        <p
          className="mx-auto max-w-3xl text-[clamp(1.8rem,4vw,3.2rem)] leading-[1.2] tracking-[-0.02em] text-[#173D22]"
          style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)" }}
        >
          A great snack starts with a careful{" "}
          <em className="not-italic">pluck</em> — the top two leaves and a bud.
        </p>
      </div>

      {/* ── "BEST SELLERS" badge label ── */}
      <div className="mb-10 flex justify-center px-6">
        <div className="inline-block">
          <h2
            id="bestsellers-title"
            className="border-2 border-[#E0961A] px-6 py-2 text-lg font-bold uppercase tracking-widest text-[#173D22] bg-[rgba(224,150,26,0.08)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Best Sellers
          </h2>
        </div>
      </div>

      {/* ── Centered product grid ── */}
      <div
        className="flex justify-center gap-5 px-6 pb-4 flex-wrap"
        role="list"
        aria-label="Best selling products"
      >
        {topProducts.map((p, i) => (
          <div key={p.id} role="listitem">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>

      {/* ── CTA button ── */}
      <div className="mt-10 flex justify-center">
        <Link
          href="/shop"
          className="inline-flex items-center rounded-full bg-[#173D22] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#0e2616] hover:shadow-[0_8px_30px_rgba(23,61,34,0.25)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Explore All Snacks
        </Link>
      </div>
    </section>
  );
}
