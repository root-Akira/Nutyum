import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch } from "@/lib/supabase-fetch";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: orders } = await supabaseFetch(
    `orders?id=eq.${id}&user_id=eq.${session.user.id}&select=*,order_items(*)`
  );

  const order = (Array.isArray(orders) ? orders[0] : null) as Record<string, unknown> | null;
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const items = (order.order_items as Record<string, unknown>[]) || [];
  const addr = order.shipping_address;
  const address = typeof addr === "string" ? JSON.parse(addr) : addr || {};

  const itemsRows = items.map((i) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #ECECEC;font-size:14px;color:#173D22;">${i.product_name || "Product"}${i.variant_name ? `<br><span style="font-size:12px;color:#7A7A7A;">${i.variant_name}</span>` : ""}</td>
      <td style="padding:10px 0;border-bottom:1px solid #ECECEC;text-align:center;font-size:14px;color:#4C5A48;">${i.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #ECECEC;text-align:right;font-size:14px;color:#173D22;">₹${Number(i.price).toFixed(2)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #ECECEC;text-align:right;font-size:14px;color:#173D22;font-weight:600;">₹${(Number(i.price) * Number(i.quantity)).toFixed(2)}</td>
    </tr>
  `).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Invoice #${(id as string).slice(0, 8)}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 40px; background: #F6F5F0; }
  .invoice { max-width: 700px; margin: 0 auto; background: #fff; border-radius: 24px; padding: 48px; box-shadow: 0 4px 20px rgba(0,0,0,.06); }
  h1 { font-family: Georgia, serif; color: #173D22; font-size: 28px; margin: 0 0 4px; }
  .meta { color: #4C5A48; font-size: 14px; margin-bottom: 32px; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 12px; text-transform: uppercase; color: #8A9A8C; padding-bottom: 8px; border-bottom: 2px solid #173D22; }
  .total-row td { padding-top: 16px; font-weight: 700; font-size: 16px; color: #173D22; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ECECEC; font-size: 13px; color: #8A9A8C; text-align: center; }
  .addr { font-size: 14px; color: #4C5A48; margin-bottom: 32px; padding: 16px; background: #FAF7EE; border-radius: 12px; }
</style></head>
<body>
<div class="invoice">
  <h1>Invoice</h1>
  <p class="meta">Order #${(id as string).slice(0, 8).toUpperCase()} | ${new Date(order.created_at as string).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>

  <div class="addr">
    <strong style="color:#173D22;">Delivered to</strong><br>
    ${address.recipient_name || address.name || ""}<br>
    ${address.line1 || ""}${address.line2 ? `, ${address.line2}` : ""}<br>
    ${address.city || ""}, ${address.state || ""} — ${address.pincode || ""}<br>
    ${address.phone || ""}
  </div>

  <table>
    <tr><th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Price</th><th style="text-align:right;">Total</th></tr>
    ${itemsRows}
    <tr class="total-row">
      <td colspan="3" style="text-align:right;">Total</td>
      <td style="text-align:right;">₹${Number(order.total).toFixed(2)}</td>
    </tr>
  </table>

  <div class="footer">
    Nutyum — Premium Roasted Makhana<br>
    Thank you for your order!
  </div>
</div>
</body></html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
