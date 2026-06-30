"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore, selectTotalItems, selectSubtotal } from "@/hooks/use-cart-store";
import { formatPrice } from "@/lib/formatters";
import { CartItem as CartItemComponent } from "./CartItem";

interface CartDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore(selectTotalItems);
  const subtotal = useCartStore(selectSubtotal);

  const isControlled = open !== undefined && onOpenChange !== undefined;

  return (
    <Sheet open={isControlled ? open : undefined} onOpenChange={isControlled ? onOpenChange : undefined}>
      {!isControlled && (
        <SheetTrigger asChild>
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
            aria-label={`Open cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          >
            <ShoppingBag size={18} strokeWidth={1.6} aria-hidden="true" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key="cart-count"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E0961A] text-[10px] font-semibold leading-none text-white"
                  aria-hidden="true"
                  style={{ fontFamily: "var(--font-body, Manrope, sans-serif)" }}
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </SheetTrigger>
      )}
      <SheetContent side="right" className="flex flex-col p-0 w-full sm:max-w-md">
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border">
          <SheetTitle className="text-left text-lg font-semibold text-primary">
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-5 py-12">
            <ShoppingBag size={40} className="text-muted-foreground/40" strokeWidth={1.2} />
            <p className="text-base text-muted-foreground">Your cart is empty</p>
            <Button asChild variant="outline" className="mt-2 rounded-full">
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-5 py-3">
              {items.map((item) => (
                <CartItemComponent key={item.productId} item={item} />
              ))}
            </ScrollArea>

            <div className="border-t border-border px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-base font-semibold text-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <Button asChild className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/checkout">Checkout</Link>
              </Button>
              <SheetClose asChild>
                <Link
                  href="/shop"
                  className="block w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors py-2"
                >
                  Continue Shopping
                </Link>
              </SheetClose>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
