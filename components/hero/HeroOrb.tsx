"use client";

import { motion, useReducedMotion } from "framer-motion";

interface HeroOrbProps {
  /** Diameter in pixels */
  size: number;
  /** Any CSS colour value */
  color: string;
  className?: string;
  /** Float animation phase offset in seconds */
  delay?: number;
}

/**
 * HeroOrb
 *
 * A softly floating decorative circle used in the hero right column.
 * Uses a slow, looping translateY animation to add life to the background
 * without distracting from the product. Respects prefers-reduced-motion.
 */
export function HeroOrb({ size, color, className = "", delay = 0 }: HeroOrbProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className={`pointer-events-none rounded-full ${className}`}
      style={{ width: size, height: size, background: color }}
      aria-hidden="true"
      animate={
        prefersReduced
          ? {}
          : { y: [0, -18, 0], scale: [1, 1.02, 1] }
      }
      transition={{
        repeat: Infinity,
        duration: 7,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}
