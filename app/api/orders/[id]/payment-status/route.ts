import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase-fetch";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://admin.nutyum.in",
  "Access-Control-Allow-Methods": "PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const ALLOWED_STATUSES = ["pending", "paid", "failed"];

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const { paymentStatus, apiKey } = body;

  if (apiKey !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  if (!id || !paymentStatus) {
    return NextResponse.json({ error: "Missing id or paymentStatus" }, { status: 400, headers: corsHeaders });
  }

  if (!ALLOWED_STATUSES.includes(paymentStatus)) {
    return NextResponse.json({ error: "Invalid payment status" }, { status: 400, headers: corsHeaders });
  }

  const { data: orders } = await supabaseFetch(`orders?id=eq.${id}&select=*`);
  const order = (Array.isArray(orders) ? orders[0] : null) as Record<string, unknown> | null;

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404, headers: corsHeaders });
  }

  if (order.payment_method !== "cod") {
    return NextResponse.json(
      { error: "Payment status can only be updated manually for COD orders" },
      { status: 403, headers: corsHeaders }
    );
  }

  const { error: updateErr } = await supabaseFetch(`orders?id=eq.${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payment_status: paymentStatus }),
  });

  if (updateErr) {
    return NextResponse.json({ error: "Failed to update payment status" }, { status: 500, headers: corsHeaders });
  }

  return NextResponse.json({ success: true, payment_status: paymentStatus }, { headers: corsHeaders });
}
