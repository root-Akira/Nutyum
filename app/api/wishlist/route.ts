import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch, getErrorMessage } from "@/lib/supabase-fetch";

function isTableMissing(error: unknown): boolean {
  const msg = typeof error === "object" && error ? String((error as Record<string, unknown>).message || "") : "";
  return msg.includes("does not exist") || msg.includes("relation");
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabaseFetch(
    `wishlist?user_id=eq.${session.user.id}&select=*&order=created_at.desc`
  );

  if (error || !Array.isArray(data)) {
    return NextResponse.json([]);
  }

  const mapped = data.map((w: Record<string, unknown>) => ({
    id: w.id,
    productId: w.product_id,
    product: w.product_data,
    createdAt: w.created_at,
  }));

  return NextResponse.json(mapped);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, product } = await req.json();

  if (!productId || !product) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data, error } = await supabaseFetch(
    "wishlist?on_conflict=user_id,product_id",
    {
      method: "POST",
      headers: { "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({
        user_id: session.user.id,
        product_id: productId,
        product_data: product,
      }),
    }
  );

  if (error) {
    if (isTableMissing(error)) {
      return NextResponse.json({ error: "Wishlist not available — run DB migration first" }, { status: 503 });
    }
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }

  const w = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({
    id: w.id,
    productId: w.product_id,
    product: w.product_data,
    createdAt: w.created_at,
  });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  const { error } = await supabaseFetch(
    `wishlist?user_id=eq.${session.user.id}&product_id=eq.${productId}`,
    {
      method: "DELETE",
      headers: { "Prefer": "return=minimal" },
    }
  );

  if (error) {
    if (isTableMissing(error)) {
      return NextResponse.json({ error: "Wishlist not available — run DB migration first" }, { status: 503 });
    }
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
