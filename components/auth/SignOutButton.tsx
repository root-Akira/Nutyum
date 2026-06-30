"use client";

import { signOut, useSession } from "next-auth/react";
import { useCartStore } from "@/hooks/use-cart-store";

export function SignOutButton() {
  const { update } = useSession();
  const clearCart = useCartStore((s) => s.clearCart);

  async function handleSignOut() {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [] }),
    });
    clearCart();
    await signOut({ redirect: false });
    await update();
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-full border border-red-300 px-6 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
      style={{ fontFamily: "var(--font-body)" }}
    >
      Sign Out
    </button>
  );
}
