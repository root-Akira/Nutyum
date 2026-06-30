"use client";

/**
 * useFrameLoader
 *
 * Manages progressive loading of a PNG image sequence without ever
 * loading the entire sequence at once.
 *
 * Strategy:
 *  Phase 1 — Eager: load the first `initialBatch` frames immediately so
 *             the canvas has something to show as fast as possible.
 *  Phase 2 — Background: load remaining frames in small idle chunks,
 *             throttled so as not to block the main thread.
 *  Phase 3 — Priority: when `prioritizeRange(start, end)` is called (e.g.
 *             from the scroll handler), outstanding frames in that window
 *             are requested immediately ahead of the idle queue.
 *
 * All frame storage is kept in a Map ref — never in React state — so
 * frame cache operations fire zero React renders.
 */

import { useRef, useState, useCallback, useEffect } from "react";

// ─── Tuning constants ─────────────────────────────────────────────────────────
const INITIAL_BATCH = 16;      // frames loaded eagerly on mount
const IDLE_CHUNK   = 8;        // frames loaded per background tick
const IDLE_DELAY   = 80;       // ms between background ticks
const BACKGROUND_START_DELAY = 300; // ms after initial batch finishes

// ─── Types ────────────────────────────────────────────────────────────────────
export interface UseFrameLoaderOptions {
  totalFrames: number;
  getFrameUrl: (index: number) => string;
  initialBatch?: number;
}

export interface UseFrameLoaderReturn {
  /** Returns a cached HTMLImageElement or null if not yet loaded */
  getFrame: (index: number) => HTMLImageElement | null;
  /** True once the initial batch has finished loading */
  isReady: boolean;
  /** Total number of frames that have successfully loaded */
  loadedCount: number;
  /** Immediately request a range of frames (skips idle queue) */
  prioritizeRange: (start: number, end: number) => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useFrameLoader({
  totalFrames,
  getFrameUrl,
  initialBatch = INITIAL_BATCH,
}: UseFrameLoaderOptions): UseFrameLoaderReturn {
  // Refs hold the cache and loading state — never trigger React renders
  const cacheRef   = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingRef = useRef<Set<number>>(new Set());
  const loadedRef  = useRef<Set<number>>(new Set());

  // Only these two values drive React state (they power the loading UI)
  const [isReady, setIsReady]       = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // ── Core loader ─────────────────────────────────────────────────────────
  const loadFrame = useCallback((index: number): Promise<void> => {
    if (index < 0 || index >= totalFrames)            return Promise.resolve();
    if (loadingRef.current.has(index))                return Promise.resolve();
    if (loadedRef.current.has(index))                 return Promise.resolve();

    loadingRef.current.add(index);

    return new Promise<void>((resolve) => {
      const img   = new Image();
      img.onload  = () => {
        cacheRef.current.set(index, img);
        loadedRef.current.add(index);
        loadingRef.current.delete(index);
        setLoadedCount((n) => n + 1);
        resolve();
      };
      img.onerror = () => {
        loadingRef.current.delete(index);
        resolve(); // non-fatal — skip missing frames gracefully
      };
      img.src = getFrameUrl(index);
    });
  }, [totalFrames, getFrameUrl]);

  // ── Phase 1: eager batch ─────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    let bgTimer: ReturnType<typeof setTimeout>;

    const run = async () => {
      // Load the first N frames in parallel
      const batch = Math.min(initialBatch, totalFrames);
      await Promise.all(
        Array.from({ length: batch }, (_, i) => loadFrame(i))
      );

      if (cancelled) return;
      setIsReady(true);

      // ── Phase 2: idle background loader ────────────────────────────────
      let cursor = batch;
      const loadNextChunk = () => {
        if (cancelled || cursor >= totalFrames) return;
        const end = Math.min(cursor + IDLE_CHUNK, totalFrames);
        for (let i = cursor; i < end; i++) loadFrame(i);
        cursor = end;
        bgTimer = setTimeout(loadNextChunk, IDLE_DELAY);
      };
      bgTimer = setTimeout(loadNextChunk, BACKGROUND_START_DELAY);
    };

    run();

    return () => {
      cancelled = true;
      clearTimeout(bgTimer);
    };
  }, [loadFrame, initialBatch, totalFrames]);

  // ── Phase 3: priority range ──────────────────────────────────────────────
  const prioritizeRange = useCallback((start: number, end: number) => {
    const lo = Math.max(0, start);
    const hi = Math.min(totalFrames - 1, end);
    for (let i = lo; i <= hi; i++) {
      loadFrame(i); // no-op if already loading or loaded
    }
  }, [loadFrame, totalFrames]);

  const getFrame = useCallback(
    (index: number) => cacheRef.current.get(index) ?? null,
    []
  );

  return { getFrame, isReady, loadedCount, prioritizeRange };
}
