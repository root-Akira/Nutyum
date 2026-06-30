"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { IconButton } from "./IconButton";
import { EASE } from "./constants";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CartButtonProps {
  itemCount?: number;
  onClick?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function CartButton({ itemCount = 0, onClick }: CartButtonProps) {
  const label =
    itemCount > 0
      ? `Open cart, ${itemCount} item${itemCount > 1 ? "s" : ""}`
      : "Open cart";

  return (
    <IconButton aria-label={label} onClick={onClick}>
      <ShoppingBag size={18} strokeWidth={1.6} aria-hidden="true" />

      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            key="cart-count"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E0961A] text-[10px] font-semibold leading-none text-white"
            aria-hidden="true"
            style={{ fontFamily: "var(--font-body, Manrope, sans-serif)" }}
          >
            {itemCount > 9 ? "9+" : itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </IconButton>
  );
}
