import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch } from "@/lib/supabase-fetch";
import React from "react";
import { Document, Page, View, Text, StyleSheet, renderToStream } from "@react-pdf/renderer";

const HSN = "20081999";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#FFFEFB",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#4C5A48",
  },
  title: {
    fontFamily: "Times-Roman",
    fontSize: 24,
    color: "#173D22",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#173D22",
  },
  sellerName: { fontSize: 13, fontWeight: 700, color: "#173D22", marginBottom: 2 },
  sellerDetail: { fontSize: 10, color: "#4C5A48", lineHeight: 1.6 },
  metaRow: { flexDirection: "row" },
  metaLabel: {
    fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5,
    color: "#8A9A8C", width: 90, paddingRight: 8,
    paddingTop: 1, paddingBottom: 1,
  },
  metaValue: { fontSize: 11, color: "#173D22", textAlign: "right", paddingTop: 1, paddingBottom: 1 },
  addrGrid: { flexDirection: "row", gap: 12, marginBottom: 24 },
  addrBlock: {
    flex: 1, backgroundColor: "#FAF7EE", padding: 12, borderRadius: 8,
    fontSize: 10, lineHeight: 1.6, color: "#4C5A48",
  },
  addrLabel: { fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5, color: "#8A9A8C", marginBottom: 2 },
  tableHeader: {
    flexDirection: "row", borderBottomWidth: 2, borderBottomColor: "#173D22",
    paddingBottom: 6, marginBottom: 4,
  },
  th: { fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5, color: "#8A9A8C" },
  row: {
    flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E5E3D8",
    paddingVertical: 8, alignItems: "center",
  },
  cellDesc: { width: "24%" },
  cellHsn: { width: "10%", textAlign: "center" },
  cellQty: { width: "6%", textAlign: "center" },
  cellRight: { width: "13%", textAlign: "right" },
  cellGst: { width: "9%", textAlign: "right" },
  cellTotal: { width: "11%", textAlign: "right", fontWeight: 700 },
  variantText: { fontSize: 9, color: "#7A7A7A", marginTop: 1 },
  totalsSection: {
    marginTop: 4, paddingTop: 10, borderTopWidth: 2,
    borderTopColor: "#173D22", alignItems: "flex-end",
  },
  gstRow: { flexDirection: "row", gap: 16, marginBottom: 8 },
  gstText: { fontSize: 11, color: "#4C5A48" },
  grandTotal: { fontSize: 14, fontWeight: 700, color: "#173D22", flexDirection: "row" },
  grandTotalLabel: { marginRight: 12 },
  footer: {
    marginTop: 28, paddingTop: 14, borderTopWidth: 1, borderTopColor: "#E5E3D8",
    fontSize: 9, color: "#8A9A8C", textAlign: "center", lineHeight: 1.7,
  },
  footerStrong: { color: "#4C5A48", fontWeight: 700 },
  discountText: { color: "#C0392B" },
  headerLeft: { maxWidth: "55%" },
});

const fmt = (n: number) => "₹" + n.toFixed(2);

