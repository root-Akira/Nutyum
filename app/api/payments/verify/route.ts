import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch, getErrorMessage } from "@/lib/supabase-fetch";
import { sendEmail } from "@/lib/email";

function baseHtml(content: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <style>
      body{margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
      .container{max-width:600px;margin:0 auto;background:#ffffff}
      .header{background:linear-gradient(135deg,#173D22,#1f4d2e);padding:40px 48px;text-align:center}
      .header img{width:60px;height:60px;border-radius:50%;margin-bottom:12px}
      .header h1{color:#fff;margin:0;font-size:24px;font-weight:700}
      .header p{color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:16px}
      .content{padding:40px 48px}
      .content h2{color:#173D22;font-size:20px;margin:0 0 20px}
      .content p{color:#5C665E;font-size:16px;line-height:28px;margin:0 0 16px}
      .btn{display:inline-block;background:#173D22;color:#fff!important;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;margin:16px 0}
      .footer{background:#173D22;padding:24px 48px;text-align:center}
      .footer p{color:rgba(255,255,255,0.7);font-size:13px;margin:0}
      .items-table{width:100%;border-collapse:collapse;margin:20px 0}
      .items-table th{text-align:left;padding:8px 12px;border-bottom:1px solid #e0e0e0;font-size:13px;color:#7A7A7A}
      .items-table td{padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:15px;color:#333}
      .total-row td{font-weight:700;color:#173D22;font-size:16px}
    </style>
    </head>
    <body><div class="container">${content}</div></body>
    </html>`;
}

function heroHtml(title: string, subtitle: string) {
  return `
    <div class="header">
      <img src="https://jemypvfnlazkrvrmzcaz.supabase.co/storage/v1/object/public/product-images/logo.png" alt="Nutyum">
      <h1>${title}</h1>
      <p>${subtitle}</p>
    </div>`;
}

function bodyHtml(message: string, details: string, btn?: string) {
  return `
    <div class="content">
      <p>${message}</p>
      <p style="color:#5C665E;font-size:15px;line-height:26px">${details}</p>
      ${btn || ""}
    </div>`;
}

function btnHtml(url: string, text: string) {
  return `<a href="${url}" class="btn">${text}</a>`;
}

function orderItemsHtml(items: { name: string; qty: number; price: number }[], total: number) {
  let rows = items.map(i => `
    <tr>
      <td>${i.name} × ${i.qty}</td>
      <td style="text-align:right">₹${i.price}</td>
    </tr>`).join("");

  return `
    <div class="content" style="padding-top:0">
      <table class="items-table">
        <tr><th>Item</th><th style="text-align:right">Price</th></tr>
        ${rows}
        <tr class="total-row"><td>Total</td><td style="text-align:right">₹${total}</td></tr>
      </table>
    </div>`;
}

function footerHtml() {
  return `
    <div class="footer">
      <p>© ${new Date().getFullYear()} Nutyum. All rights reserved.</p>
      <p style="margin-top:4px">Premium roasted makhana, crafted for healthier snacking.</p>
    </div>`;
}

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
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
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
        const orderNumber = orderId.slice(0, 8).toUpperCase();

        const emailHtml = baseHtml(`
          ${heroHtml("Order Confirmed! 🎉", "Your makhana is on its way!")}
          ${bodyHtml(
            `Hi ${session.user.name || "there"},`,
            `Your order <strong>#${orderNumber}</strong> has been confirmed. We'll notify you once it's shipped.`,
            btnHtml(`https://nutyum.in/account/orders/${orderId}`, "View Order")
          )}
          ${orderItemsHtml(itemsForEmail, total)}
          ${footerHtml()}
        `);

        try {
          await sendEmail(session.user.email, "Order Confirmed — Nutyum", emailHtml);
        } catch (e) {
          console.error("Failed to send confirmation email:", e);
        }
      }
    }

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error("Payment verification error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
