"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Plus, Clock } from "lucide-react";
import { PRODUCTS as STATIC_PRODUCTS } from "@/data/products";
import { useCartStore } from "@/hooks/use-cart-store";
import { useRequireAuth } from "@/lib/use-require-auth";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import type { Product } from "@/types";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Tab = "bestsellers" | "coming-soon";

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
            {product.badgeLabel || (product.isComingSoon ? "COMING SOON" : product.isNew ? "NEW" : product.isBestSeller ? "BESTSELLER" : "")}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5">
          <Star size={10} fill="#E0961A" stroke="none" aria-hidden="true" />
          <span className="text-[10px] font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Wishlist heart */}
        <div className="absolute right-3 top-14 z-10 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm">
            <WishlistButton product={product} size={14} />
          </div>
        </div>

        {/* Product image */}
        <Image
          src={product.images[0] || "https://jemypvfnlazkrvrmzcaz.supabase.co/storage/v1/object/public/product-images/placeholder.svg"}
          alt={product.name}
          fill
          sizes="260px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Add button — appears on hover */}
        <div className="absolute bottom-3 right-3 z-10 opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
          {product.isComingSoon ? (
            <span className="inline-flex rounded-full bg-[#4C5A48]/80 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg backdrop-blur-sm"
              style={{ fontFamily: "var(--font-body)" }}>
              Coming Soon
            </span>
          ) : (
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
          )}
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
  const [tab, setTab] = useState<Tab>("bestsellers");
  const [allProducts, setAllProducts] = useState<Product[]>(STATIC_PRODUCTS);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) setAllProducts(data);
      })
      .catch(() => {});
  }, []);

  const bestSellers = allProducts.filter((p) => p.isBestSeller).slice(0, 3);
  const comingSoon = allProducts.filter((p) => p.isComingSoon);

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

      {/* ── Toggle buttons ── */}
      <div className="mb-10 flex justify-center gap-3 px-6">
        <button
          onClick={() => setTab("bestsellers")}
          className={`border-2 px-6 py-2 text-lg font-bold uppercase tracking-widest transition-all ${
            tab === "bestsellers"
              ? "border-[#E0961A] text-[#173D22] bg-[rgba(224,150,26,0.08)]"
              : "border-transparent text-[#4C5A48]/50 hover:text-[#4C5A48]"
          }`}
          style={{ fontFamily: "var(--font-body)" }}
        >
          Best Sellers
        </button>
        <button
          onClick={() => setTab("coming-soon")}
          className={`border-2 px-6 py-2 text-lg font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
            tab === "coming-soon"
              ? "border-[#E0961A] text-[#173D22] bg-[rgba(224,150,26,0.08)]"
              : "border-transparent text-[#4C5A48]/50 hover:text-[#4C5A48]"
          }`}
          style={{ fontFamily: "var(--font-body)" }}
        >
          <Clock size={18} strokeWidth={2} />
          Coming Soon
        </button>
      </div>

      {/* ── Product grid / Message ── */}
      {tab === "bestsellers" ? (
        <div
          className="flex justify-center gap-5 px-6 pb-4 flex-wrap"
          role="list"
          aria-label="Best selling products"
        >
          {bestSellers.map((p, i) => (
            <div key={p.id} role="listitem">
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      ) : comingSoon.length > 0 ? (
        <div
          className="flex justify-center gap-5 px-6 pb-4 flex-wrap"
          role="list"
          aria-label="Coming soon products"
        >
          {comingSoon.map((p, i) => (
            <div key={p.id} role="listitem">
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 px-6 py-10">
          <Clock size={32} className="text-[#4C5A48]/30" strokeWidth={1.5} />
          <p className="text-center text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
            We are planning to bring something new!
          </p>
        </div>
      )}

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
