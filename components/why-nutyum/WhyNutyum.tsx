"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Flame, ShieldCheck, Sprout } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const BENEFITS = [
  {
    Icon: Leaf,
    title: "Ancient Superfood",
    description:
      "Makhana, revered for centuries — packed with protein and antioxidants in every bite.",
  },
  {
    Icon: Flame,
    title: "Roasted, Not Fried",
    description:
      "Air-roasted to golden perfection. Zero oil. Zero compromise.",
  },
  {
    Icon: ShieldCheck,
    title: "Clean Ingredients",
    description:
      "No preservatives, no artificial flavours. Just pure, honest food.",
  },
  {
    Icon: Sprout,
    title: "Farm to Bag",
    description:
      "Sustainably sourced from family farms across India, always traceable.",
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.12 }}
      className="group flex items-start gap-6 rounded-2xl border border-[rgba(23,61,34,0.06)] bg-[#FFFEFB] p-7 shadow-[0_2px_16px_rgba(23,61,34,0.04)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(23,61,34,0.08)]"
    >
      <div className="relative mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[rgba(224,150,26,0.3)] bg-[rgba(224,150,26,0.06)]">
        <benefit.Icon size={22} strokeWidth={1.5} className="text-[#E0961A]" />
      </div>
      <div className="min-w-0">
        <h3
          className="mb-1.5 text-sm font-semibold text-[#173D22]"
          style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)" }}
        >
          {benefit.title}
        </h3>
        <p
          className="text-sm leading-relaxed text-[#5C665E]"
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
      className="relative overflow-hidden bg-[#FAF7EE] py-20 sm:py-28"
      aria-labelledby="why-nutyum-title"
    >
      {/* Subtle decorative watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.015]">
        <Leaf size={600} strokeWidth={1} className="text-[#173D22]" />
      </div>

      <div className="relative mx-auto max-w-(--spacing-container) px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-16 text-center"
        >
          <h2
            id="why-nutyum-title"
            className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.15] tracking-[-0.02em] text-[#173D22]"
            style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)" }}
          >
            Crafted with Purpose
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-[#E0961A]/60" />
          <p
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#5C665E]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Every handful tells a story — from sustainable farms to thoughtfully
            crafted flavours.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <BenefitCard key={b.title} benefit={b} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
          className="mt-14 flex justify-center"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#173D22] px-8 py-3.5 text-sm font-semibold text-[#173D22] transition-all hover:bg-[#173D22] hover:text-white"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Discover Our Collection
            <span className="text-base leading-none" aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
