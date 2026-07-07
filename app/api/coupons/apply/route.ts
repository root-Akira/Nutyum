import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch, getErrorMessage } from "@/lib/supabase-fetch";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = await req.json() as { code: string };

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
  }

  const { data: coupons, error } = await supabaseFetch(
    `coupons?code=eq.${encodeURIComponent(code.toUpperCase())}&select=id,usage_count`
  );

  if (error || !Array.isArray(coupons) || coupons.length === 0) {
    return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
  }

  const coupon = coupons[0] as Record<string, unknown>;
  const newCount = (coupon.usage_count as number) + 1;

  const { error: updateError } = await supabaseFetch(
    `coupons?id=eq.${coupon.id}`,
    {
      method: "PATCH",
      headers: { "Prefer": "return=minimal" },
      body: JSON.stringify({ usage_count: newCount }),
    }
  );

  if (updateError) {
    console.error("Coupon apply error:", updateError);
    return NextResponse.json({ error: getErrorMessage(updateError) || "Failed to apply coupon" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
