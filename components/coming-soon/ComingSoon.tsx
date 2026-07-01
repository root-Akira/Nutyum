"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { PRODUCTS as STATIC_PRODUCTS } from "@/data/products";
import type { Product } from "@/types";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function ComingSoonCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.12 }}
      className="group w-full max-w-[260px] cursor-pointer"
    >
      <div
        className="relative mb-4 overflow-hidden rounded-2xl"
        style={{ backgroundColor: product.bgColor, aspectRatio: "3/4" }}
      >
        <div className="absolute left-3 top-3 z-10">
          <span className="inline-block border-2 border-[#173D22] bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#173D22]"
            style={{ fontFamily: "var(--font-body)" }}>
            {product.badgeLabel || "COMING SOON"}
          </span>
        </div>

        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5">
          <Clock size={10} stroke="#4C5A48" aria-hidden="true" />
          <span className="text-[10px] font-semibold text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
            {product.launchDate || "Soon"}
          </span>
        </div>

        <Image
          src={product.images[0] || "/placeholder.png"}
          alt={product.name}
          fill
          sizes="260px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

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

export function ComingSoon() {
  const [comingProducts, setComingProducts] = useState<Product[]>(
    STATIC_PRODUCTS.filter((p) => p.isComingSoon)
  );

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          const filtered = data.filter((p: Product) => p.isComingSoon);
          if (filtered.length) setComingProducts(filtered);
        }
      })
      .catch(() => {});
  }, []);

  if (comingProducts.length === 0) return null;

  return (
    <section className="bg-[#FDFAF3] py-20 sm:py-28" aria-labelledby="coming-soon-title">
      <div className="mb-4 flex justify-center px-6">
        <div className="inline-flex items-center gap-3 rounded-full border-2 border-dashed border-[#E0961A]/40 bg-[rgba(224,150,26,0.06)] px-6 py-2">
          <Clock size={16} className="text-[#E0961A]" />
          <h2
            id="coming-soon-title"
            className="text-lg font-bold uppercase tracking-widest text-[#173D22]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Coming Soon
          </h2>
        </div>
      </div>

      <p className="mb-10 text-center text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
        New flavours on the horizon
      </p>

      <div className="flex justify-center gap-5 px-6 pb-4 flex-wrap" role="list" aria-label="Coming soon products">
        {comingProducts.map((p, i) => (
          <Link key={p.id} href={`/shop/${p.slug}`} role="listitem">
            <ComingSoonCard product={p} index={i} />
          </Link>
        ))}
      </div>
    </section>
  );
}
