"use client";

import { Search } from "lucide-react";
import { IconButton } from "./IconButton";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SearchButtonProps {
  onClick?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <IconButton aria-label="Search" onClick={onClick}>
      <Search size={18} strokeWidth={1.6} aria-hidden="true" />
    </IconButton>
  );
}
