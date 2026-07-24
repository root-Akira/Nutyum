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

  // Fetch status logs for tracking dates
  const { data: logs } = await supabaseFetch(
    `order_status_logs?order_id=eq.${id}&order=changed_at.asc`
  );
  const statusLogs = (Array.isArray(logs) ? logs : []) as Record<string, unknown>[];

  // Fetch product images for items
  const itemsRaw = (o.order_items as Record<string, unknown>[]) || [];
  const productIds = [...new Set(itemsRaw.map((i) => i.product_id as string).filter(Boolean))];
  const imageMap: Record<string, string> = {};
  if (productIds.length > 0) {
    for (let i = 0; i < productIds.length; i += 50) {
      const chunk = productIds.slice(i, i + 50);
      const { data: products } = await supabaseFetch(
        `products?id=in.(${chunk.join(",")})&select=id,images`
      );
      if (Array.isArray(products)) {
        for (const p of products as Record<string, unknown>[]) {
          const imgs = p.images as string[] | undefined;
          if (imgs && imgs.length > 0) {
            imageMap[p.id as string] = imgs[0];
          }
        }
      }
    }
  }

  const order = {
    id: o.id,
    status: o.status,
    subtotal: o.subtotal,
    shipping: o.shipping,
    discountAmount: o.discount || 0,
    total: o.total,
    paymentMethod: o.payment_method || "",
    notes: o.notes || "",
    email: session.user.email || "",
    name: session.user.name || "",
    phone: "",
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
    shippingAddress: typeof shippingAddr === "string" ? JSON.parse(shippingAddr) : shippingAddr || null,
    items: itemsRaw.map((i: Record<string, unknown>) => ({
      id: i.id,
      productId: i.product_id,
      productName: i.product_name,
      variantName: i.variant_name,
      productImage: imageMap[i.product_id as string] || "",
      quantity: i.quantity,
      price: i.price,
    })),
    statusLogs: statusLogs.map((l: Record<string, unknown>) => ({
      status: l.to_status || l.status,
      changedAt: l.changed_at || l.created_at,
      note: l.note || "",
    })),
    createdAt: o.created_at,
  };

  if (order.shippingAddress?.phone) {
    order.phone = order.shippingAddress.phone;
  }
  if (order.shippingAddress?.recipient_name) {
    order.recipientName = order.shippingAddress.recipient_name;
    order.recipientEmail = order.shippingAddress.recipient_email;
    order.recipientPhone = order.shippingAddress.recipient_phone;
  }

  return NextResponse.json(order);
}

const CANCELLABLE_STATUSES = ["placed", "confirmed"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { action, reason } = body;

  if (action !== "cancel") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const { data: orders, error: fetchErr } = await supabaseFetch(
    `orders?id=eq.${id}&user_id=eq.${session.user.id}&select=*`
  );

  if (fetchErr || !Array.isArray(orders) || orders.length === 0) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const order = orders[0] as Record<string, unknown>;

  if (!CANCELLABLE_STATUSES.includes(order.status as string)) {
    return NextResponse.json({ error: "This order can no longer be cancelled" }, { status: 400 });
  }

  const { error: updateErr } = await supabaseFetch(`orders?id=eq.${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "cancelled",
      notes: order.notes ? `${order.notes}\n[Cancellation reason: ${reason || "Not provided"}]` : `[Cancellation reason: ${reason || "Not provided"}]`,
    }),
  });

  if (updateErr) {
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }

  await supabaseFetch("order_status_logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order_id: id,
      from_status: order.status,
      to_status: "cancelled",
      changed_by: "customer",
      notes: reason || "Cancelled by customer",
    }),
  });

  try {
    const { sendEmail, orderCancelledEmail } = await import("@/lib/email");
    const items = (order.order_items as Record<string, unknown>[]) || [];
    const emailData = orderCancelledEmail(
      id.slice(0, 8),
      session.user.email || "",
      items.map((i: Record<string, unknown>) => ({
        name: i.product_name as string || "Product",
        qty: i.quantity as number || 1,
        price: i.price as number || 0,
        variant: i.variant_name as string || undefined,
      })),
      order.total as number || 0,
    );
    await sendEmail(emailData.to, emailData.subject, emailData.html);
  } catch (err) {
    console.error("Failed to send cancellation email:", err);
  }

  return NextResponse.json({ success: true });
}
