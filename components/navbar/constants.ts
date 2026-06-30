/**
 * Shared constants for the Navbar component tree.
 * Single source of truth — no duplication across files.
 */

/** Cubic-bezier easing used across all navbar animations */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Navigation links — left column on desktop, drawer on mobile */
export const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/best-sellers", label: "Best Sellers" },
  { href: "/our-story", label: "Our Story" },
] as const;
