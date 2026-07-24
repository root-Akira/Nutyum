import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch } from "@/lib/supabase-fetch";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const GREEN = rgb(0.09, 0.24, 0.13);      // #173D22
const TEXT = rgb(0.30, 0.35, 0.28);         // #4C5A48
const LABEL = rgb(0.54, 0.60, 0.55);        // #8A9A8C
const CREAM = rgb(0.98, 0.97, 0.94);        // #FAF7EE
const WHITE = rgb(1, 1, 1);
const RED = rgb(0.75, 0.22, 0.17);          // #C0392B
const BORDER = rgb(0.9, 0.89, 0.85);        // #E5E3D8

const MARGIN = 50;
const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const FONT_SIZE = 9;
const HEADER_FONT_SIZE = 22;

const fmt = (n: number) => "Rs. " + n.toFixed(2);

function parseAddr(addr: unknown) {
  if (typeof addr === "string") { try { return JSON.parse(addr); } catch { return {}; } }
  return (addr as Record<string, unknown>) || {};
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

  const items: any[] = order.order_items || [];
  const address = parseAddr(order.shipping_address);

  const subtotal = Number(order.subtotal) || 0;
  const discount = Number(order.discount) || 0;
  const shipping = Number(order.shipping) || 0;

  const sellerLegalName = "Nutyum Foods Private Limited";
  const sellerTradeName = (settings.store_name as string) || "Nutyum";
  const sellerGSTIN = (settings.gst_number as string) || "";
  const sellerAddr = (settings.store_address as string) || "Nutyum Foods Pvt. Ltd., Mumbai, Maharashtra";
  const sellerEmail = (settings.store_email as string) || "support@nutyum.in";
  const sellerPhone = (settings.store_phone as string) || "";

  const deliveryState = ((address.state as string) || "").trim().toLowerCase();
  const isIntraState = deliveryState === "maharashtra";

  const createdDate = new Date(order.created_at as string);
  const invoiceNo = `NUT/${createdDate.getFullYear()}/${id.slice(0, 6).toUpperCase()}`;
  const dateStr = createdDate.toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  const itemsWithCalc = items.map((i: any) => {
    const qty = Number(i.quantity) || 1;
    const price = Number(i.price) || 0;
    const gross = qty * price;
    const propDiscount = subtotal > 0 ? (gross / subtotal) * discount : 0;
    const netAmount = Math.max(0, gross - propDiscount);
    const taxableValue = Number((netAmount / 1.18).toFixed(2));
    const gstAmount = Number((netAmount - taxableValue).toFixed(2));
    const lineTotal = taxableValue + gstAmount;
    return { ...i, qty, price, gross, propDiscount, taxableValue, gstAmount, lineTotal };
  });

  const totalTaxable = itemsWithCalc.reduce((s: number, i: any) => s + i.taxableValue, 0);
  const totalGst = itemsWithCalc.reduce((s: number, i: any) => s + i.gstAmount, 0);

  let shippingTaxable = 0, shippingGst = 0;
  if (shipping > 0) {
    shippingTaxable = Number((shipping / 1.18).toFixed(2));
    shippingGst = Number((shipping - shippingTaxable).toFixed(2));
  }

  const grandTotal = totalTaxable + totalGst + shippingTaxable + shippingGst;
  const supportContact = [sellerPhone, sellerEmail].filter(Boolean).join(" | ");
  const recipientName = address.recipient_name || address.name || session.user.name || "Customer";

  const HSN = "20081999";

  try {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const serif = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    const colWidth = (pct: number) => (CONTENT_WIDTH * pct) / 100;
    const drawText = (page: any, text: string, x: number, y: number, opts: any = {}) => {
      const f = opts.bold ? bold : opts.serif ? serif : font;
      const size = opts.size || FONT_SIZE;
      const color = opts.color || TEXT;
      page.drawText(text, { x, y, size, font: f, color });
    };

    const drawWrapped = (page: any, text: string, x: number, y: number, maxW: number, opts: any = {}) => {
      const f = opts.bold ? bold : opts.serif ? serif : font;
      const size = opts.size || FONT_SIZE;
      const lines: string[] = [];
      let cur = "";
      for (const word of text.split(" ")) {
        const test = cur ? cur + " " + word : word;
        if (f.widthOfTextAtSize(test, size) > maxW) {
          lines.push(cur);
          cur = word;
        } else {
          cur = test;
        }
      }
      if (cur) lines.push(cur);
      let ly = y;
      for (const line of lines) {
        page.drawText(line, { x, y: ly, size, font: f, color: opts.color || TEXT });
        ly -= size * 1.4;
      }
      return lines.length * size * 1.4;
    };

    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN;

    // ── Header ──
    drawText(page, "Tax Invoice", MARGIN, y, { serif: true, size: HEADER_FONT_SIZE, color: GREEN });
    y -= 28;
    drawText(page, sellerLegalName, MARGIN, y, { bold: true, size: 11, color: GREEN });
    y -= 14;
    drawText(page, `GSTIN: ${sellerGSTIN || "N/A"}`, MARGIN, y, { size: 9 });
    y -= 12;
    drawText(page, sellerAddr, MARGIN, y, { size: 9 });

    // Right-side metadata
    const metaX = MARGIN + CONTENT_WIDTH - 180;
    const meta = [
      ["Invoice No.", invoiceNo],
      ["Invoice Date", dateStr],
      ["Order ID", `#${id.slice(0, 8).toUpperCase()}`],
      ["Order Date", dateStr],
    ];
    let my = PAGE_HEIGHT - MARGIN - 4;
    for (const [lbl, val] of meta) {
      drawText(page, lbl, metaX, my, { size: 8, color: LABEL });
      drawText(page, val, metaX + 85, my, { size: 10, color: GREEN });
      my -= 15;
    }

    // Header underline
    y = Math.max(y, my) - 8;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: MARGIN + CONTENT_WIDTH, y },
      thickness: 2, color: GREEN,
    });
    y -= 16;

    // ── Addresses ──
    const addrW = (CONTENT_WIDTH - 16) / 2;
    for (const label of ["Bill To", "Ship To"]) {
      const ax = MARGIN + (label === "Ship To" ? addrW + 16 : 0);
      page.drawRectangle({
        x: ax, y: y - 50, width: addrW, height: 52,
        color: CREAM,
      });
      drawText(page, label, ax + 8, y - 12, { size: 8, color: LABEL, bold: true });
      drawText(page, recipientName, ax + 8, y - 24, { size: 9 });
      drawText(page, [
        address.line1 || "", address.line2 ? `, ${address.line2}` : "",
      ].join(""), ax + 8, y - 36, { size: 8 });
      drawText(page, [
        address.city || "", address.state ? `, ${address.state}` : "",
        address.pincode ? ` — ${address.pincode}` : "",
      ].join(""), ax + 8, y - 46, { size: 8 });
    }
    y -= 64;

    // ── Item Table ──
    // Table header
    const thY = y;
    const cols = [
      { label: "Description", w: 24 },
      { label: "HSN/SAC", w: 10, align: "center" as const },
      { label: "Qty", w: 6, align: "center" as const },
      { label: "Gross Amt", w: 13, align: "right" as const },
      { label: "Discount", w: 12, align: "right" as const },
      { label: "Taxable Val", w: 13, align: "right" as const },
      { label: "GST", w: 9, align: "right" as const },
      { label: "Total", w: 11, align: "right" as const },
    ];
    let cx = MARGIN;
    for (const col of cols) {
      const cw = colWidth(col.w);
      const tx = col.align === "right" ? cx + cw : cx;
      drawText(page, col.label, tx + (col.align === "center" ? cw / 2 - 14 : 0), thY, {
        size: 7.5, color: LABEL, bold: true,
      });
      cx += cw;
    }

    page.drawLine({
      start: { x: MARGIN, y: thY - 4 },
      end: { x: MARGIN + CONTENT_WIDTH, y: thY - 4 },
      thickness: 2, color: GREEN,
    });
    y = thY - 14;

    // Table rows
    function drawRow(rowItems: any, rowIdx: number) {
      let rowY = y;
      const isShipping = rowIdx === itemsWithCalc.length && shipping > 0;

      // Draw row line
      page.drawLine({
        start: { x: MARGIN, y: rowY },
        end: { x: MARGIN + CONTENT_WIDTH, y: rowY },
        thickness: 0.5, color: BORDER,
      });

      const values: any[] = isShipping
        ? [
            { text: "Shipping Charges" },
            { text: "9965", center: true },
            { text: "1", center: true },
            { text: fmt(shipping), right: true },
            { text: "—", right: true },
            { text: fmt(shippingTaxable), right: true },
            { text: fmt(shippingGst), right: true },
            { text: fmt(shipping), right: true },
          ]
        : [
            { text: rowItems.product_name || "Product", wrap: true, variant: rowItems.variant_name },
            { text: HSN, center: true },
            { text: String(rowItems.qty), center: true },
            { text: fmt(rowItems.gross), right: true },
            { text: rowItems.propDiscount > 0 ? `(${fmt(rowItems.propDiscount)})` : "—", right: true, color: rowItems.propDiscount > 0 ? RED : undefined },
            { text: fmt(rowItems.taxableValue), right: true },
            { text: fmt(rowItems.gstAmount), right: true },
            { text: fmt(rowItems.lineTotal), right: true },
          ];

      // Find max height needed for this row
      let lineH = FONT_SIZE + 2;
      const firstVal = values[0];
      if (isShipping) {
        lineH = FONT_SIZE * 1.4 + 4;
      } else if (firstVal.variant) {
        lineH = FONT_SIZE * 2.6;
      }

      if (rowY - lineH < MARGIN + 40) {
        // Add new page
        return { overflow: true, rowY };
      }

      cx = MARGIN;
      for (let ci = 0; ci < values.length; ci++) {
        const v = values[ci];
        const cw = colWidth(cols[ci].w);
        const tx = v.right ? cx + cw : v.center ? cx + cw / 2 - 14 : cx;

        if (ci === 0 && !isShipping && v.variant) {
          drawText(page, v.text, tx, rowY - FONT_SIZE, { size: FONT_SIZE, color: v.color || TEXT });
          drawText(page, v.variant, tx, rowY - FONT_SIZE * 2, { size: 7.5, color: LABEL });
        } else {
          drawText(page, v.text, tx, rowY - FONT_SIZE, { size: FONT_SIZE, color: v.color || TEXT });
        }
        cx += cw;
      }

      return { overflow: false, rowY: rowY - lineH };
    }

    for (let i = 0; i < itemsWithCalc.length; i++) {
      const result = drawRow(itemsWithCalc[i], i);
      if (result.overflow) {
        const newPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        y = PAGE_HEIGHT - MARGIN;
        // Re-draw header row on new page
        cx = MARGIN;
        for (const col of cols) {
          const cw = colWidth(col.w);
          drawText(newPage, col.label, cx + (col.align === "center" ? cw / 2 - 14 : 0), y, {
            size: 7.5, color: LABEL, bold: true,
          });
          cx += cw;
        }
        newPage.drawLine({
          start: { x: MARGIN, y: y - 4 },
          end: { x: MARGIN + CONTENT_WIDTH, y: y - 4 },
          thickness: 2, color: GREEN,
        });
        y -= 14;
        drawRow(itemsWithCalc[i], i);
      }
      y = result.rowY;
    }

    // Shipping row
    if (shipping > 0) {
      const result = drawRow([], itemsWithCalc.length);
      y = result.rowY;
    }

    // ── Totals ──
    y -= 8;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: MARGIN + CONTENT_WIDTH, y },
      thickness: 2, color: GREEN,
    });
    y -= 14;

    const totalX = MARGIN + 280;
    if (isIntraState) {
      drawText(page, `CGST 9%: ${fmt(totalGst / 2 + shippingGst / 2)}`, totalX, y, { size: 10 });
      y -= 14;
      drawText(page, `SGST 9%: ${fmt(totalGst / 2 + shippingGst / 2)}`, totalX, y, { size: 10 });
    } else {
      drawText(page, `IGST 18%: ${fmt(totalGst + shippingGst)}`, totalX, y, { size: 10 });
    }
    y -= 18;
    drawText(page, `Grand Total: ${fmt(grandTotal)}`, totalX, y, { bold: true, size: 14, color: GREEN });

    // ── Footer ──
    y = 60;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: MARGIN + CONTENT_WIDTH, y },
      thickness: 0.5, color: BORDER,
    });
    y -= 12;
    drawText(page, "This is a computer-generated invoice; no signature required.", MARGIN, y, { size: 8, color: LABEL });
    y -= 10;
    drawText(page, `${sellerTradeName} — ${sellerAddr}`, MARGIN, y, { size: 8, color: LABEL });
    if (supportContact) {
      y -= 10;
      drawText(page, `Contact: ${supportContact}`, MARGIN, y, { size: 8, color: LABEL });
    }
    y -= 10;
    drawText(page, "Nutyum — Premium Roasted Makhana • Thank you for your order!", MARGIN, y, { size: 8, color: LABEL });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="nutyum-invoice-${id.slice(0, 8)}.pdf"`,
        "Content-Length": String(pdfBytes.length),
      },
    });
  } catch (err: any) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
