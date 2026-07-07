"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Percent, X, Check, Loader2, Tag } from "lucide-react";
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
import {
  useCartStore,
  getCartItemKey,
  selectTotalItems,
  selectSubtotal,
  selectDiscount,
  selectTotal,
} from "@/hooks/use-cart-store";
import { formatPrice } from "@/lib/formatters";
import { CartItem as CartItemComponent } from "./CartItem";

interface CartDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function CouponInput({ subtotal }: { subtotal: number }) {
  const couponCode = useCartStore((s) => s.couponCode);
  const discount = useCartStore(selectDiscount);
  const couponError = useCartStore((s) => s.couponError);
  const couponPending = useCartStore((s) => s.couponPending);
  const setCouponCode = useCartStore((s) => s.setCouponCode);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const [available, setAvailable] = useState<{ code: string; type: string; value: number; minOrder: number; discountAmount: number; eligible: boolean; reason?: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (discount) { setAvailable([]); return }
    setLoading(true)
    fetch("/api/coupons/available", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtotal }),
    })
      .then((r) => r.json())
      .then((data) => setAvailable(data.coupons || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [subtotal, discount])

  if (discount) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2">
        <Check size={14} className="text-green-600 shrink-0" />
        <span className="text-xs text-green-700 font-medium flex-1">
          Coupon applied — you save {formatPrice(discount.discountAmount)}
        </span>
        <button onClick={removeCoupon} className="text-green-600 hover:text-green-800 transition-colors">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Percent size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4C5A48]/60" />
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Coupon code"
            className="w-full rounded-lg border border-[rgba(23,61,34,0.15)] bg-[#FFFEFB] pl-8 pr-3 py-2 text-xs text-[#173D22] outline-none focus:border-[#173D22] transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={() => applyCoupon(subtotal)}
          disabled={!couponCode.trim() || couponPending}
          className="rounded-lg bg-[#173D22] px-3.5 py-2 text-xs font-medium text-white transition-all hover:bg-[#0e2616] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {couponPending ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
        </button>
      </div>
      {couponError && (
        <p className="text-xs text-red-500">{couponError}</p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-1">
          <Loader2 size={12} className="animate-spin text-[#4C5A48]/60" />
          <span className="text-xs text-[#4C5A48]/60">Checking coupons...</span>
        </div>
      ) : available.length > 0 ? (
        <div className="space-y-1 pt-1">
          <p className="text-xs font-medium text-[#4C5A48]">Available coupons</p>
          {available.map((cpn) => (
            <button
              key={cpn.code}
              type="button"
              onClick={() => {
                if (cpn.eligible) {
                  setCouponCode(cpn.code)
                  applyCoupon(subtotal)
                }
              }}
              disabled={!cpn.eligible}
              className={`w-full flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-all ${
                cpn.eligible
                  ? "border-[rgba(23,61,34,0.15)] hover:border-[#173D22]/40 cursor-pointer"
                  : "border-dashed border-[rgba(23,61,34,0.1)] opacity-60 cursor-not-allowed"
              }`}
            >
              <Tag size={12} className={cpn.eligible ? "text-[#173D22]" : "text-[#4C5A48]/40"} />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono font-bold text-[#173D22]">{cpn.code}</span>
                <span className="text-xs text-[#4C5A48] ml-2">
                  {cpn.type === "percentage" ? `${cpn.value}% off` : `${formatPrice(cpn.value)} off`}
                </span>
                {cpn.minOrder > 0 && (
                  <span className="text-[10px] text-[#4C5A48]/60 ml-1">
                    · min. {formatPrice(cpn.minOrder)}
                  </span>
                )}
              </div>
              {!cpn.eligible && cpn.reason && (
                <span className="text-[10px] text-red-500 shrink-0">{cpn.reason}</span>
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore(selectTotalItems);
  const subtotal = useCartStore(selectSubtotal);
  const discount = useCartStore(selectDiscount);
  const total = useCartStore(selectTotal);

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
            <SheetClose asChild>
              <Button asChild variant="outline" className="mt-2 rounded-full">
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-5 py-3">
              {items.map((item) => (
                <CartItemComponent key={getCartItemKey(item)} item={item} />
              ))}
            </ScrollArea>

            <div className="border-t border-border px-5 py-4 space-y-3">
              <CouponInput subtotal={subtotal} />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-sm font-medium text-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {discount && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">Discount</span>
                  <span className="text-sm font-medium text-green-600">
                    -{formatPrice(discount.discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="text-sm font-semibold text-primary">Total</span>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(total)}
                </span>
              </div>

              <Button asChild className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/shop">Checkout</Link>
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
