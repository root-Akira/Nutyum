"use client";

import { signOut, useSession } from "next-auth/react";
import { useCartStore } from "@/hooks/use-cart-store";
import { LogOut } from "lucide-react";

export function SidebarSignOut() {
  const { update } = useSession();
  const clearCart = useCartStore((s) => s.clearCart);

  async function handleSignOut() {
    await signOut({ redirect: false });
    clearCart();
    await update();
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  );
}
