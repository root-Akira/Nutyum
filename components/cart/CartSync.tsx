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
  const lastSaved = useRef("");
  const lastCoupon = useRef("");

  // 1. Load cart + coupon from localStorage immediately on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      console.log("[CART] Step 1 mount: STORAGE_KEY raw found?", !!raw);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          console.log("[CART] Step 1 setting items from localStorage:", parsed.length);
          useCartStore.setState({ items: parsed, loaded: true });
        }
      }
    } catch (e) {
      console.error("[CART] Step 1 localStorage load error:", e);
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
    if (!loaded) return;
    const json = JSON.stringify(items);
    console.log("[CART] Step 2 items changed, json length:", json.length, "lastSaved match:", json === lastSaved.current);
    if (json === lastSaved.current) return;
    lastSaved.current = json;
    try {
      localStorage.setItem(STORAGE_KEY, json);
      console.log("[CART] Step 2 saved to localStorage, key:", STORAGE_KEY);
    } catch (e) {
      console.error("[CART] Step 2 localStorage.setItem FAILED:", e);
    }
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

  // 4. Load cart from API only when localStorage is empty (first visit / cleared cache)
  //    Otherwise trust localStorage — avoids race between API fetch and immediate remove.
  useEffect(() => {
    const uid = session?.user?.id ?? null;
    console.log("[CART] Step 4 uid:", uid, "hasFetchedApi:", hasFetchedApi.current);
    if (uid && !hasFetchedApi.current) {
      hasFetchedApi.current = true;

      // If localStorage has items, trust it — skip API
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        console.log("[CART] Step 4 localStorage has items?", !!stored);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length) {
            console.log("[CART] Step 4 skipping API fetch, trusting localStorage, length:", parsed.length);
            useCartStore.setState({ loaded: true });
            return;
          }
        }
      } catch (e) {
        console.error("[CART] Step 4 localStorage parse error:", e);
      }

      // Only fetch from API when localStorage is empty
      console.log("[CART] Step 4 fetching from API (localStorage empty)");
      fetch("/api/cart")
        .then((r) => r.json())
        .then((data) => {
          console.log("[CART] Step 4 API returned items:", data.items?.length);
          if (data.items?.length) {
            useCartStore.setState({ items: data.items, loaded: true });
          } else {
            useCartStore.setState({ loaded: true });
          }
        })
        .catch((e) => {
          console.error("[CART] Step 4 API fetch error:", e);
          useCartStore.setState({ loaded: true });
        });
    }
    if (!uid && status === "unauthenticated") {
      console.log("[CART] Step 4 user signed out, clearing");
      hasFetchedApi.current = false;
      lastSaved.current = "";
      lastCoupon.current = "";
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(COUPON_KEY);
      useCartStore.setState({ loaded: false, couponCode: '', discount: null, couponError: '' });
    }
  }, [session?.user?.id, status]);

  // 5. Sync cart to API when items change (only when signed in)
  const latestRef = useRef(items);
  latestRef.current = items;

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;
    if (!loaded) return;

    const timer = setTimeout(async () => {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const snapshot = latestRef.current;
        let ok = false;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const res = await fetch("/api/cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items: snapshot }),
            });
            if (res.ok) { ok = true; break; }
          } catch {
            // network error, retry
          }
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        }
        if (!ok) break;
        // If items changed while we were syncing, loop and send again
        if (latestRef.current === snapshot) break;
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [items, session?.user?.id, loaded, status]);

  return null;
}
