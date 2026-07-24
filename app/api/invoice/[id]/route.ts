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

  const order: any = (Array.isArray(orders) ? orders[0] : null);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const { data: settingsArr } = await supabaseFetch("site_settings?limit=1");
  const settings: any = (Array.isArray(settingsArr) ? settingsArr[0] : {});

  const items: any[] = order.order_items || [];
  const addr = order.shipping_address;
  const address = typeof addr === "string" ? JSON.parse(addr) : addr || {};

  const subtotal = Number(order.subtotal) || 0;
  const discount = Number(order.discount) || 0;
  const shipping = Number(order.shipping) || 0;

  const sellerLegalName = "Nutyum Foods Private Limited";
  const sellerTradeName = (settings.store_name as string) || "Nutyum";
  const sellerGSTIN = (settings.gst_number as string) || "";
  const sellerAddr = (settings.store_address as string) || "Nutyum Foods Pvt. Ltd., Mumbai, Maharashtra";
  const sellerState = "Maharashtra";
  const sellerEmail = (settings.store_email as string) || "support@nutyum.in";
  const sellerPhone = (settings.store_phone as string) || "";

  const deliveryState = ((address.state as string) || "").trim().toLowerCase();
  const sellerStateLower = sellerState.toLowerCase();
  const isIntraState = deliveryState === sellerStateLower;

  const HSN = "20081999";

  const createdDate = new Date(order.created_at as string);
  const invoiceNo = `NUT/${createdDate.getFullYear()}/${(id as string).slice(0, 6).toUpperCase()}`;
  const invoiceDate = createdDate.toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
  const orderDate = invoiceDate;

  const itemsWithCalc = items.map((i: any) => {
    const qty = Number(i.quantity) || 1;
    const price = Number(i.price) || 0;
    const gross = qty * price;
    const propDiscount = subtotal > 0 ? (gross / subtotal) * discount : 0;
    const netAmount = Math.max(0, gross - propDiscount);
    const taxableValue = Math.round((netAmount / 1.18) * 100) / 100;
    const gstAmount = Math.round((netAmount - taxableValue) * 100) / 100;
    const cgst = isIntraState ? gstAmount / 2 : 0;
    const sgst = isIntraState ? gstAmount / 2 : 0;
    const igst = isIntraState ? 0 : gstAmount;
    const lineTotal = taxableValue + gstAmount;
    return { ...i, qty, price, gross, propDiscount, taxableValue, gstAmount, cgst, sgst, igst, lineTotal };
  });

  const totalTaxable = itemsWithCalc.reduce((s: number, i: any) => s + i.taxableValue, 0);
  const totalGst = itemsWithCalc.reduce((s: number, i: any) => s + i.gstAmount, 0);

  let shippingTaxable = 0;
  let shippingGst = 0;
  let shippingCgst = 0;
  let shippingSgst = 0;
  let shippingIgst = 0;
  if (shipping > 0) {
    shippingTaxable = Math.round((shipping / 1.18) * 100) / 100;
    shippingGst = Math.round((shipping - shippingTaxable) * 100) / 100;
    shippingCgst = isIntraState ? shippingGst / 2 : 0;
    shippingSgst = isIntraState ? shippingGst / 2 : 0;
    shippingIgst = isIntraState ? 0 : shippingGst;
  }

  const grandTotal = totalTaxable + totalGst + shippingTaxable + shippingGst;

  const format = (n: number) => "₹" + n.toFixed(2);

  const itemRows = itemsWithCalc.map((i: any) => ` 
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #E5E3D8;font-size:13px;color:#173D22;">${i.product_name || "Product"}${i.variant_name ? `<br><span style="font-size:11px;color:#7A7A7A;">${i.variant_name}</span>` : ""}</td>
      <td style="padding:10px 0;border-bottom:1px solid #E5E3D8;text-align:center;font-size:12px;color:#4C5A48;font-family:monospace;">${HSN}</td>
      <td style="padding:10px 0;border-bottom:1px solid #E5E3D8;text-align:center;font-size:13px;color:#4C5A48;">${i.qty}</td>
      <td style="padding:10px 0;border-bottom:1px solid #E5E3D8;text-align:right;font-size:13px;color:#173D22;">${format(i.gross)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #E5E3D8;text-align:right;font-size:13px;color:#C0392B;">${i.propDiscount > 0 ? `(${format(i.propDiscount)})` : "—"}</td>
      <td style="padding:10px 0;border-bottom:1px solid #E5E3D8;text-align:right;font-size:13px;color:#173D22;">${format(i.taxableValue)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #E5E3D8;text-align:right;font-size:12px;color:#4C5A48;">${format(i.gstAmount)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #E5E3D8;text-align:right;font-size:13px;color:#173D22;font-weight:600;">${format(i.lineTotal)}</td>
    </tr>
  `).join("");

  const shippingRow = shipping > 0 ? ` 
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #E5E3D8;font-size:13px;color:#173D22;">Shipping Charges</td>
      <td style="padding:10px 0;border-bottom:1px solid #E5E3D8;text-align:center;font-size:12px;color:#4C5A48;font-family:monospace;">9965</td>
      <td style="padding:10px 0;border-bottom:1px solid #E5E3D8;text-align:center;font-size:13px;color:#4C5A48;">1</td>
      <td style="padding:10px 0;border-bottom:1px solid #E5E3D8;text-align:right;font-size:13px;color:#173D22;">${format(shipping)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #E5E3D8;text-align:right;font-size:13px;color:#4C5A48;">—</td>
      <td style="padding:10px 0;border-bottom:1px solid #E5E3D8;text-align:right;font-size:13px;color:#173D22;">${format(shippingTaxable)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #E5E3D8;text-align:right;font-size:12px;color:#4C5A48;">${format(shippingGst)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #E5E3D8;text-align:right;font-size:13px;color:#173D22;font-weight:600;">${format(shipping)}</td>
    </tr>
  ` : "";

  const gstSummary = isIntraState
    ? `<span style="display:inline-block;margin-right:20px;font-size:13px;color:#4C5A48;">CGST 9%: ${format(totalGst / 2 + shippingGst / 2)}</span><span style="display:inline-block;font-size:13px;color:#4C5A48;">SGST 9%: ${format(totalGst / 2 + shippingGst / 2)}</span>`
    : `<span style="display:inline-block;font-size:13px;color:#4C5A48;">IGST 18%: ${format(totalGst + shippingGst)}</span>`;

  const supportContact = [sellerPhone, sellerEmail].filter(Boolean).join(" | ");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Tax Invoice #${(id as string).slice(0, 8)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 30px; background: #F6F5F0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .invoice { max-width: 794px; margin: 0 auto; background: #FFFEFB; border-radius: 20px; padding: 44px 48px; box-shadow: 0 4px 24px rgba(0,0,0,.06); }
  h1 { font-family: Georgia, 'Times New Roman', serif; color: #173D22; font-size: 26px; margin: 0; letter-spacing: 0.5px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 2px solid #173D22; }
  .header-left { max-width: 55%; }
  .header-right { text-align: right; }
  .inv-table { display: inline-table; border-collapse: collapse; }
  .inv-table td { padding: 2px 0; white-space: nowrap; }
  .inv-table td.il { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #8A9A8C; padding-right: 14px; text-align: left; }
  .inv-table td.iv { font-size: 14px; color: #173D22; text-align: right; }
  .seller-name { font-size: 15px; font-weight: 700; color: #173D22; margin-bottom: 2px; }
  .seller-detail { font-size: 12px; color: #4C5A48; line-height: 1.6; }
  .inv-meta { font-size: 13px; color: #173D22; line-height: 1.8; }
  .inv-meta strong { font-weight: 600; }
  .inv-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #8A9A8C; }
  .addr-grid { display: flex; gap: 16px; margin-bottom: 28px; }
  .addr-block { flex: 1; background: #FAF7EE; border-radius: 12px; padding: 14px 18px; font-size: 13px; color: #4C5A48; line-height: 1.6; }
  .addr-block strong { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8A9A8C; margin-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #8A9A8C; padding: 8px 0 6px; border-bottom: 2px solid #173D22; white-space: nowrap; }
  th.right { text-align: right; }
  th.center { text-align: center; }
  .total-section { text-align: right; margin-top: 8px; padding-top: 12px; border-top: 2px solid #173D22; }
  .total-row { font-size: 15px; font-weight: 700; color: #173D22; }
  .total-row span { margin-left: 16px; }
  .gst-breakup { margin-top: 16px; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #E5E3D8; font-size: 11px; color: #8A9A8C; text-align: center; line-height: 1.7; }
  .footer strong { color: #4C5A48; font-weight: 600; }
  @media print {
    body { background: #fff; padding: 0; }
    .invoice { box-shadow: none; border-radius: 0; padding: 32px; }
  }
</style>
</head>
<body>
<div class="invoice">

  <div class="header">
    <div class="header-left">
      <h1>Tax Invoice</h1>
      <div class="seller-name">${sellerLegalName}</div>
      <div class="seller-detail">
        GSTIN: ${sellerGSTIN || "<span style='color:#C0392B;'>Not available</span>"}<br>
        ${sellerAddr}
      </div>
    </div>
    <div class="header-right">
      <table class="inv-table">
        <tr><td class="il">Invoice No.</td><td class="iv">${invoiceNo}</td></tr>
        <tr><td class="il">Invoice Date</td><td class="iv">${invoiceDate}</td></tr>
        <tr><td class="il">Order ID</td><td class="iv">#${(id as string).slice(0, 8).toUpperCase()}</td></tr>
        <tr><td class="il">Order Date</td><td class="iv">${orderDate}</td></tr>
      </table>
    </div>
  </div>

  <div class="addr-grid">
    <div class="addr-block">
      <strong>Bill To</strong>
      ${address.recipient_name || address.name || "Customer"}<br>
      ${address.line1 || ""}${address.line2 ? `, ${address.line2}` : ""}<br>
      ${address.city || ""}, ${address.state || ""} — ${address.pincode || ""}<br>
      ${address.phone || ""}<br>
      ${address.recipient_email ? address.recipient_email : ""}
    </div>
    <div class="addr-block">
      <strong>Ship To</strong>
      ${address.recipient_name || address.name || "Customer"}<br>
      ${address.line1 || ""}${address.line2 ? `, ${address.line2}` : ""}<br>
      ${address.city || ""}, ${address.state || ""} — ${address.pincode || ""}<br>
      ${address.phone || ""}
    </div>
  </div>

  <table>
    <tr>
      <th style="width:26%;">Description</th>
      <th style="width:10%;" class="center">HSN/SAC</th>
      <th style="width:6%;" class="center">Qty</th>
      <th style="width:13%;" class="right">Gross Amt</th>
      <th style="width:12%;" class="right">Discount</th>
      <th style="width:13%;" class="right">Taxable Value</th>
      <th style="width:9%;" class="right">GST</th>
      <th style="width:11%;" class="right">Total</th>
    </tr>
    ${itemRows}
    ${shippingRow}
  </table>

  <div class="total-section">
    <div class="gst-breakup">${gstSummary}</div>
    <div class="total-row" style="margin-top:10px;">
      Grand Total: <span>${format(grandTotal)}</span>
    </div>
  </div>

  <div class="footer">
    This is a computer-generated invoice; no signature required.<br>
    <strong>${sellerTradeName}</strong> — ${sellerAddr}<br>
    ${supportContact ? `Contact: ${supportContact}<br>` : ""}
    Nutyum — Premium Roasted Makhana &bull; Thank you for your order!
  </div>

</div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
