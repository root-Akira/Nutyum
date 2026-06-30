"use client";

/**
 * useNavScroll
 *
 * Derives all scroll-driven navbar MotionValues using Framer Motion's
 * useTransform pipeline. This approach:
 *
 *  - Triggers ZERO React re-renders on scroll
 *  - Runs entirely inside Framer Motion's internal RAF scheduler at 60fps
 *  - Provides smooth continuous interpolation (not a binary boolean toggle)
 *  - Respects prefers-reduced-motion via useReducedMotion()
 *
 * All returned values are MotionValue instances — pass them directly to
 * a motion element's `style` prop. Do NOT read .get() inside render.
 */

import {
  useScroll,
  useTransform,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

// ─── Scroll input range ───────────────────────────────────────────────────────
// Interpolation begins at 0px and completes by 40px of scroll.
const INPUT: [number, number] = [0, 40];

// ─── Output ranges ────────────────────────────────────────────────────────────
const HEIGHTS: [number, number] = [88, 68];
const BG_COLORS: [string, string] = [
  "rgba(252,251,244,0.72)",
  "rgba(250,247,238,0.94)",
];
const SHADOWS: [string, string] = [
  "0 10px 40px rgba(23,61,34,0.07), 0 1px 0 rgba(23,61,34,0.04)",
  "0 20px 60px rgba(23,61,34,0.13), 0 1px 0 rgba(23,61,34,0.08)",
];
const BORDER_COLORS: [string, string] = [
  "rgba(23,61,34,0.06)",
  "rgba(23,61,34,0.11)",
];
const LOGO_SCALES: [number, number] = [1, 0.82];
const BLUR_VALUES: [string, string] = [
  "blur(20px) saturate(160%)",
  "blur(28px) saturate(200%)",
];

// ─── Exported shape ───────────────────────────────────────────────────────────
export interface NavScrollValues {
  /** Pill height in px */
  height: MotionValue<number>;
  /** Glassmorphism background rgba */
  backgroundColor: MotionValue<string>;
  /** Multi-layer box shadow */
  boxShadow: MotionValue<string>;
  /** Border colour rgba */
  borderColor: MotionValue<string>;
  /** Logo scale factor (1 → 0.82) */
  logoScale: MotionValue<number>;
  /** CSS backdrop-filter string */
  backdropFilter: MotionValue<string>;
  /** Whether prefers-reduced-motion is active */
  prefersReducedMotion: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useNavScroll(): NavScrollValues {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { scrollY } = useScroll();

  // ── Smooth interpolated values (default) ────────────────────────────────
  const heightSmooth = useTransform(scrollY, INPUT, HEIGHTS);
  const bgSmooth = useTransform(scrollY, INPUT, BG_COLORS);
  const shadowSmooth = useTransform(scrollY, INPUT, SHADOWS);
  const borderSmooth = useTransform(scrollY, INPUT, BORDER_COLORS);
  const logoScaleSmooth = useTransform(scrollY, INPUT, LOGO_SCALES);
  const blurSmooth = useTransform(scrollY, INPUT, BLUR_VALUES);

  // ── Static fallback values (reduced-motion users) ───────────────────────
  // Static MotionValues never animate — they expose a stable .get() value
  // so components receiving them don't need to branch on prefersReducedMotion.
  const heightStatic = useMotionValue(68);
  const bgStatic = useMotionValue(BG_COLORS[1]);
  const shadowStatic = useMotionValue(SHADOWS[1]);
  const borderStatic = useMotionValue(BORDER_COLORS[1]);
  const logoScaleStatic = useMotionValue(1); // no scale change for reduced motion
  const blurStatic = useMotionValue(BLUR_VALUES[1]);

  return {
    height: prefersReducedMotion ? heightStatic : heightSmooth,
    backgroundColor: prefersReducedMotion ? bgStatic : bgSmooth,
    boxShadow: prefersReducedMotion ? shadowStatic : shadowSmooth,
    borderColor: prefersReducedMotion ? borderStatic : borderSmooth,
    logoScale: prefersReducedMotion ? logoScaleStatic : logoScaleSmooth,
    backdropFilter: prefersReducedMotion ? blurStatic : blurSmooth,
    prefersReducedMotion,
  };
}
