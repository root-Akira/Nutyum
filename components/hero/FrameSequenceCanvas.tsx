"use client";

/**
 * FrameSequenceCanvas
 *
 * Renders a scroll-scrubbed PNG frame sequence onto an HTML canvas.
 *
 * Architecture:
 *  - useFrameLoader  → progressive frame loading (three-phase)
 *  - useScrollScrub  → GSAP ScrollTrigger maps scroll → frame index
 *  - ResizeObserver  → keeps canvas attributes in sync with CSS layout
 *  - RAF render loop → only repaints when the frame index changes (dirty flag)
 *
 * Performance guarantees:
 *  - Zero React re-renders triggered by scroll or frame changes.
 *    All scroll/frame state lives in mutable refs.
 *  - Only `isReady` and `loadedCount` cause React renders (loading UI).
 *  - Canvas is composited on its own GPU layer via `will-change: transform`.
 *  - DPR-aware: draws at physical pixel resolution on Retina displays.
 *  - Cover-fit: draws each frame with the same object-fit: cover semantics
 *    as a CSS background-image, regardless of aspect ratio mismatches.
 */

import { useRef, useEffect, useCallback, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useFrameLoader } from "@/hooks/useFrameLoader";
import { useScrollScrub } from "@/hooks/useScrollScrub";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface FrameSequenceCanvasProps {
  /** Total number of frames in the sequence */
  totalFrames: number;
  /**
   * Function that returns the URL for a given 0-based frame index.
   * Example: (i) => `/frames/frame_${String(i + 1).padStart(4, "0")}.png`
   */
  getFrameUrl: (index: number) => string;
  /**
   * Ref to the section element that GSAP will pin during the scroll animation.
   * Typically this is the heroRef from the parent Hero component.
   */
  containerRef: React.RefObject<HTMLElement | null>;
  className?: string;
  /** Frames to preload ahead/behind the current position. Default: 30 */
  bufferSize?: number;
  /** Extra scroll distance (px) for the pinned animation. Default: totalFrames × 6 */
  scrollDistance?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Draws `img` onto `ctx` with object-fit: cover semantics.
 * All coordinates are in CSS pixels (the transform matrix handles DPR).
 */
function drawCover(
  ctx:  CanvasRenderingContext2D,
  img:  HTMLImageElement,
  cssW: number,
  cssH: number
): void {
  if (cssW === 0 || cssH === 0) return;
  const canvasAR = cssW / cssH;
  const imgAR    = img.naturalWidth / img.naturalHeight;

  let sx = 0, sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;

  if (imgAR > canvasAR) {
    // Image is wider than canvas — crop equal slices from each side
    sw = Math.round(sh * canvasAR);
    sx = Math.round((img.naturalWidth - sw) / 2);
  } else {
    // Image is taller than canvas — crop equal slices from top & bottom
    sh = Math.round(sw / canvasAR);
    sy = Math.round((img.naturalHeight - sh) / 2);
  }

  ctx.clearRect(0, 0, cssW, cssH);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cssW, cssH);
}

