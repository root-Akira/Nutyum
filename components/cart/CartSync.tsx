"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/hooks/use-cart-store";

const STORAGE_KEY = "nutyum-cart";
const COUPON_KEY = "nutyum-coupon";

export function CartSync() {
  const { data: session, status } = useSession();
  const items = useCartStore((s) => s.items);
  const couponCode = useCartStore((s) => s.couponCode);
  const discount = useCartStore((s) => s.discount);
  const loadItems = useCartStore((s) => s.loadItems);
  const loaded = useCartStore((s) => s.loaded);
  const hasFetchedApi = useRef(false);
  const syncing = useRef(false);
  const lastSaved = useRef("");
  const lastCoupon = useRef("");

  // 1. Load cart + coupon from localStorage immediately on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          useCartStore.setState({ items: parsed, loaded: true });
        }
      }
    } catch {
      // ignore
    }
    try {
      const raw = localStorage.getItem(COUPON_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.discount) {
          useCartStore.setState({ couponCode: parsed.couponCode || '', discount: parsed.discount });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // 2. Save cart to localStorage whenever items change
  useEffect(() => {
    const json = JSON.stringify(items);
    if (json === lastSaved.current) return;
    lastSaved.current = json;

    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, json);
      } catch {
        // quota exceeded
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [items]);

  // 3. Save coupon to localStorage whenever it changes
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
      } catch {
        // ignore
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [couponCode, discount]);

  // 4. Load cart from API when user signs in
  useEffect(() => {
    const uid = session?.user?.id ?? null;
    if (uid && !hasFetchedApi.current) {
      hasFetchedApi.current = true;
      fetch("/api/cart")
        .then((r) => r.json())
        .then((data) => {
          if (data.items?.length) {
            loadItems(data.items);
          } else if (!items.length) {
            loadItems([]);
          } else {
            // API empty but we have cached items — keep cache
            useCartStore.setState({ loaded: true });
          }
        })
        .catch(() => {
          // API failed — keep localStorage cache, don't wipe
          useCartStore.setState({ loaded: true });
        });
    }
    if (!uid && status === "unauthenticated") {
      hasFetchedApi.current = false;
      lastSaved.current = "";
      lastCoupon.current = "";
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(COUPON_KEY);
      useCartStore.setState({ loaded: false, couponCode: '', discount: null, couponError: '' });
    }
  }, [session?.user?.id, status, loadItems, items]);

  // 5. Sync cart to API when items change (only when signed in)
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;
    if (!loaded || syncing.current) return;

    syncing.current = true;
    const timeout = setTimeout(() => {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })
        .catch((err) => console.error("Cart sync failed:", err))
        .finally(() => { syncing.current = false; });
    }, 500);

    return () => { clearTimeout(timeout); syncing.current = false; };
  }, [items, session?.user?.id, loaded, status]);

  return null;
}
