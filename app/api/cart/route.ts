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

  // Upsert current items (insert or update on conflict)
  if (items.length > 0) {
    const { error: upsertError } = await supabaseFetch(
      "cart_items?on_conflict=user_id,product_id",
      {
        method: "POST",
        headers: { "Prefer": "resolution=merge-duplicates" },
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
      }
    );

    if (upsertError) {
      console.error("Cart UPSERT error:", upsertError);
      return NextResponse.json({ error: getErrorMessage(upsertError) || "Cart sync failed" }, { status: 500 });
    }
  }

  // Remove items no longer in the cart (fetch current DB items, diff, delete individually)
  const activeSet = new Set(items.map((i) => encodeProductId(i)));
  const { data: currentRows } = await supabaseFetch(
    `cart_items?user_id=eq.${userId}&select=product_id`
  );
  if (Array.isArray(currentRows)) {
    for (const row of currentRows) {
      if (!activeSet.has(row.product_id as string)) {
        const pid = encodeURIComponent(String(row.product_id));
        await supabaseFetch(
          `cart_items?user_id=eq.${userId}&product_id=eq.${pid}`,
          { method: "DELETE", headers: { "Prefer": "return=minimal" } }
        );
      }
    }
  }

  return NextResponse.json({ ok: true });
}
