import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase-fetch";
import { sendEmail, orderOutForDeliveryEmail, orderShippedEmail } from "@/lib/email";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://admin.nutyum.in",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { orderId, status, apiKey } = body;

  if (apiKey !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  if (!orderId || !status) {
    return NextResponse.json({ error: "Missing orderId or status" }, { status: 400, headers: corsHeaders });
  }

  const { data: orders } = await supabaseFetch(
    `orders?id=eq.${orderId}&select=*,order_items(*)`
  );

  const order = (Array.isArray(orders) ? orders[0] : null) as Record<string, unknown> | null;
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404, headers: corsHeaders });
  }

  const shippingAddr = order.shipping_address;
  const address = typeof shippingAddr === "string" ? JSON.parse(shippingAddr) : shippingAddr || {};
  let customerEmail = address.recipient_email || "";

  if (!customerEmail) {
    const userId = order.user_id as string;
    if (userId) {
      const { data: userData } = await supabaseFetch(
        `users?id=eq.${userId}&select=email`
      );
      if (Array.isArray(userData) && userData.length > 0) {
        customerEmail = (userData[0] as Record<string, unknown>).email as string;
      }
    }
  }

  if (!customerEmail) {
    return NextResponse.json({ error: "No customer email found" }, { status: 400, headers: corsHeaders });
  }

  const items = (order.order_items as Record<string, unknown>[]) || [];
  const emailItems = items.map((i: Record<string, unknown>) => ({
    name: (i.product_name as string) || "Product",
    qty: (i.quantity as number) || 1,
    price: (i.price as number) || 0,
    variant: (i.variant_name as string) || undefined,
  }));
  const total = (order.total as number) || 0;
  const orderNumber = orderId.slice(0, 8);

  try {
    if (status === "out_for_delivery") {
      const { to, subject, html } = orderOutForDeliveryEmail(orderNumber, customerEmail, emailItems, total);
      await sendEmail(to, subject, html);
    } else if (status === "shipped") {
      const courier = (order.courier as string) || "Standard";
      const trackingId = (order.tracking_number as string) || "";
      const { to, subject, html } = orderShippedEmail(orderNumber, customerEmail, emailItems, total, courier, trackingId);
      await sendEmail(to, subject, html);
    }
  } catch (err) {
    console.error("Failed to send status email:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500, headers: corsHeaders });
  }

  return NextResponse.json({ success: true }, { headers: corsHeaders });
}
