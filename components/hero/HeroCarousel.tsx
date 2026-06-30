"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";

// ─── Slide data ───────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: "sea-salt",
    bgColor: "#d6e8c0",           // soft sage green
    heading: "Meet Your\nMakhana",
    body: "Whether your mornings are more grab-and-go or\nintentional and slow, we have makhana for every ritual.",
    cta: { label: "Shop Now", href: "/shop" },
    image: "/hero-slide1.png",
    imageAlt: "Himalayan sea salt makhana with scattered lotus seeds on sage green background",
    pillLabel: "Himalayan Sea Salt",
    pillSub: "Premium Makhana · 70g",
  },
  {
    id: "peri-peri",
    bgColor: "#fde8cc",           // warm cream-peach
    heading: "Bold Flavour,\nZero Guilt.",
    body: "Roasted to perfection, each lotus seed puffs up into a\nlightweight, crunchy cloud of bold flavour.",
    cta: { label: "Explore Flavours", href: "/shop" },
    image: "/hero-product.png",
    imageAlt: "Premium makhana bowl on cream background",
    pillLabel: "Peri Peri Makhana",
    pillSub: "New Arrival · 70g",
  },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Hero Carousel ────────────────────────────────────────────────────────────
export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setActive((p) => (p + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setActive((p) => (p - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const slide = SLIDES[active];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "calc(100svh - 92px)" }}
      aria-label="Hero product showcase"
      aria-roledescription="carousel"
    >
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: EASE }}
          className="absolute inset-0"
          style={{ backgroundColor: slide.bgColor }}
          aria-roledescription="slide"
          aria-label={`Slide ${active + 1} of ${SLIDES.length}: ${slide.heading}`}
        >
          {/* Full-bleed product image */}
          <Image
            src={slide.image}
            alt={slide.imageAlt}
            fill
            priority={active === 0}
            sizes="100vw"
            className="object-cover"
          />

          {/* Overlay: bottom-left text block */}
          <div className="absolute inset-0 flex flex-col justify-end px-8 pb-14 sm:px-12 sm:pb-16 md:px-16 lg:px-20">
            <div className="max-w-md">
              <motion.h1
                key={`heading-${slide.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                className="mb-4 whitespace-pre-line text-[clamp(2.6rem,5.5vw,5rem)] font-medium leading-[1.0] tracking-[-0.03em] text-[#173D22]"
                style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)" }}
              >
                {slide.heading}
              </motion.h1>

              <motion.p
                key={`body-${slide.id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
                className="mb-6 whitespace-pre-line text-sm leading-relaxed text-[#2d4433]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {slide.body}
              </motion.p>

              <motion.div
                key={`cta-${slide.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
              >
                <Link
                  href={slide.cta.href}
                  className="inline-flex items-center rounded-full bg-[#173D22] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#0e2616] hover:shadow-[0_8px_30px_rgba(23,61,34,0.3)]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {slide.cta.label}
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Floating pill */}
          <motion.div
            key={`pill-${slide.id}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
            className="absolute bottom-14 right-8 sm:right-12 md:right-16 lg:right-20 hidden sm:flex items-center gap-3 rounded-full bg-white/90 px-4 py-2.5 backdrop-blur-md"
            style={{ boxShadow: "0 4px 24px rgba(23,61,34,0.12)" }}
            aria-hidden="true"
          >
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
                {slide.pillLabel}
              </span>
              <span className="text-[11px] text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                {slide.pillSub}
              </span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173D22]">
              <ArrowRight size={13} className="text-white" strokeWidth={2.5} />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[rgba(23,61,34,0.2)] bg-white/70 text-[#173D22] backdrop-blur-sm transition-all hover:bg-white hover:border-[#173D22]"
      >
        <ChevronRight size={20} strokeWidth={2} aria-hidden="true" />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2" role="tablist" aria-label="Slide indicators">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-8 bg-[#173D22]" : "w-3 bg-[rgba(23,61,34,0.3)]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
