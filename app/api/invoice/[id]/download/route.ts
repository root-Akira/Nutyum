import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch } from "@/lib/supabase-fetch";

function format(n: number) {
  return "₹" + n.toFixed(2);
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
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

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
  const isIntraState = deliveryState === sellerState.toLowerCase();

  const createdDate = new Date(order.created_at as string);
  const invoiceNo = `NUT/${createdDate.getFullYear()}/${(id as string).slice(0, 6).toUpperCase()}`;
  const invoiceDate = createdDate.toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
  const orderDate = invoiceDate;

  const HSN = "20081999";

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
  if (shipping > 0) {
    shippingTaxable = Math.round((shipping / 1.18) * 100) / 100;
    shippingGst = Math.round((shipping - shippingTaxable) * 100) / 100;
  }

  const grandTotal = totalTaxable + totalGst + shippingTaxable + shippingGst;
  const discountAmt = itemsWithCalc.reduce((s: number, i: any) => s + i.propDiscount, 0);

  const recipientName = address.recipient_name || address.name || session.user.name || "Customer";
  const recipientPhone = address.recipient_phone || address.phone || "";
  const recipientEmail = session.user.email || address.recipient_email || "";

  const gstText = isIntraState
    ? `CGST 9%: ${format(totalGst / 2 + shippingGst / 2)}    SGST 9%: ${format(totalGst / 2 + shippingGst / 2)}`
    : `IGST 18%: ${format(totalGst + shippingGst)}`;

  const supportContact = [sellerPhone, sellerEmail].filter(Boolean).join(" | ");

  const itemRows = itemsWithCalc.map((i: any) => [
    { text: i.product_name || "Product", style: "itemDesc", margin: [0, 4, 0, 0] },
    { text: HSN, alignment: "center", fontSize: 9, color: "#4C5A48", font: "Helvetica" },
    { text: String(i.qty), alignment: "center", fontSize: 11, color: "#4C5A48" },
    { text: format(i.gross), alignment: "right", fontSize: 11, color: "#173D22" },
    {
      text: i.propDiscount > 0 ? `(${format(i.propDiscount)})` : "—",
      alignment: "right",
      fontSize: 11,
      color: i.propDiscount > 0 ? "#C0392B" : "#4C5A48",
    },
    { text: format(i.taxableValue), alignment: "right", fontSize: 11, color: "#173D22" },
    { text: format(i.gstAmount), alignment: "right", fontSize: 9, color: "#4C5A48" },
    { text: format(i.lineTotal), alignment: "right", fontSize: 11, bold: true, color: "#173D22" },
  ]);

  const shippingRow = shipping > 0 ? [
    { text: "Shipping Charges", style: "itemDesc" },
    { text: "9965", alignment: "center", fontSize: 9, color: "#4C5A48" },
    { text: "1", alignment: "center", fontSize: 11, color: "#4C5A48" },
    { text: format(shipping), alignment: "right", fontSize: 11, color: "#173D22" },
    { text: "—", alignment: "right", fontSize: 11, color: "#4C5A48" },
    { text: format(shippingTaxable), alignment: "right", fontSize: 11, color: "#173D22" },
    { text: format(shippingGst), alignment: "right", fontSize: 9, color: "#4C5A48" },
    { text: format(shipping), alignment: "right", fontSize: 11, bold: true, color: "#173D22" },
  ] : null;

  const addressLines = [
    recipientName,
    [address.line1, address.line2].filter(Boolean).join(", "),
    [address.city, address.state, `— ${address.pincode || ""}`].filter(Boolean).join(", "),
  ].filter((l) => l);

  const addressLinesWithPhone = recipientPhone
    ? [...addressLines, recipientPhone]
    : addressLines;

  const pdfmakeFonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
    Times: {
      normal: "Times-Roman",
      bold: "Times-Bold",
      italics: "Times-Italic",
      bolditalics: "Times-BoldItalic",
    },
  };

  const pdfmake = require("pdfmake");
  pdfmake.fonts = pdfmakeFonts;

  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [48, 40, 48, 40],
    defaultStyle: { font: "Helvetica", fontSize: 11, color: "#4C5A48" },
    content: [
      { text: "Tax Invoice", style: "title" },
      { text: sellerLegalName, style: "sellerName", margin: [0, 2, 0, 0] },
      { text: `GSTIN: ${sellerGSTIN || "Not available"}`, style: "small" },
      { text: sellerAddr, style: "small", margin: [0, 0, 0, 20] },
      {
        columns: [
          {
            width: "48%",
            stack: [
              { text: "BILL TO", style: "label" },
              { text: recipientName, margin: [0, 4, 0, 0] },
              ...addressLines.slice(1).map((l: string) => ({ text: l, margin: [0, 0, 0, 0] })),
              recipientPhone ? { text: recipientPhone, margin: [0, 0, 0, 0] } : null,
              recipientEmail ? { text: recipientEmail, color: "#173D22", margin: [0, 0, 0, 0] } : null,
            ].filter(Boolean),
          },
          { width: "3%", text: "" },
          {
            width: "49%",
            alignment: "right",
            stack: [
              { text: "INVOICE NO.", style: "metaLabel" },
              { text: invoiceNo, style: "metaValue", margin: [0, 0, 0, 10] },
              { text: "INVOICE DATE", style: "metaLabel" },
              { text: invoiceDate, style: "metaValue", margin: [0, 0, 0, 10] },
              { text: "ORDER ID", style: "metaLabel" },
              { text: `#${(id as string).slice(0, 8).toUpperCase()}`, style: "metaValue" },
              { text: "ORDER DATE", style: "metaLabel", margin: [0, 10, 0, 0] },
              { text: orderDate, style: "metaValue" },
            ],
          },
        ],
        margin: [0, 0, 0, 24],
      },
      {
        columns: [
          {
            width: "48%",
            stack: [
              { text: "SHIP TO", style: "label" },
              { text: recipientName, margin: [0, 4, 0, 0] },
              ...addressLines.slice(1).map((l: string) => ({ text: l, margin: [0, 0, 0, 0] })),
              recipientPhone ? { text: recipientPhone, margin: [0, 0, 0, 0] } : null,
            ].filter(Boolean),
          },
        ],
        margin: [0, 0, 0, 24],
      },
      {
        table: {
          headerRows: 1,
          widths: ["26%", "10%", "6%", "13%", "12%", "13%", "9%", "11%"],
          body: [
            [
              { text: "Description", style: "th" },
              { text: "HSN/SAC", style: "th", alignment: "center" },
              { text: "Qty", style: "th", alignment: "center" },
              { text: "Gross Amt", style: "th", alignment: "right" },
              { text: "Discount", style: "th", alignment: "right" },
              { text: "Taxable Value", style: "th", alignment: "right" },
              { text: "GST", style: "th", alignment: "right" },
              { text: "Total", style: "th", alignment: "right" },
            ],
            ...itemRows,
            ...(shippingRow ? [shippingRow] : []),
          ],
        },
        layout: {
          hLineWidth: (_i: number, node: any) =>
            _i === 0 || _i === node.table.body.length ? 2 : 1,
          vLineWidth: () => 0,
          hLineColor: (_i: number) => (_i === 0 ? "#173D22" : "#E5E3D8"),
          paddingLeft: () => 4,
          paddingRight: () => 4,
          paddingTop: () => 8,
          paddingBottom: () => 8,
        },
      },
      {
        columns: [
          { width: "*", text: "" },
          {
            width: "auto",
            stack: [
              discountAmt > 0
                ? { text: `Total Discount: ${format(discountAmt)}`, style: "discountLine" }
                : null,
              { text: gstText, style: "gstLine" },
              {
                columns: [
                  { width: "*", text: "" },
                  {
                    width: "auto",
                    text: `Grand Total: ${format(grandTotal)}`,
                    style: "grandTotal",
                  },
                ],
                margin: [0, 10, 0, 0],
              },
            ].filter(Boolean),
          },
        ],
        margin: [0, 0, 0, 0],
      },
      {
        text: [
          { text: "This is a computer-generated invoice; no signature required.\n", style: "footerText" },
          { text: sellerTradeName, bold: true, fontSize: 10, color: "#4C5A48" },
          { text: ` — ${sellerAddr}\n`, style: "footerText" },
          supportContact ? { text: `Contact: ${supportContact}\n`, style: "footerText" } : null,
          { text: "Nutyum — Premium Roasted Makhana • Thank you for your order!", style: "footerText" },
        ].filter(Boolean),
        alignment: "center",
        margin: [0, 28, 0, 0],
      },
    ],
    styles: {
      title: {
        fontSize: 26,
        font: "Times",
        bold: true,
        color: "#173D22",
        margin: [0, 0, 0, 2],
      },
      sellerName: { fontSize: 15, bold: true, color: "#173D22" },
      small: { fontSize: 11, color: "#4C5A48" },
      label: { fontSize: 10, bold: true, color: "#8A9A8C", margin: [0, 0, 0, 4] },
      metaLabel: {
        fontSize: 9,
        bold: true,
        color: "#8A9A8C",
        margin: [0, 0, 0, 2],
      },
      metaValue: { fontSize: 13, color: "#173D22" },
      th: {
        fontSize: 10,
        bold: true,
        color: "#8A9A8C",
      },
      itemDesc: {
        fontSize: 12,
        color: "#173D22",
        margin: [0, 4, 0, 0],
      },
      gstLine: {
        fontSize: 11,
        color: "#4C5A48",
        margin: [0, 12, 0, 0],
        alignment: "right",
      },
      discountLine: {
        fontSize: 11,
        color: "#C0392B",
        margin: [0, 8, 0, 0],
        alignment: "right",
      },
      grandTotal: {
        fontSize: 15,
        bold: true,
        color: "#173D22",
      },
      footerText: {
        fontSize: 10,
        color: "#8A9A8C",
      },
    },
  } as any;

  const doc = pdfmake.createPdf(docDefinition);
  const pdfBuffer: Buffer = await doc.getBuffer();

  return new NextResponse(new Blob([pdfBuffer as unknown as BlobPart]), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="nutyum-invoice-${(id as string).slice(0, 8)}.pdf"`,
      "Content-Length": String(pdfBuffer.length),
    },
  });
}
