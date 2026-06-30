"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// ─── Vibe tags (Two Leaves "mood" pill style) ─────────────────────────────────
const VIBES = [
  "A Sweet Treat", "Evening Munch", "High Protein", "Guilt-Free",
  "Crunchy & Light", "Over Popcorn", "Perfect Gift", "Savory Twist",
  "Classic Flavors", "Whole Grain", "Focused & Clear", "Bold Heat",
  "Lightly Salted", "Snack Ritual", "Calm & Cozy", "Zero Guilt",
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Discover() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section
      className="bg-[#FAF7EE] py-20 sm:py-28"
      aria-labelledby="discover-title"
    >
      <div className="mx-auto max-w-4xl px-6 text-center">

        {/* ── "DISCOVER" badge (Two Leaves orange boxed pill) ── */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-8 inline-block will-change-transform"
        >
          <span
            id="discover-title"
            className="inline-block border-2 border-[#173D22] bg-[#E0961A] px-6 py-2 text-xl font-extrabold uppercase tracking-widest text-white"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Discover
          </span>
        </motion.div>

        {/* ── Heading ── */}
        <motion.h2
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="mb-4 text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.1] tracking-[-0.02em] text-[#173D22] will-change-transform"
          style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)" }}
        >
          Let&apos;s find a snack that fits the{" "}
          <em>moment.</em>
        </motion.h2>

        {/* ── Sub ── */}
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.18 }}
          className="mb-10 text-base text-[#4C5A48] will-change-transform"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Tell us what you&apos;re craving and we&apos;ll find your perfect match.
        </motion.p>

        {/* ── Vibe pills ── */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.26 }}
          className="mb-10 will-change-transform"
        >
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#4C5A48]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Or explore by vibe…
          </p>
          <div
            className="flex flex-wrap justify-center gap-2.5"
            role="group"
            aria-label="Explore by vibe"
          >
            {VIBES.map((vibe) => {
              const isSelected = selected === vibe;
              return (
                <button
                  key={vibe}
                  type="button"
                  onClick={() => setSelected(isSelected ? null : vibe)}
                  aria-pressed={isSelected}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 ${
                    isSelected
                      ? "border-[#173D22] bg-[#173D22] text-white"
                      : "border-[rgba(23,61,34,0.2)] bg-white text-[#173D22] hover:border-[#173D22] hover:bg-[rgba(23,61,34,0.05)]"
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {vibe}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.34 }}
          className="will-change-transform"
        >
          <Link
            href={selected ? `/shop?vibe=${encodeURIComponent(selected)}` : "/shop"}
            className="inline-flex items-center rounded-full border-2 border-[#173D22] px-8 py-3.5 text-sm font-semibold text-[#173D22] transition-all hover:bg-[#173D22] hover:text-white"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {selected ? `Shop "${selected}"` : "Find My Snack"}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