function InvoiceDocument({ id, order, settings, session }: any) {
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
  const isIntraState = deliveryState === sellerState.toLowerCase();

  const createdDate = new Date(order.created_at as string);
  const invoiceNo = `NUT/${createdDate.getFullYear()}/${(id as string).slice(0, 6).toUpperCase()}`;
  const dateStr = createdDate.toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  const itemsWithCalc = items.map((i: any) => {
    const qty = Number(i.quantity) || 1;
    const price = Number(i.price) || 0;
    const gross = qty * price;
    const propDiscount = subtotal > 0 ? (gross / subtotal) * discount : 0;
    const netAmount = Math.max(0, gross - propDiscount);
    const taxableValue = Math.round((netAmount / 1.18) * 100) / 100;
    const gstAmount = Math.round((netAmount - taxableValue) * 100) / 100;
    const lineTotal = taxableValue + gstAmount;
    return { ...i, qty, price, gross, propDiscount, taxableValue, gstAmount, lineTotal };
  });

  const totalTaxable = itemsWithCalc.reduce((s: number, i: any) => s + i.taxableValue, 0);
  const totalGst = itemsWithCalc.reduce((s: number, i: any) => s + i.gstAmount, 0);

  let shippingTaxable = 0;
  let shippingGst = 0;
  if (shipping > 0) {
    shippingTaxable = Math.round((shipping / 1.18) * 100) / 100;
    shippingGst = Math.round((shipping - shippingTaxable) * 100) / 100;
  }

  const grandTotal = totalTaxable + totalGst + shippingTaxable + shippingGst;
  const supportContact = [sellerPhone, sellerEmail].filter(Boolean).join(" | ");
  const recipientName = address.recipient_name || address.name || session.user.name || "Customer";

  const addrLine2 = [
    address.line1 || "",
    address.line2 ? `, ${address.line2}` : "",
  ].join("");
  const addrCityState = [
    address.city || "",
    address.state ? `, ${address.state}` : "",
    address.pincode ? ` — ${address.pincode}` : "",
  ].join("");

  const metaData = [
    { label: "Invoice No.", value: invoiceNo },
    { label: "Invoice Date", value: dateStr },
    { label: "Order ID", value: `#${(id as string).slice(0, 8).toUpperCase()}` },
    { label: "Order Date", value: dateStr },
  ];

  return React.createElement(Document, null,
    React.createElement(Page, { size: "A4", style: styles.page },

      // Header
      React.createElement(View, { style: styles.headerRow },
        React.createElement(View, { style: styles.headerLeft },
          React.createElement(Text, { style: styles.title }, "Tax Invoice"),
          React.createElement(Text, { style: styles.sellerName }, sellerLegalName),
          React.createElement(Text, { style: styles.sellerDetail }, `GSTIN: ${sellerGSTIN || "N/A"}`),
          React.createElement(Text, { style: styles.sellerDetail }, sellerAddr),
        ),
        React.createElement(View, null,
          metaData.map((m, i) =>
            React.createElement(View, { key: i, style: styles.metaRow },
              React.createElement(Text, { style: styles.metaLabel }, m.label),
              React.createElement(Text, { style: styles.metaValue }, m.value),
            )
          ),
        ),
      ),

      // Addresses
      React.createElement(View, { style: styles.addrGrid },
        React.createElement(View, { style: styles.addrBlock },
          React.createElement(Text, { style: styles.addrLabel }, "Bill To"),
          React.createElement(Text, null, recipientName),
          React.createElement(Text, null, addrLine2),
          React.createElement(Text, null, addrCityState),
          React.createElement(Text, null, address.recipient_phone || address.phone || ""),
          React.createElement(Text, null, address.recipient_email || session.user.email || ""),
        ),
        React.createElement(View, { style: styles.addrBlock },
          React.createElement(Text, { style: styles.addrLabel }, "Ship To"),
          React.createElement(Text, null, recipientName),
          React.createElement(Text, null, addrLine2),
          React.createElement(Text, null, addrCityState),
          React.createElement(Text, null, address.recipient_phone || address.phone || ""),
        ),
      ),

      // Table header
      React.createElement(View, { style: styles.tableHeader },
        React.createElement(Text, { style: [styles.th, styles.cellDesc] }, "Description"),
        React.createElement(Text, { style: [styles.th, styles.cellHsn] }, "HSN/SAC"),
        React.createElement(Text, { style: [styles.th, styles.cellQty] }, "Qty"),
        React.createElement(Text, { style: [styles.th, styles.cellRight] }, "Gross Amt"),
        React.createElement(Text, { style: [styles.th, styles.cellRight] }, "Discount"),
        React.createElement(Text, { style: [styles.th, styles.cellRight] }, "Taxable Val"),
        React.createElement(Text, { style: [styles.th, styles.cellGst] }, "GST"),
        React.createElement(Text, { style: [styles.th, styles.cellTotal] }, "Total"),
      ),

      // Item rows
      ...itemsWithCalc.map((i: any, idx: number) =>
        React.createElement(View, { key: idx, style: styles.row },
          React.createElement(View, { style: styles.cellDesc },
            React.createElement(Text, null, i.product_name || "Product"),
            i.variant_name ? React.createElement(Text, { style: styles.variantText }, i.variant_name) : null,
          ),
          React.createElement(Text, { style: styles.cellHsn }, HSN),
          React.createElement(Text, { style: styles.cellQty }, String(i.qty)),
          React.createElement(Text, { style: styles.cellRight }, fmt(i.gross)),
          React.createElement(Text, { style: [styles.cellRight, i.propDiscount > 0 ? styles.discountText : {}] },
            i.propDiscount > 0 ? `(${fmt(i.propDiscount)})` : "—"
          ),
          React.createElement(Text, { style: styles.cellRight }, fmt(i.taxableValue)),
          React.createElement(Text, { style: styles.cellGst }, fmt(i.gstAmount)),
          React.createElement(Text, { style: styles.cellTotal }, fmt(i.lineTotal)),
        )
      ),

      // Shipping row
      ...(shipping > 0
        ? [React.createElement(View, { key: "shipping", style: styles.row },
            React.createElement(View, { style: styles.cellDesc },
              React.createElement(Text, null, "Shipping Charges"),
            ),
            React.createElement(Text, { style: styles.cellHsn }, "9965"),
            React.createElement(Text, { style: styles.cellQty }, "1"),
            React.createElement(Text, { style: styles.cellRight }, fmt(shipping)),
            React.createElement(Text, { style: styles.cellRight }, "—"),
            React.createElement(Text, { style: styles.cellRight }, fmt(shippingTaxable)),
            React.createElement(Text, { style: styles.cellGst }, fmt(shippingGst)),
            React.createElement(Text, { style: styles.cellTotal }, fmt(shipping)),
          )]
        : []
      ),

      // Totals
      React.createElement(View, { style: styles.totalsSection },
        React.createElement(View, { style: styles.gstRow },
          isIntraState
            ? [
                React.createElement(Text, { key: "cgst", style: styles.gstText },
                  `CGST 9%: ${fmt(totalGst / 2 + shippingGst / 2)}`
                ),
                React.createElement(Text, { key: "sgst", style: styles.gstText },
                  `SGST 9%: ${fmt(totalGst / 2 + shippingGst / 2)}`
                ),
              ]
            : React.createElement(Text, { style: styles.gstText },
                `IGST 18%: ${fmt(totalGst + shippingGst)}`
              ),
        ),
        React.createElement(View, { style: styles.grandTotal },
          React.createElement(Text, { style: styles.grandTotalLabel }, "Grand Total:"),
          React.createElement(Text, null, fmt(grandTotal)),
        ),
      ),

      // Footer
      React.createElement(View, { style: styles.footer },
        React.createElement(Text, null, "This is a computer-generated invoice; no signature required."),
        React.createElement(Text, null,
          React.createElement(Text, { style: styles.footerStrong }, sellerTradeName),
          ` — ${sellerAddr}`,
        ),
        supportContact ? React.createElement(Text, null, `Contact: ${supportContact}`) : null,
        React.createElement(Text, null, "Nutyum — Premium Roasted Makhana \u2022 Thank you for your order!"),
      ),
    ),
  );
}

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

  try {
    const pdfStream = await renderToStream(
      React.createElement(InvoiceDocument, { id, order, settings, session })
    );

    const chunks: Buffer[] = [];
    for await (const chunk of pdfStream as any) {
      chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="nutyum-invoice-${id.slice(0, 8)}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (err: any) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
