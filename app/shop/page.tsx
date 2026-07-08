"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Search, Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { VIBE_TAGS, type Product } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";
import { useCartStore } from "@/hooks/use-cart-store";
import { useRequireAuth } from "@/lib/use-require-auth";
import { getVibes } from "@/lib/get-vibes";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function ShopContent() {
  const prefersReduced = useReducedMotion();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [activeVibe, setActiveVibe] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [allVibes, setAllVibes] = useState<string[]>([...VIBE_TAGS]);
  const addItem = useCartStore((s) => s.addItem);
  const requireAuth = useRequireAuth();
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) setProducts(data);
      })
      .catch(() => {})
      .finally(() => setProductsLoading(false));
  }, []);

  useEffect(() => {
    getVibes().then(setAllVibes).catch(() => {});
  }, []);

  useEffect(() => {
    const vibe = searchParams.get("vibe");
    if (vibe && allVibes.includes(vibe)) {
      setActiveVibe(vibe);
    }
  }, [searchParams, allVibes]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesVibe = !activeVibe || p.vibes.includes(activeVibe as never);
      return matchesSearch && matchesVibe;
    });
  }, [search, activeVibe, products]);

  return (
    <main className="min-h-screen bg-[#FAF7EE]">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-8 sm:pt-12">
        <motion.h1
          initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-3 text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] tracking-[-0.02em] text-[#173D22]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Our Snacks
        </motion.h1>

        <motion.p
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="mb-8 text-base text-[#4C5A48]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Premium makhana roasted to perfection
        </motion.p>

        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="relative mb-8 max-w-md"
        >
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4C5A48]"
            size={18}
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search snacks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-[rgba(23,61,34,0.2)] bg-white py-2.5 pl-10 pr-4 text-sm text-[#173D22] placeholder:text-[#4C5A48]/60 focus:border-[#173D22] focus:outline-none"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </motion.div>

        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="mb-4 flex flex-wrap gap-2.5"
          role="group"
          aria-label="Filter by vibe"
        >
          <button
            type="button"
            onClick={() => setActiveVibe(null)}
            aria-pressed={activeVibe === null}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200",
              activeVibe === null
                ? "border-[#E0961A] bg-[#E0961A] text-white"
                : "border-[rgba(23,61,34,0.2)] bg-white text-[#173D22] hover:border-[#173D22] hover:bg-[rgba(23,61,34,0.05)]",
            )}
            style={{ fontFamily: "var(--font-body)" }}
          >
            All
          </button>
          {allVibes.map((vibe) => {
            const isSelected = activeVibe === vibe;
            return (
              <button
                key={vibe}
                type="button"
                onClick={() => setActiveVibe(isSelected ? null : vibe)}
                aria-pressed={isSelected}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200",
                  isSelected
                    ? "border-[#E0961A] bg-[#E0961A] text-white"
                    : "border-[rgba(23,61,34,0.2)] bg-white text-[#173D22] hover:border-[#173D22] hover:bg-[rgba(23,61,34,0.05)]",
                )}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {vibe}
              </button>
            );
          })}
        </motion.div>

        <motion.p
          initial={prefersReduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.25 }}
          className="mb-8 text-xs text-[#4C5A48]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </motion.p>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24">
        {productsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={28} className="animate-spin text-[#173D22]" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
            {filtered.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onAddToCart={(p) => requireAuth(() => addItem(p))}
              />
            ))}
          </div>
        ) : (
          <motion.p
            initial={prefersReduced ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center text-[#4C5A48]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            No products found. Try a different search or vibe.
          </motion.p>
        )}
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
