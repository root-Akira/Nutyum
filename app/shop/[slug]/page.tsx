"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Star, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCTS as STATIC_PRODUCTS } from "@/data/products";
import type { Product } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/hooks/use-cart-store";
import { useRequireAuth } from "@/lib/use-require-auth";
import { WishlistButton } from "@/components/wishlist/WishlistButton";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function renderStars(rating: number) {
  const full = Math.floor(rating);
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      size={14}
      fill={i < full ? "#E0961A" : "none"}
      stroke={i < full ? "#E0961A" : "#d1d5db"}
      aria-hidden="true"
    />
  ));
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | undefined>(
    STATIC_PRODUCTS.find((p) => p.slug === slug)
  );
  const [related, setRelated] = useState<Product[]>([]);
  const prefersReduced = useReducedMotion();
  const addItem = useCartStore((s) => s.addItem);
  const requireAuth = useRequireAuth();
  const [quantity, setQuantity] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll, related]);

  const scrollBy = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const found = data.find((p: Product) => p.slug === slug);
        if (found) {
          setProduct(found);
          setRelated(data.filter((p: Product) => p.id !== found.id));
        }
      })
      .catch(() => {});
  }, [slug]);

  if (!product) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#FDFAF3] px-6">
        <h1
          className="text-3xl font-medium text-[#173D22]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Product not found
        </h1>
        <p className="text-[#4C5A48]">
          We couldn't find the product you're looking for.
        </p>
        <Link
          href="/shop"
          className="rounded-full bg-[#173D22] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#0e2616]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Back to Shop
        </Link>
      </main>
    );
  }

  const badgeLabel =
    product.badgeLabel ||
    (product.isComingSoon ? "COMING SOON" : product.isNew ? "NEW ARRIVAL" : product.isBestSeller ? "BESTSELLER" : "");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <main className="bg-[#FDFAF3]">
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-12 md:grid-cols-2 md:py-20 lg:px-16 lg:py-28">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{ backgroundColor: product.bgColor, aspectRatio: "4/5" }}
          >
            <Image
              src={product.images[0] || "https://jemypvfnlazkrvrmzcaz.supabase.co/storage/v1/object/public/product-images/placeholder.svg"}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
        </motion.div>

        <motion.div
          variants={prefersReduced ? {} : containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center gap-5"
        >
          {badgeLabel && (
            <motion.div variants={prefersReduced ? {} : itemVariants}>
              <span
                className="inline-block border-2 border-[#173D22] bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#173D22]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {badgeLabel}
              </span>
            </motion.div>
          )}

          <motion.h1
            variants={prefersReduced ? {} : itemVariants}
            className="text-4xl font-medium leading-tight text-[#173D22] md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {product.name}
          </motion.h1>

          <motion.p
            variants={prefersReduced ? {} : itemVariants}
            className="text-2xl font-semibold text-[#173D22]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {formatPrice(product.price)}
          </motion.p>

          <motion.div
            variants={prefersReduced ? {} : itemVariants}
            className="flex items-center gap-1.5"
          >
            <div className="flex items-center gap-0.5">
              {renderStars(product.rating)}
            </div>
            <span
              className="ml-1 text-sm text-[#4C5A48]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </motion.div>

          <motion.p
            variants={prefersReduced ? {} : itemVariants}
            className="text-base leading-relaxed text-[#4C5A48]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {product.description}
          </motion.p>

          {product.vibes?.length > 0 && (
            <motion.div
              variants={prefersReduced ? {} : itemVariants}
              className="flex flex-wrap gap-2"
            >
              {product.vibes.map((vibe) => (
                <span
                  key={vibe}
                  className="rounded-full border border-[#173D22]/30 px-3 py-1 text-xs font-medium text-[#4C5A48]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {vibe}
                </span>
              ))}
            </motion.div>
          )}

          <motion.p
            variants={prefersReduced ? {} : itemVariants}
            className="text-sm font-medium text-[#4C5A48]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Weight: {product.weight}
          </motion.p>

          <motion.div
            variants={prefersReduced ? {} : itemVariants}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            {product.isComingSoon ? (
              <>
                <span className="inline-flex rounded-full bg-[#4C5A48]/80 px-10 py-4 text-sm font-semibold text-white"
                  style={{ fontFamily: "var(--font-body)" }}>
                  Coming Soon
                </span>
                {product.launchDate && (
                  <span className="text-xs text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                    Launching {product.launchDate}
                  </span>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 rounded-full border border-[#173D22]/20 bg-white px-4 py-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[#173D22] transition-colors hover:bg-[#173D22]/10"
                  >
                    <Minus size={14} strokeWidth={2} />
                  </button>
                  <span
                    className="min-w-[1.5rem] text-center text-sm font-semibold text-[#173D22]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    aria-label="Increase quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[#173D22] transition-colors hover:bg-[#173D22]/10"
                  >
                    <Plus size={14} strokeWidth={2} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => requireAuth(() => addItem(product, quantity))}
                  className="rounded-full bg-[#173D22] px-10 py-4 text-sm font-semibold text-white transition-all hover:bg-[#0e2616] hover:shadow-[0_8px_30px_rgba(23,61,34,0.25)]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Add to Cart — {formatPrice(product.price * quantity)}
                </button>
              </>
            )}

            <WishlistButton
              product={product}
              size={22}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(23,61,34,0.2)] bg-white transition-all hover:border-red-300 hover:bg-red-50"
            />
          </motion.div>
        </motion.div>
      </section>

      {related.length > 0 && (
        <section className="pb-20 sm:pb-28" aria-labelledby="related-title">
          <div className="px-6 sm:px-12 md:px-16 lg:px-20">
            <motion.h2
              id="related-title"
              initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-10 text-3xl font-medium text-[#173D22] md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              You May Also Like
            </motion.h2>
            <div className="relative">
              {canScrollLeft && (
                <button
                  type="button"
                  onClick={() => scrollBy("left")}
                  aria-label="Scroll left"
                  className="absolute -left-1 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md text-[#173D22] hover:bg-[#173D22] hover:text-white transition-colors"
                >
                  <ChevronLeft size={18} strokeWidth={2} />
                </button>
              )}
              <div
                ref={scrollRef}
                className="flex gap-5 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none" }}
                role="list"
                aria-label="Related products"
              >
                {related.map((p, i) => (
                  <div key={p.id} role="listitem" className="shrink-0">
                    <ProductCard product={p} index={i} />
                  </div>
                ))}
              </div>
              {canScrollRight && (
                <button
                  type="button"
                  onClick={() => scrollBy("right")}
                  aria-label="Scroll right"
                  className="absolute -right-1 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md text-[#173D22] hover:bg-[#173D22] hover:text-white transition-colors"
                >
                  <ChevronRight size={18} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
