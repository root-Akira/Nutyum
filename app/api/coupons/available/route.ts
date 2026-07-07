import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch } from "@/lib/supabase-fetch";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subtotal } = await req.json() as { subtotal: number };

  const { data: coupons, error } = await supabaseFetch(
    `coupons?show_in_store=eq.true&is_active=eq.true&select=*&order=value.desc`
  );

  if (error || !Array.isArray(coupons)) {
    if (error) console.error("Available coupons error:", error);
    return NextResponse.json({ coupons: [] });
  }

  const now = new Date();

  const available = (coupons as Record<string, unknown>[]).map((coupon) => {
    const reasons: string[] = [];

    if (coupon.starts_at && now < new Date(coupon.starts_at as string)) {
      reasons.push("Not yet valid");
    }

    if (coupon.expires_at && now > new Date(coupon.expires_at as string)) {
      reasons.push("Expired");
    }

    if ((coupon.usage_count as number) >= (coupon.usage_limit as number)) {
      reasons.push("Fully claimed");
    }

    const minOrder = coupon.min_order as number;
    let eligible = reasons.length === 0;
    if (minOrder > 0 && subtotal < minOrder) {
      eligible = false;
    }

    let discountAmount = 0;
    if (eligible) {
      if (coupon.type === "flat") {
        discountAmount = coupon.value as number;
      } else {
        discountAmount = Math.round((subtotal * (coupon.value as number)) / 100);
      }
      if (discountAmount > subtotal) discountAmount = subtotal;
    }

    return {
      code: coupon.code as string,
      type: coupon.type as string,
      value: coupon.value as number,
      minOrder,
      discountAmount,
      eligible,
      reason: !eligible && reasons.length > 0 ? reasons[0] : undefined,
    };
  });

  return NextResponse.json({ coupons: available });
}
