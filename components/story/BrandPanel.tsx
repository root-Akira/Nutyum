"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function BrandPanel() {
  return (
    <section
      className="w-full"
      aria-label="Great snacks in good company"
    >
      {/* Two Leaves: 40% colored panel + 60% product photo */}
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%]">

        {/* ── Left: brand green panel ── */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col justify-center bg-[#173D22] px-10 py-20 sm:px-16 sm:py-24 lg:py-28 will-change-transform"
        >
          <h2
            className="mb-6 text-[clamp(2.2rem,4vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)" }}
          >
            Great Snacks.<br />In Good<br />Company.
          </h2>
          <p
            className="mb-10 max-w-xs text-sm leading-relaxed text-[rgba(255,255,255,0.72)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Discover the people, places, and purpose behind every flavour.
            Makhana that cares as much as you do.
          </p>
          <div>
            <Link
              href="/learn"
              className="inline-flex items-center rounded-full border-2 border-white/50 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/20"
              style={{ fontFamily: "var(--font-body)" }}
            >
              About Us
            </Link>
          </div>
        </motion.div>

        {/* ── Right: product photography ── */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="relative min-h-[380px] lg:min-h-[520px] will-change-transform"
        >
          <Image
            src="https://jemypvfnlazkrvrmzcaz.supabase.co/storage/v1/object/public/product-images/brand-panel.png"
            alt="Nutyum makhana products on vibrant terracotta background"
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
