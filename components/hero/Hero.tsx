"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Leaf, Star, ShieldCheck } from "lucide-react";

import { HeroBackground } from "./HeroBackground";
import { HeroOrb } from "./HeroOrb";
import { FrameSequenceCanvas } from "./FrameSequenceCanvas";

/**
 * Frame URL factory — edit this to match your actual file naming convention.
 * Frames should be placed in /public/frames/
 * Expected filenames: frame_0001.png → frame_0241.png
 */
const TOTAL_FRAMES = 241;
const getFrameUrl = (index: number) =>
  `/frames/frame_${String(index + 1).padStart(4, "0")}.png`;

// ─── Animation config ─────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Each stagger child fades up from a 24px offset
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: EASE, delay },
});

const TRUST_ITEMS = [
  { Icon: Leaf, label: "100% Natural" },
  { Icon: Star, label: "4.9 ★ Rating" },
  { Icon: ShieldCheck, label: "Free Shipping" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function Hero() {
  const prefersReduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={heroRef}
      aria-label="Hero — Premium Makhana Snacks"
      className="relative flex min-h-svh w-full items-center overflow-hidden bg-[#FAF7EE]"
    >
      {/* ── Atmospheric background layer ── */}
      <HeroBackground />

      {/* ── Main grid ── */}
      <div className="container-custom relative z-10 grid w-full grid-cols-1 gap-12 py-32 lg:grid-cols-[42%_58%] lg:gap-0 lg:py-24">

        {/* ─────────────────────────── Left column ─────────────────────────── */}
        <div className="flex flex-col justify-center gap-8 lg:pr-16 xl:pr-20">

          {/* Badge */}
          <motion.div
            {...(!prefersReduced ? fadeUp(0.1) : {})}
            className="w-fit"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(23,61,34,0.15)] bg-[rgba(23,61,34,0.05)] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#173D22]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#E0961A] animate-pulse" aria-hidden="true" />
              New Collection
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            {...(!prefersReduced ? fadeUp(0.22) : {})}
            className="space-y-2"
          >
            <h1
              className="text-[clamp(3rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.03em] text-[#173D22]"
              style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)" }}
            >
              <span className="block">Snack</span>
              <span className="block italic text-[#E0961A]">Boldly,</span>
              <span className="block">Live Well.</span>
            </h1>
          </motion.div>

          {/* Body copy */}
          <motion.p
            {...(!prefersReduced ? fadeUp(0.34) : {})}
            className="max-w-sm text-base leading-relaxed text-[#4C5A48]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Premium makhana — ancient superfood, modern obsession. Every batch is roasted
            to perfection with flavours that transform healthy snacking into a luxury ritual.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...(!prefersReduced ? fadeUp(0.46) : {})}
            className="flex flex-col gap-3 sm:flex-row"
          >
            {/* Primary */}
            <Link
              href="/shop"
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#173D22] px-8 py-4 sm:w-auto"
              aria-label="Shop all Nutyum products"
            >
              {/* Hover shine sweep */}
              <span
                className="pointer-events-none absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 ease-out group-hover:translate-x-full"
                aria-hidden="true"
              />
              <motion.span
                whileHover={prefersReduced ? {} : { x: -2 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 text-sm font-semibold tracking-wide text-[#FAF7EE]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Shop the Range
              </motion.span>
              <motion.span
                whileHover={prefersReduced ? {} : { x: 3 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
                aria-hidden="true"
              >
                <ArrowRight size={16} className="text-[#FAF7EE]" strokeWidth={2} />
              </motion.span>
            </Link>

            {/* Secondary */}
            <Link
              href="/our-story"
              className="inline-flex w-full items-center justify-center rounded-full border border-[rgba(23,61,34,0.25)] px-8 py-4 text-sm font-medium text-[#173D22] transition-colors duration-300 hover:border-[#173D22] hover:bg-[rgba(23,61,34,0.04)] sm:w-auto"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Our Story
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            {...(!prefersReduced ? fadeUp(0.58) : {})}
            className="flex flex-wrap items-center gap-5 pt-2"
            aria-label="Trust indicators"
          >
            {TRUST_ITEMS.map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon
                  size={14}
                  className="text-[#E0961A] shrink-0"
                  aria-hidden="true"
                  strokeWidth={2}
                />
                <span
                  className="text-xs font-medium text-[#4C5A48]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ─────────────────────────── Right column ─────────────────────────── */}
        <div className="relative flex items-center justify-center">
          {/* Decorative ambient orbs behind the product */}
          <HeroOrb
            size={480}
            color="rgba(224,150,26,0.12)"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            delay={0}
          />
          <HeroOrb
            size={320}
            color="rgba(23,61,34,0.06)"
            className="absolute top-1/4 right-8"
            delay={2}
          />

          {/* ── Frame sequence card ── */}
          <motion.div
            {...(!prefersReduced ? {
              initial: { opacity: 0, scale: 0.92, y: 32 },
              animate: { opacity: 1, scale: 1, y: 0 },
              transition: { duration: 1, ease: EASE, delay: 0.2 },
            } : {})}
            className="relative w-full max-w-[600px] rounded-[32px] overflow-hidden"
            style={{ aspectRatio: "4/5" }}
          >
            {/* Soft inner glow border (sits above the canvas) */}
            <div
              className="absolute inset-0 z-10 rounded-[32px] pointer-events-none"
              style={{
                boxShadow: "inset 0 0 0 1px rgba(23,61,34,0.08), 0 40px 100px rgba(23,61,34,0.18)",
              }}
              aria-hidden="true"
            />

            {/* Floating pill label */}
            <motion.div
              {...(!prefersReduced ? {
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.7, ease: EASE, delay: 0.9 },
              } : {})}
              className="absolute bottom-6 left-6 z-20 flex items-center gap-3 rounded-full bg-[rgba(252,251,244,0.92)] px-4 py-2.5 backdrop-blur-md"
              style={{ boxShadow: "0 8px 32px rgba(23,61,34,0.12)" }}
            >
              <div className="flex flex-col">
                <span
                  className="text-[11px] font-semibold uppercase tracking-widest text-[#173D22]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Himalayan Sea Salt
                </span>
                <span
                  className="text-[11px] text-[#4C5A48]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Premium Makhana · 100g
                </span>
              </div>
              <div className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#173D22]">
                <ArrowRight size={13} className="text-[#FAF7EE]" strokeWidth={2.5} />
              </div>
            </motion.div>

            {/*
              FrameSequenceCanvas:
              - Fills the card container (h-full w-full)
              - heroRef is the GSAP pin target (the outer <section>)
              - getFrameUrl/TOTAL_FRAMES configured at the top of this file
            */}
            <FrameSequenceCanvas
              totalFrames={TOTAL_FRAMES}
              getFrameUrl={getFrameUrl}
              containerRef={heroRef}
              className="absolute inset-0"
            />
          </motion.div>
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <motion.div
        {...(!prefersReduced ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 1.4, duration: 0.6 },
        } : {})}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span
          className="text-[10px] uppercase tracking-widest text-[#4C5A48]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Scroll
        </span>
        <motion.div
          animate={prefersReduced ? {} : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="h-8 w-px bg-gradient-to-b from-[#173D22]/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
