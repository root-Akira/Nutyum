"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Plus } from "lucide-react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { WishlistButton } from "@/components/wishlist/WishlistButton";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function ProductCard({
  product,
  index = 0,
  onAddToCart,
}: {
  product: Product;
  index?: number;
  onAddToCart?: (product: Product) => void;
}) {
  const badgeLabel =
    product.badgeLabel ||
    (product.isNew ? "NEW" : product.isBestSeller ? "BESTSELLER" : "");

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.08 }}
      className={cn("group w-full max-w-[260px] cursor-pointer will-change-transform")}
    >
      <div
        className="relative mb-4 overflow-hidden rounded-2xl"
        style={{ backgroundColor: product.bgColor, aspectRatio: "3/4" }}
      >
        {badgeLabel && (
          <div className="absolute left-3 top-3 z-10">
            <span
              className="inline-block border-2 border-[#173D22] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#173D22] bg-white"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {badgeLabel}
            </span>
          </div>
        )}

        <div className="absolute right-3 top-3 z-20 flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5">
          <Star size={10} fill="#E0961A" stroke="none" aria-hidden="true" />
          <span
            className="text-[10px] font-semibold text-[#173D22]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        <div className="absolute right-3 top-14 z-20 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm">
            <WishlistButton product={product} size={14} />
          </div>
        </div>

        <Image
          src={product.images[0] || "/placeholder.png"}
          alt={product.name}
          fill
          sizes="260px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute bottom-3 right-3 z-10 opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => onAddToCart?.(product)}
            className="flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#173D22] shadow-lg backdrop-blur-sm"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Plus size={12} strokeWidth={2.5} aria-hidden="true" />
            Add
          </button>
        </div>
      </div>

      <p
        className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-[#4C5A48]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        ₹{product.price}
      </p>
      <p
        className="mb-1.5 text-base font-medium leading-snug text-[#173D22]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {product.name}
      </p>
      <p
        className="text-xs leading-relaxed text-[#4C5A48]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {product.description}
      </p>
    </motion.div>
  );
}
