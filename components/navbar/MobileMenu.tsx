"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X } from "lucide-react";
import { NavLink } from "./NavLink";
import { IconButton } from "./IconButton";
import { EASE, NAV_LINKS } from "./constants";

// ─── Constants ────────────────────────────────────────────────────────────────
const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// ─── Variants ─────────────────────────────────────────────────────────────────
const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.22, ease: EASE } },
};

const drawerVariants: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { duration: 0.45, ease: EASE } },
  exit: { x: "100%", transition: { duration: 0.35, ease: EASE } },
};

const linkContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.065, delayChildren: 0.18 } },
  exit: {},
};

const linkItemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2, ease: EASE } },
};

const taglineVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.42, duration: 0.35, ease: EASE } },
  exit: { opacity: 0, y: 6 },
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // ── Body scroll lock ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      // Move focus into the drawer
      closeButtonRef.current?.focus();
    } else {
      const scrollY = parseInt(document.body.style.top || "0") * -1;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  // ── Escape key ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // ── Focus trap ───────────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Tab" || !drawerRef.current) return;
      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    []
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="mobile-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-[#173D22]/20 backdrop-blur-sm"
          />

          {/* ── Drawer ── */}
          <motion.div
            ref={drawerRef}
            key="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onKeyDown={handleKeyDown}
            className="fixed inset-y-0 right-0 z-50 flex w-[min(340px,88vw)] flex-col bg-[#FAF7EE]"
            style={{
              boxShadow: "0 0 80px rgba(23,61,34,0.16), -1px 0 0 rgba(23,61,34,0.06)",
            }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(23,61,34,0.08)]">
              <span
                id="mobile-menu-title"
                className="text-2xl font-medium tracking-tight text-[#173D22]"
                style={{ fontFamily: "var(--font-heading, serif)" }}
              >
                Menu
              </span>
              <IconButton
                ref={closeButtonRef}
                aria-label="Close menu"
                onClick={onClose}
              >
                <X size={18} strokeWidth={1.6} aria-hidden="true" />
              </IconButton>
            </div>

            {/* ── Nav Links ── */}
            <motion.nav
              variants={linkContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              aria-label="Mobile navigation"
              className="flex flex-col gap-0.5 px-4 py-5"
            >
              {NAV_LINKS.map(({ href, label }) => (
                <motion.div key={href} variants={linkItemVariants}>
                  <NavLink
                    href={href}
                    label={label}
                    onClick={onClose}
                    variant="mobile"
                  />
                </motion.div>
              ))}
            </motion.nav>

            {/* ── Footer ── */}
            <div className="mt-auto border-t border-[rgba(23,61,34,0.08)] px-6 py-5">
              <motion.p
                variants={taglineVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-xs tracking-widest uppercase text-[#4C5A48]"
                style={{ fontFamily: "var(--font-body, sans-serif)" }}
              >
                Premium Makhana Snacks
              </motion.p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
