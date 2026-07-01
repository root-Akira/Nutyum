import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch } from "@/lib/supabase-fetch";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: orders, error } = await supabaseFetch(
    `orders?user_id=eq.${session.user.id}&select=*,order_items(*)&order=created_at.desc`
  );

  if (error) {
    return NextResponse.json({ error: error.message || error }, { status: 500 });
  }

  const mapped = (orders || []).map((o: Record<string, unknown>) => ({
    id: o.id,
    status: o.status,
    subtotal: o.subtotal,
    shipping: o.shipping,
    total: o.total,
    items: (o.order_items as Record<string, unknown>[])?.map((i: Record<string, unknown>) => ({
      id: i.id,
      productId: i.product_id,
      quantity: i.quantity,
      price: i.price,
    })) || [],
    createdAt: o.created_at,
  }));

  return NextResponse.json(mapped);
}