// ─── Component ────────────────────────────────────────────────────────────────
export function FrameSequenceCanvas({
  totalFrames,
  getFrameUrl,
  containerRef,
  className = "",
  bufferSize = 30,
  scrollDistance,
}: FrameSequenceCanvasProps) {
  const prefersReduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Track current frame and dirty state — purely in refs (no React state)
  const currentFrameRef = useRef(0);
  const isDirtyRef      = useRef(false);
  const rafHandleRef    = useRef<number>(0);

  // CSS dimensions tracked here because canvas.width/height are physical pixels
  const cssDimsRef = useRef({ w: 0, h: 0 });

  // Controls the canvas fade-in
  const [isVisible, setIsVisible] = useState(false);

  const { getFrame, isReady, loadedCount, prioritizeRange } = useFrameLoader({
    totalFrames,
    getFrameUrl,
    initialBatch: 16,
  });

  // ── Render pipeline ─────────────────────────────────────────────────────
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frame = getFrame(currentFrameRef.current);
    if (!frame) return; // not yet loaded — leave previous frame visible

    const { w, h } = cssDimsRef.current;
    drawCover(ctx, frame, w, h);
  }, [getFrame]);

  /**
   * scheduleRender: sets dirty flag and requests a single RAF paint.
   * Multiple calls within the same frame are collapsed into one draw.
   */
  const scheduleRender = useCallback(() => {
    isDirtyRef.current = true;
    if (rafHandleRef.current) return; // already queued
    rafHandleRef.current = requestAnimationFrame(() => {
      rafHandleRef.current = 0;
      if (isDirtyRef.current) {
        renderFrame();
        isDirtyRef.current = false;
      }
    });
  }, [renderFrame]);

  // ── Frame index update (called from useScrollScrub) ─────────────────────
  const setFrame = useCallback((frameIndex: number) => {
    if (currentFrameRef.current === frameIndex) return;
    currentFrameRef.current = frameIndex;

    // Pre-load frames around the new position
    prioritizeRange(frameIndex - bufferSize, frameIndex + bufferSize);
    scheduleRender();
  }, [bufferSize, prioritizeRange, scheduleRender]);

  // ── When initial batch is ready: render frame 0 and fade in ─────────────
  useEffect(() => {
    if (!isReady) return;
    scheduleRender();
    // Small delay lets the canvas paint before opacity transition starts
    const t = setTimeout(() => setIsVisible(true), 60);
    return () => clearTimeout(t);
  }, [isReady, scheduleRender]);

  // ── Re-render when a new frame loads (catches deferred frame 0) ─────────
  useEffect(() => {
    scheduleRender();
  }, [loadedCount, scheduleRender]);

  // ── ResizeObserver: DPR-aware canvas sizing ──────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const { width: cssW, height: cssH } = entry.contentRect;
      cssDimsRef.current = { w: cssW, h: cssH };

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Setting width/height attributes clears the canvas AND resets the transform
      canvas.width  = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);

      // Re-apply DPR scale so all draw calls use CSS pixel coordinates
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }

      scheduleRender();
    });

    observer.observe(canvas);
    return () => observer.disconnect();
  }, [scheduleRender]);

  // ── Cleanup RAF on unmount ───────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (rafHandleRef.current) cancelAnimationFrame(rafHandleRef.current);
    };
  }, []);

  // ── GSAP scroll scrub ────────────────────────────────────────────────────
  useScrollScrub({
    containerRef,
    totalFrames,
    scrollDistance,
    onFrame: setFrame,
    disabled: prefersReduced ?? false,
  });

  // ── Loading progress (0–100) ─────────────────────────────────────────────
  const loadingPercent = Math.min(
    100,
    Math.round((loadedCount / Math.min(totalFrames, 16)) * 100)
  );

  return (
    <div className={`relative h-full w-full overflow-hidden rounded-[32px] ${className}`}>

      {/* Loading skeleton — visible until initial batch ready */}
      {!isReady && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[rgba(23,61,34,0.03)]"
          role="status"
          aria-label="Loading product animation"
        >
          {/* Progress bar */}
          <div className="h-[2px] w-28 overflow-hidden rounded-full bg-[rgba(23,61,34,0.1)]">
            <div
              className="h-full rounded-full bg-[#173D22] transition-[width] duration-300 ease-out"
              style={{ width: `${loadingPercent}%` }}
              aria-hidden="true"
            />
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-widest text-[#4C5A48]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Loading
          </span>
        </div>
      )}

      {/*
        Canvas:
        - CSS `width: 100%; height: 100%` fills the container
        - Attribute width/height set by ResizeObserver (physical pixels)
        - GPU-composited via will-change: transform
        - Fades in once isVisible is true
      */}
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.6s ease",
          willChange: "transform", // promote to GPU compositing layer
        }}
        aria-label="Animated makhana product sequence"
        role="img"
      />
    </div>
  );
}
