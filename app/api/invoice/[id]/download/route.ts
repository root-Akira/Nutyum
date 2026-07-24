import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch } from "@/lib/supabase-fetch";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const GREEN = rgb(0.09, 0.24, 0.13);
const TEXT = rgb(0.30, 0.35, 0.28);
const LABEL = rgb(0.54, 0.60, 0.55);
const CREAM = rgb(0.98, 0.97, 0.94);
const RED = rgb(0.75, 0.22, 0.17);
const BORDER = rgb(0.9, 0.89, 0.85);

const ML = 50;
const PW = 595.28;
const PH = 841.89;
const CW = PW - ML * 2;
const FS = 9;

const fmt = (n: number) => "Rs. " + n.toFixed(2);

function parseAddr(a: unknown) {
  if (typeof a === "string") { try { return JSON.parse(a); } catch { return {}; } }
  return (a as any) || {};
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
  const address = parseAddr(order.shipping_address);

  const subtotal = Number(order.subtotal) || 0;
  const discount = Number(order.discount) || 0;
  const shipping = Number(order.shipping) || 0;

  const sellerLegalName = "Nutyum Foods Private Limited";
  const sellerTrade = (settings.store_name as string) || "Nutyum";
  const sellerGSTIN = (settings.gst_number as string) || "";
  const sellerAddr = (settings.store_address as string) || "Nutyum Foods Pvt. Ltd., Mumbai, Maharashtra";
  const sellerEmail = (settings.store_email as string) || "support@nutyum.in";
  const sellerPhone = (settings.store_phone as string) || "";

  const isIntra = ((address.state as string) || "").trim().toLowerCase() === "maharashtra";
  const createdDate = new Date(order.created_at as string);
  const invNo = `NUT/${createdDate.getFullYear()}/${id.slice(0, 6).toUpperCase()}`;
  const dateStr = createdDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const calcItems = items.map((i: any) => {
    const q = Number(i.quantity) || 1;
    const p = Number(i.price) || 0;
    const g = q * p;
    const pd = subtotal > 0 ? (g / subtotal) * discount : 0;
    const na = Math.max(0, g - pd);
    const tv = Number((na / 1.18).toFixed(2));
    const ga = Number((na - tv).toFixed(2));
    return { ...i, qty: q, price: p, gross: g, propDisc: pd, taxVal: tv, gstAmt: ga, lineTot: tv + ga };
  });

  const totalTV = calcItems.reduce((s: number, i: any) => s + i.taxVal, 0);
  const totalGST = calcItems.reduce((s: number, i: any) => s + i.gstAmt, 0);
  let shipTV = 0, shipGST = 0;
  if (shipping > 0) {
    shipTV = Number((shipping / 1.18).toFixed(2));
    shipGST = Number((shipping - shipTV).toFixed(2));
  }
  const grandTotal = totalTV + totalGST + shipTV + shipGST;
  const support = [sellerPhone, sellerEmail].filter(Boolean).join(" | ");
  const recipient = address.recipient_name || address.name || session.user.name || "Customer";
  const HSN = "20081999";

  try {
    const pdf = await PDFDocument.create();
    const f = await pdf.embedFont(StandardFonts.Helvetica);
    const b = await pdf.embedFont(StandardFonts.HelveticaBold);
    const s = await pdf.embedFont(StandardFonts.TimesRoman);

    function tw(text: string, sz = FS) { return f.widthOfTextAtSize(text, sz); }
    function bw(text: string, sz = FS) { return b.widthOfTextAtSize(text, sz); }

    function dt(page: any, text: string, x: number, y: number, opts: any = {}) {
      const fn = opts.b ? b : opts.serif ? s : f;
      page.drawText(text, { x, y, size: opts.sz || FS, font: fn, color: opts.c || TEXT });
    }

    function addrText(text: string) { return text || ""; }

    const page = pdf.addPage([PW, PH]);
    let y = PH - ML;

    // ── Header ──
    dt(page, "Tax Invoice", ML, y, { serif: true, sz: 22, c: GREEN });
    y -= 26;
    dt(page, sellerLegalName, ML, y, { b: true, sz: 11, c: GREEN });
    y -= 14;
    dt(page, `GSTIN: ${sellerGSTIN || "N/A"}`, ML, y, { sz: 9 });
    y -= 12;
    dt(page, sellerAddr, ML, y, { sz: 9 });

    // Right metadata
    const mx = ML + CW - 190;
    const meta: [string, string][] = [
      ["Invoice No.", invNo],
      ["Invoice Date", dateStr],
      ["Order ID", `#${id.slice(0, 8).toUpperCase()}`],
      ["Order Date", dateStr],
    ];
    let my2 = PH - ML - 4;
    for (const [l, v] of meta) {
      dt(page, l, mx, my2, { sz: 8, c: LABEL });
      dt(page, v, mx + 85, my2, { sz: 10, c: GREEN });
      my2 -= 15;
    }
    y = Math.min(y, my2) - 8;
    page.drawLine({ start: { x: ML, y }, end: { x: ML + CW, y }, thickness: 2, color: GREEN });
    y -= 16;

    // ── Addresses ──
    const aw = (CW - 16) / 2;
    const addrLabels = ["Bill To", "Ship To"];
    for (const lbl of addrLabels) {
      const ax = ML + (lbl === "Ship To" ? aw + 16 : 0);
      page.drawRectangle({ x: ax, y: y - 54, width: aw, height: 56, color: CREAM });
      dt(page, lbl, ax + 8, y - 12, { sz: 8, c: LABEL, b: true });
      dt(page, recipient, ax + 8, y - 24, { sz: 9 });
      const l1 = addrText(address.line1) + (address.line2 ? `, ${address.line2}` : "");
      const l2 = addrText(address.city) + (address.state ? `, ${address.state}` : "") + (address.pincode ? ` — ${address.pincode}` : "");
      dt(page, l1, ax + 8, y - 36, { sz: 8 });
      dt(page, l2, ax + 8, y - 46, { sz: 8 });
    }
    y -= 68;

    // ── Table ──
    const cols = [
      { l: "Description", w: 24 },
      { l: "HSN/SAC", w: 10, a: "c" },
      { l: "Qty", w: 6, a: "c" },
      { l: "Gross Amt", w: 13, a: "r" },
      { l: "Discount", w: 12, a: "r" },
      { l: "Taxable Val", w: 13, a: "r" },
      { l: "GST", w: 9, a: "r" },
      { l: "Total", w: 11, a: "r" },
    ];
    const cw = (pct: number) => (CW * pct) / 100;

    // Table header
    let cx = ML;
    for (const col of cols) {
      const cww = cw(col.w);
      const txt = col.l;
      const tw2 = bw(txt, 7);
      const txx = col.a === "r" ? cx + cww - tw2 : col.a === "c" ? cx + (cww - tw2) / 2 : cx;
      dt(page, txt, txx, y, { sz: 7, c: LABEL, b: true });
      cx += cww;
    }
    y -= 4;
    page.drawLine({ start: { x: ML, y }, end: { x: ML + CW, y }, thickness: 2, color: GREEN });
    y -= 14;

    function drawRow(row: any, isShip: boolean): boolean {
      const rowY = y;
      if (rowY - FS * 2 < ML + 40) return false;

      page.drawLine({ start: { x: ML, y: rowY }, end: { x: ML + CW, y: rowY }, thickness: 0.5, color: BORDER });

      const vals: { txt: string; a?: string; c?: any; sub?: string }[] = isShip
        ? [
            { txt: "Shipping Charges" },
            { txt: "9965", a: "c" },
            { txt: "1", a: "c" },
            { txt: fmt(shipping), a: "r" },
            { txt: "—", a: "r" },
            { txt: fmt(shipTV), a: "r" },
            { txt: fmt(shipGST), a: "r" },
            { txt: fmt(shipping), a: "r" },
          ]
        : [
            { txt: row.product_name || "Product", sub: row.variant_name || "" },
            { txt: HSN, a: "c" },
            { txt: String(row.qty), a: "c" },
            { txt: fmt(row.gross), a: "r" },
            { txt: row.propDisc > 0 ? `(${fmt(row.propDisc)})` : "—", a: "r", c: row.propDisc > 0 ? RED : undefined },
            { txt: fmt(row.taxVal), a: "r" },
            { txt: fmt(row.gstAmt), a: "r" },
            { txt: fmt(row.lineTot), a: "r" },
          ];

      const hasSub = vals[0].sub;

      cx = ML;
      for (let ci = 0; ci < vals.length; ci++) {
        const v = vals[ci];
        const cww = cw(cols[ci].w);
        const txtW = tw(v.txt);
        const tx = v.a === "r" ? cx + cww - txtW : v.a === "c" ? cx + (cww - txtW) / 2 : cx;
        dt(page, v.txt, tx, rowY - FS, { sz: FS, c: v.c || TEXT });

        if (ci === 0 && hasSub && !isShip) {
          const subW = tw(v.sub || "", 7);
          dt(page, v.sub || "", cx, rowY - FS * 2, { sz: 7, c: LABEL });
        }
        cx += cww;
      }

      y = rowY - (hasSub && !isShip ? FS * 2.6 : FS * 1.5);
      return true;
    }

    for (const item of calcItems) {
      if (!drawRow(item, false)) {
        // New page
        const np = pdf.addPage([PW, PH]);
        y = PH - ML;

        cx = ML;
        for (const col of cols) {
          const cww = cw(col.w);
          const txtW2 = bw(col.l, 7);
          const txx2 = col.a === "r" ? cx + cww - txtW2 : col.a === "c" ? cx + (cww - txtW2) / 2 : cx;
          dt(np, col.l, txx2, y, { sz: 7, c: LABEL, b: true });
          cx += cww;
        }
        y -= 4;
        np.drawLine({ start: { x: ML, y }, end: { x: ML + CW, y }, thickness: 2, color: GREEN });
        y -= 14;
        drawRow(item, false);
      }
    }

    if (shipping > 0) drawRow(null, true);

    // ── Totals ──
    y -= 8;
    page.drawLine({ start: { x: ML, y }, end: { x: ML + CW, y }, thickness: 2, color: GREEN });
    y -= 16;

    const txTot = ML + 260;
    if (isIntra) {
      dt(page, `CGST 9%: ${fmt(totalGST / 2 + shipGST / 2)}`, txTot, y, { sz: 10 });
      y -= 15;
      dt(page, `SGST 9%: ${fmt(totalGST / 2 + shipGST / 2)}`, txTot, y, { sz: 10 });
    } else {
      dt(page, `IGST 18%: ${fmt(totalGST + shipGST)}`, txTot, y, { sz: 10 });
    }
    y -= 20;
    dt(page, `Grand Total: ${fmt(grandTotal)}`, txTot, y, { b: true, sz: 14, c: GREEN });

    // ── Footer ──
    y = 70;
    page.drawLine({ start: { x: ML, y }, end: { x: ML + CW, y }, thickness: 0.5, color: BORDER });
    y -= 12;
    dt(page, "This is a computer-generated invoice; no signature required.", ML, y, { sz: 8, c: LABEL });
    y -= 11;
    dt(page, `${sellerTrade} — ${sellerAddr}`, ML, y, { sz: 8, c: LABEL });
    if (support) { y -= 11; dt(page, `Contact: ${support}`, ML, y, { sz: 8, c: LABEL }); }
    y -= 11;
    dt(page, "Nutyum — Premium Roasted Makhana • Thank you for your order!", ML, y, { sz: 8, c: LABEL });

    const bytes = await pdf.save();
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="nutyum-invoice-${id.slice(0, 8)}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("PDF error:", err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
