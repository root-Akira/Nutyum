import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch } from "@/lib/supabase-fetch";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code, subtotal } = await req.json() as { code: string; subtotal: number };

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
  }

  const { data: coupons, error } = await supabaseFetch(
    `coupons?code=eq.${encodeURIComponent(code.toUpperCase())}&select=*`
  );

  if (error || !Array.isArray(coupons) || coupons.length === 0) {
    return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
  }

  const coupon = coupons[0] as Record<string, unknown>;

  if (!coupon.is_active) {
    return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
  }

  const now = new Date();

  if (coupon.starts_at) {
    const start = new Date(coupon.starts_at as string);
    if (now < start) {
      return NextResponse.json({ error: "This coupon is not yet valid" }, { status: 400 });
    }
  }

  if (coupon.expires_at) {
    const expiry = new Date(coupon.expires_at as string);
    if (now > expiry) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }
  }

  if ((coupon.usage_count as number) >= (coupon.usage_limit as number)) {
    return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
  }

  const minOrder = coupon.min_order as number;
  if (minOrder > 0 && subtotal < minOrder) {
    return NextResponse.json({
      error: `Minimum order amount of ₹${minOrder} required for this coupon`,
    }, { status: 400 });
  }

  let discountAmount = 0;
  if (coupon.type === "flat") {
    discountAmount = coupon.value as number;
  } else {
    discountAmount = Math.round((subtotal * (coupon.value as number)) / 100);
  }

  if (discountAmount > subtotal) {
    discountAmount = subtotal;
  }

  return NextResponse.json({
    valid: true,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discountAmount,
  });
}
