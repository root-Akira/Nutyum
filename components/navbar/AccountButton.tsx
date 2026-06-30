"use client";

import { User } from "lucide-react";
import { IconButtonLink } from "./IconButton";

// ─── Component ────────────────────────────────────────────────────────────────
export function AccountButton() {
  return (
    <IconButtonLink href="/account" aria-label="Account">
      <User size={18} strokeWidth={1.6} aria-hidden="true" />
    </IconButtonLink>
  );
}
