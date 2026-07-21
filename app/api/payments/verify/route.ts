import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch, getErrorMessage } from "@/lib/supabase-fetch";
import { orderConfirmationEmail, sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body;

    // Verify signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
    }

    const expectedSig = await crypto.subtle
      .importKey("raw", new TextEncoder().encode(keySecret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
      .then((key) => crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${razorpayOrderId}|${razorpayPaymentId}`)))
      .then((sig) => Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join(""));

    if (expectedSig !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Update order status
    const { error: updateErr } = await supabaseFetch(
      `orders?id=eq.${orderId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "confirmed",
          payment_status: "paid",
          notes: `RzpPayId:${razorpayPaymentId}|RzpSig:${razorpaySignature}`,
        }),
      }
    );

    if (updateErr) {
      console.error("Failed to update order:", updateErr);
      return NextResponse.json({ error: getErrorMessage(updateErr) || "Failed to update order" }, { status: 500 });
    }

    // Add status log
    await supabaseFetch("order_status_logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: orderId,
        status: "confirmed",
        note: "Payment confirmed",
      }),
    });

    // Send confirmation email
    if (session.user.email) {
      try {
        const { data: orderData } = await supabaseFetch(
          `orders?id=eq.${orderId}&select=*,order_items(*)`
        );
        const order = (Array.isArray(orderData) ? orderData[0] : null) as Record<string, unknown> | null;
        if (order) {
          const items = (order.order_items as Record<string, unknown>[]) || [];
          const itemsForEmail = items.map((i: Record<string, unknown>) => ({
            name: (i.product_name as string) || "Product",
            qty: (i.quantity as number) || 1,
            price: (i.price as number) || 0,
          }));
          const total = (order.total as number) || 0;
          const email = orderConfirmationEmail(
            orderId.slice(0, 8).toUpperCase(),
            session.user.email,
            itemsForEmail,
            total,
          );
          await sendEmail(email.to, email.subject, email.html);
        }
      } catch (e) {
        console.error("Failed to send confirmation email:", e);
      }
    }

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error("Payment verification error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
