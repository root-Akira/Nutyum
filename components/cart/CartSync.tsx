"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/hooks/use-cart-store";

const STORAGE_KEY = "nutyum-cart";
const COUPON_KEY = "nutyum-coupon";

export function CartSync() {
  const { data: session, status } = useSession();
  const items = useCartStore((s) => s.items);
  const serverMode = useCartStore((s) => s.serverMode);
  const couponCode = useCartStore((s) => s.couponCode);
  const discount = useCartStore((s) => s.discount);
  const mergeGuestCart = useCartStore((s) => s.mergeGuestCart);
  const setServerMode = useCartStore((s) => s.setServerMode);
  const lastSaved = useRef("");
  const lastCoupon = useRef("");

  // 1. Load cart from localStorage for instant display (DB will overwrite for logged-in users)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          useCartStore.setState({ items: parsed, loaded: true });
        }
      }
    } catch { /* ignore */ }
    try {
      const raw = localStorage.getItem(COUPON_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.discount) {
          useCartStore.setState({ couponCode: parsed.couponCode || '', discount: parsed.discount });
        }
      }
    } catch { /* ignore */ }
  }, []);

  // 2. Save cart to localStorage as cache (used for instant display on next load)
  useEffect(() => {
    const json = JSON.stringify(items);
    if (json === lastSaved.current) return;
    lastSaved.current = json;
    try { localStorage.setItem(STORAGE_KEY, json); } catch { /* ignore */ }
  }, [items]);

  // 3. Save coupon to localStorage
  useEffect(() => {
    const state = JSON.stringify({ couponCode, discount });
    if (state === lastCoupon.current) return;
    lastCoupon.current = state;
    const timeout = setTimeout(() => {
      try {
        if (discount) {
          localStorage.setItem(COUPON_KEY, state);
        } else {
          localStorage.removeItem(COUPON_KEY);
        }
      } catch { /* ignore */ }
    }, 200);
    return () => clearTimeout(timeout);
  }, [couponCode, discount]);

  // 4. On login: merge guest cart → fetch authoritative state from DB → switch to server mode
  useEffect(() => {
    const uid = session?.user?.id ?? null;
    if (uid && !serverMode) {
      (async () => {
        // Merge any local guest cart items into the DB
        await mergeGuestCart();
        // Fetch authoritative state from DB
        try {
          const res = await fetch("/api/cart");
          const data = await res.json();
          useCartStore.setState({ items: data.items || [], loaded: true, serverMode: true });
        } catch {
          useCartStore.setState({ loaded: true, serverMode: true });
        }
      })();
    }
    if (!uid && status === "unauthenticated") {
      setServerMode(false);
      useCartStore.setState({ items: [], loaded: false, couponCode: '', discount: null, couponError: '' });
      try { localStorage.removeItem("nutyum-cart"); } catch { /* ignore */ }
      try { localStorage.removeItem("nutyum-coupon"); } catch { /* ignore */ }
    }
  }, [session?.user?.id, status, serverMode, mergeGuestCart, setServerMode]);

  return null;
}
