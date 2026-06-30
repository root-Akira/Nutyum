"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PILLARS = [
  {
    icon: "🌿",
    title: "Quality, Without\nPretense",
    desc: "Whole lotus seeds. Nothing fake.",
  },
  {
    icon: "🌍",
    title: "Care for People\n& Planet",
    desc: "Sourced from sustainable farms.",
  },
  {
    icon: "🏔️",
    title: "Transparent\nSourcing",
    desc: "From Indian wetlands to your snack bowl.",
  },
];

export function OurOrigins() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh" }}
      aria-labelledby="origins-title"
    >
      {/* ── Full-bleed background image ── */}
      <Image
        src="/origins-bg.png"
        alt="Aerial view of Indian lotus fields at dawn"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" aria-hidden="true" />

      {/* ── Spinning badge (top-right, Two Leaves style) ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        className="absolute right-6 top-6 z-10 sm:right-10 sm:top-10 will-change-transform"
        aria-hidden="true"
      >
        <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full border-2 border-[#A8D44B] bg-[#A8D44B]">
          <div className="text-center">
            <p className="text-[7px] sm:text-[8px] font-bold uppercase leading-none tracking-[0.15em] text-[#173D22]">FROM FARM</p>
            <p className="text-[18px] sm:text-[22px]">🪷</p>
            <p className="text-[7px] sm:text-[8px] font-bold uppercase leading-none tracking-[0.15em] text-[#173D22]">TO BOWL</p>
          </div>
        </div>
      </motion.div>

      {/* ── Content ── */}
      <div className="relative z-10 flex min-h-[inherit] flex-col items-center justify-between px-6 py-20 sm:py-28">

        {/* "OUR ORIGINS" label */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-auto will-change-transform"
        >
          <span
            id="origins-title"
            className="inline-block border-2 border-white/70 bg-white/20 px-5 py-1.5 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-sm"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Our Origins
          </span>
        </motion.div>

        {/* Main heading — large condensed (Two Leaves BORN IN COLORADO style) */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className="my-8 text-center will-change-transform"
        >
          <h2
            className="font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-white"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(4rem, 14vw, 12rem)",
            }}
          >
            Born in<br />Nature
          </h2>
        </motion.div>

        {/* 3 pillars */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          className="grid w-full max-w-2xl grid-cols-3 gap-6 text-center will-change-transform"
        >
          {PILLARS.map((p) => (
            <div key={p.title} className="flex flex-col items-center gap-3">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#A8D44B] text-2xl sm:text-3xl">
                {p.icon}
              </div>
              <p
                className="whitespace-pre-line text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {p.title}
              </p>
            </div>
          ))}
        </motion.div>

        {/* "Our Story" CTA */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.42 }}
          className="mt-10 will-change-transform"
        >
          <Link
            href="/our-story"
            className="inline-flex items-center rounded-full border-2 border-white bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-[#173D22]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Our Story
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
