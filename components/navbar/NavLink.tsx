"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "./constants";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  /** Controls visual scale — desktop uses compact 14px, mobile uses large 24px */
  variant?: "desktop" | "mobile";
}

// ─── Component ────────────────────────────────────────────────────────────────
export function NavLink({ href, label, onClick, variant = "desktop" }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const isDesktop = variant === "desktop";

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={[
        "relative group inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173D22] focus-visible:ring-offset-2 rounded-sm text-[#173D22]",
        isDesktop
          ? "text-sm py-1"
          : "text-2xl w-full px-4 py-3 rounded-xl hover:bg-[#173D22]/5",
        isActive ? "font-semibold" : "font-medium",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ fontFamily: "var(--font-body, Manrope, sans-serif)" }}
    >
      {/* Text — opacity fades independently of underline */}
      <motion.span
        whileHover={{ opacity: isDesktop ? 0.65 : 1 }}
        transition={{ duration: 0.2, ease: EASE }}
      >
        {label}
      </motion.span>

      {/* Underline — desktop only, driven by AnimatePresence for clean re-mount */}
      {isDesktop && (
        <AnimatePresence initial={false}>
          {isActive && (
            <motion.span
              key="active-underline"
              className="absolute -bottom-0.5 left-0 h-px w-full bg-[#173D22] origin-left"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
      )}

      {/* Hover underline — shows when not active */}
      {isDesktop && !isActive && (
        <motion.span
          className="absolute -bottom-0.5 left-0 h-px w-full bg-[#173D22] origin-left"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.25, ease: EASE }}
          aria-hidden="true"
        />
      )}
    </Link>
  );
}
