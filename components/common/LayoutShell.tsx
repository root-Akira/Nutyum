"use client";

import { Navbar } from "@/components/navbar/Navbar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartSync } from "@/components/cart/CartSync";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { useCartStore } from "@/hooks/use-cart-store";
import { useUIStore } from "@/hooks/use-ui-store";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const totalItems = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const searchOpen = useUIStore((s) => s.searchOpen);
  const cartOpen = useUIStore((s) => s.cartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const toggleSearch = useUIStore((s) => s.toggleSearch);

  return (
    <>
      <Navbar cartItemCount={totalItems} />
      {children}
      <CartDrawer open={cartOpen} onOpenChange={(open) => { if (!open) closeCart(); }} />
      <SearchOverlay isOpen={searchOpen} onClose={() => toggleSearch()} />
      <CartSync />
    </>
  );
}
