"use client";

/**
 * useScrollScrub
 *
 * Wires GSAP ScrollTrigger to an element ref so that scrolling through
 * the pinned section maps scroll progress directly to frame index.
 *
 * Design decisions:
 *  - `scrub: true`  → direct 1:1 link (no lag). The 241-frame density
 *    provides the visual interpolation between frames — there's no need
 *    for GSAP's internal tween smoothing on top.
 *  - `pin: true`    → the hero section stays fixed while the animation
 *    plays, then unpins so normal scrolling resumes.
 *  - `onFrame` is stored in a ref to always call the latest version
 *    without re-creating the ScrollTrigger on every render.
 *  - Cleanup kills the ScrollTrigger instance on unmount and on
 *    dependency changes.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface UseScrollScrubOptions {
  /** The element to pin and use as the scroll trigger */
  containerRef: React.RefObject<HTMLElement | null>;
  totalFrames: number;
  /**
   * Total extra scroll distance (px) for the pinned animation.
   * Default: totalFrames × 6  (≈ 1446px for 241 frames — comfortable pace)
   */
  scrollDistance?: number;
  /** Callback fired with the current 0-based frame index on every scroll tick */
  onFrame: (frameIndex: number) => void;
  /** Disables the entire ScrollTrigger (e.g. prefers-reduced-motion) */
  disabled?: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useScrollScrub({
  containerRef,
  totalFrames,
  scrollDistance,
  onFrame,
  disabled = false,
}: UseScrollScrubOptions): void {
  // Keep latest callback in a ref — avoids stale closure without rebuilding ST
  const onFrameRef = useRef(onFrame);
  useEffect(() => { onFrameRef.current = onFrame; });

  useEffect(() => {
    if (disabled || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const distance = scrollDistance ?? totalFrames * 6;
    const maxFrame = totalFrames - 1;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start:   "top top",
      end:     `+=${distance}`,
      pin:     true,
      scrub:   true, // direct 1:1 link — frame density handles smoothness
      onUpdate(self) {
        const frameIndex = Math.round(self.progress * maxFrame);
        onFrameRef.current(frameIndex);
      },
    });

    return () => {
      st.kill();
    };
  }, [containerRef, totalFrames, scrollDistance, disabled]);
}
