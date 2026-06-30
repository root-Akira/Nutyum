"use client";

/**
 * HeroBackground
 *
 * Renders the atmospheric, layered background for the Hero section:
 * - Base cream colour is applied by the parent section.
 * - Two soft radial gradients provide organic lighting.
 * - A very subtle SVG grain overlay adds editorial texture.
 * - A faint grid/mesh creates depth without distracting.
 * All elements are aria-hidden and pointer-events-none.
 */
export function HeroBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Warm gold radial — top-right accent light */}
      <div
        className="absolute -top-40 -right-40 h-[900px] w-[900px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(224,150,26,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Cool green radial — bottom-left counter-light */}
      <div
        className="absolute -bottom-60 -left-40 h-[800px] w-[800px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(23,61,34,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Center bloom — lifts the cream to a warmer surface */}
      <div
        className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,248,230,0.60) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grain texture via SVG filter */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.025]">
        <filter id="hero-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>
    </div>
  );
}
