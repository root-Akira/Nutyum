"use client";

import { forwardRef } from "react";
import Link, { type LinkProps } from "next/link";
import { motion, type HTMLMotionProps } from "framer-motion";
import { EASE } from "./constants";

const ICON_BUTTON_CLASSES =
  "relative flex h-9 w-9 items-center justify-center rounded-full text-[#173D22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173D22] focus-visible:ring-offset-2";

const hoverAnimation = {
  whileHover: { scale: 1.1, backgroundColor: "rgba(23,61,34,0.06)" },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2, ease: EASE },
};

// ─── IconButton ─────────────────────────────────────────────────────────────
type IconButtonProps = HTMLMotionProps<"button">;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        type="button"
        className={`${ICON_BUTTON_CLASSES} ${className || ""}`}
        {...hoverAnimation}
        {...props}
      />
    );
  }
);
IconButton.displayName = "IconButton";

// ─── IconButtonLink ─────────────────────────────────────────────────────────
const MotionLink = motion(Link);

type IconButtonLinkProps = React.ComponentPropsWithoutRef<typeof MotionLink> &
  LinkProps;

export const IconButtonLink = forwardRef<HTMLAnchorElement, IconButtonLinkProps>(
  ({ className, ...props }, ref) => {
    return (
      <MotionLink
        ref={ref}
        className={`${ICON_BUTTON_CLASSES} ${className || ""}`}
        {...hoverAnimation}
        {...props}
      />
    );
  }
);
IconButtonLink.displayName = "IconButtonLink";
