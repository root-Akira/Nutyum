"use client";

import { motion } from "framer-motion";

export function AnnouncementBar() {
  return (
    <div
      className="relative z-50 w-full py-2 text-center"
      style={{ backgroundColor: "#173D22" }}
      role="banner"
      aria-label="Promotional announcement"
    >
      <p
        className="text-xs font-medium tracking-widest uppercase text-[#FAF7EE]"
        style={{ fontFamily: "var(--font-body, 'Manrope', sans-serif)" }}
      >
        Free shipping on orders over ₹999
      </p>
    </div>
  );
}
