import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch, getErrorMessage } from "@/lib/supabase-fetch";

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

  const items = rows.map((r: Record<string, unknown>) => ({
    productId: (r.product_data as Record<string, unknown>).id as string,
    quantity: r.quantity,
    product: r.product_data as Record<string, unknown>,
  }));

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items } = await req.json() as {
    items: { productId: string; quantity: number; product: Record<string, unknown> }[];
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
            product_id: item.productId,
            product_data: item.product,
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

  // Remove items no longer in the cart
  const activeIds = items.map((i) => i.productId);
  let delPath: string;
  if (activeIds.length > 0) {
    delPath = `cart_items?user_id=eq.${userId}&product_id=not.in.(${activeIds.join(",")})`;
  } else {
    delPath = `cart_items?user_id=eq.${userId}`;
  }
  await supabaseFetch(delPath, {
    method: "DELETE",
    headers: { "Prefer": "return=minimal" },
  });

  return NextResponse.json({ ok: true });
}
