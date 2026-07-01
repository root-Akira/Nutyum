"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const BENEFITS = [
  {
    icon: "🪷",
    title: "Ancient Superfood",
    description:
      "Makhana has been enjoyed in India for centuries, packed with protein and antioxidants",
    bg: "#d6e8c0",
  },
  {
    icon: "🔥",
    title: "Roasted, Not Fried",
    description:
      "We air-roast each seed to perfection — zero oil, zero guilt",
    bg: "#fad9c8",
  },
  {
    icon: "🌿",
    title: "Clean Ingredients",
    description:
      "No preservatives, no artificial flavours, no compromise",
    bg: "#c8e4f0",
  },
  {
    icon: "🏭",
    title: "Farm to Bag",
    description:
      "Traceable sourcing from sustainable farms in India",
    bg: "#f5e6c8",
  },
];

function BenefitCard({
  benefit,
  index,
}: {
  benefit: (typeof BENEFITS)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.1 }}
      className="flex items-start gap-5 rounded-[var(--radius-card)] p-6 sm:p-8 will-change-transform"
      style={{ backgroundColor: benefit.bg }}
    >
      <span
        className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/70 text-2xl shadow-sm"
        aria-hidden="true"
      >
        {benefit.icon}
      </span>
      <div>
        <h3
          className="mb-1.5 text-xs font-bold uppercase tracking-wider text-[#173D22]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {benefit.title}
        </h3>
        <p
          className="text-sm leading-relaxed text-[#4C5A48]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {benefit.description}
        </p>
      </div>
    </motion.div>
  );
}

export function WhyNutyum() {
  return (
    <section
      className="bg-[#FAF7EE] py-20 sm:py-28 pb-16 sm:pb-20"
      aria-labelledby="why-nutyum-title"
    >
      <div className="mx-auto max-w-(--spacing-container) px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-6 flex justify-center will-change-transform"
        >
          <h2
            id="why-nutyum-title"
            className="inline-block border-2 border-[#E0961A] bg-[#E0961A] px-6 py-2 text-lg font-bold uppercase tracking-widest text-white"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Why Nutyum
          </h2>
        </motion.div>

        {/* Heading */}
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="mx-auto mb-16 max-w-3xl text-center text-[clamp(1.8rem,4vw,3.2rem)] leading-[1.2] tracking-[-0.02em] text-[#173D22] will-change-transform"
          style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)" }}
        >
          Better Ingredients. Better Snacking.
        </motion.p>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <BenefitCard key={b.title} benefit={b} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
          className="mt-12 flex justify-center will-change-transform"
        >
          <Link
            href="/shop"
            className="inline-flex items-center rounded-full bg-[#173D22] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#0e2616] hover:shadow-[0_8px_30px_rgba(23,61,34,0.25)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Explore Our Range
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
