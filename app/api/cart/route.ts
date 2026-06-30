import { NextResponse } from "next/server";
import { auth } from "@/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function supabaseFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`,
      "Accept": "application/json",
      ...options?.headers,
    },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  return { data, error: res.ok ? null : data, status: res.status };
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

  if (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ items: [] });
  }

  const items = (rows || []).map((r: Record<string, unknown>) => ({
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

  // Delete existing items
  const { error: delError } = await supabaseFetch(
    `cart_items?user_id=eq.${userId}`,
    { method: "DELETE" }
  );

  if (delError) {
    console.error("Cart DELETE error:", delError);
    return NextResponse.json({ error: delError.message || delError }, { status: 500 });
  }

  // Insert new items
  if (items.length > 0) {
    const { error: insError } = await supabaseFetch("cart_items", {
      method: "POST",
      body: JSON.stringify(
        items.map((item) => ({
          user_id: userId,
          product_id: item.productId,
          product_data: item.product,
          quantity: item.quantity,
        }))
      ),
      headers: {
        "Prefer": "return=minimal",
      },
    });

    if (insError) {
      console.error("Cart INSERT error:", insError);
      return NextResponse.json({ error: insError.message || insError }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
