import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch, getErrorMessage } from "@/lib/supabase-fetch";

function encodeProductId(item: { productId: string; variantId?: string }) {
  return item.variantId ? `${item.productId}::${item.variantId}` : item.productId;
}

function decodeProductId(encoded: string): { productId: string; variantId?: string } {
  const parts = encoded.split("::");
  return { productId: parts[0], variantId: parts[1] || undefined };
}

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ items: [] });
  }

  const { data: rows, error } = await supabaseFetch(
    `cart_items?user_id=eq.${userId}&select=*`
  );

  if (error || !Array.isArray(rows)) {
    if (error) console.error("Cart GET error:", error);
    return NextResponse.json({ items: [] });
  }

  const items = rows.map((r: Record<string, unknown>) => {
    const { productId, variantId } = decodeProductId(r.product_id as string);
    return {
      productId,
      variantId,
      variantName: variantId ? ((r.product_data as Record<string, unknown>)?.variantName as string) : undefined,
      quantity: r.quantity,
      product: r.product_data as Record<string, unknown>,
    };
  });

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items } = await req.json() as {
    items: { productId: string; variantId?: string; variantName?: string; quantity: number; product: Record<string, unknown> }[];
  };

  // Delete ALL then INSERT fresh — simple, atomic, no diff/encoding issues
  const { error: delError } = await supabaseFetch(
    `cart_items?user_id=eq.${userId}`,
    { method: "DELETE", headers: { "Prefer": "return=minimal" } }
  );
  if (delError) {
    console.error("Cart DELETE ALL error:", delError);
    return NextResponse.json({ error: getErrorMessage(delError) || "Cart clear failed" }, { status: 500 });
  }

  if (items.length > 0) {
    const { error: insError } = await supabaseFetch("cart_items", {
      method: "POST",
      headers: { "Prefer": "return=minimal" },
      body: JSON.stringify(
        items.map((item) => ({
          user_id: userId,
          product_id: encodeProductId(item),
          product_data: item.variantId
            ? { ...item.product, variantName: item.variantName }
            : item.product,
          quantity: item.quantity,
        }))
      ),
    });

    if (insError) {
      console.error("Cart INSERT error:", insError);
      return NextResponse.json({ error: getErrorMessage(insError) || "Cart sync failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
