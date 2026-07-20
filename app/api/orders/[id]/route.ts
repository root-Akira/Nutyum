import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch, getErrorMessage } from "@/lib/supabase-fetch";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: orders, error } = await supabaseFetch(
    `orders?id=eq.${id}&user_id=eq.${session.user.id}&select=*,order_items(*)`
  );

  if (error || !Array.isArray(orders)) {
    return NextResponse.json({ error: getErrorMessage(error) || "Order not found" }, { status: error ? 500 : 404 });
  }

  if (orders.length === 0) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const o = orders[0] as Record<string, unknown>;
  const shippingAddr = o.shipping_address;
  const order = {
    id: o.id,
    status: o.status,
    subtotal: o.subtotal,
    shipping: o.shipping,
    discountAmount: o.discount_amount || 0,
    total: o.total,
    email: o.email,
    phone: o.phone,
    shippingAddress: typeof shippingAddr === "string" ? JSON.parse(shippingAddr) : shippingAddr || null,
    items: ((o.order_items as Record<string, unknown>[]) || []).map((i: Record<string, unknown>) => ({
      id: i.id,
      productId: i.product_id,
      productName: i.product_name,
      variantName: i.variant_name,
      productImage: i.product_image,
      quantity: i.quantity,
      price: i.price,
    })),
    createdAt: o.created_at,
  };

  return NextResponse.json(order);
}
