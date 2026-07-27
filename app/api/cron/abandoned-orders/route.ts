import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase-fetch";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const HOURS = 2;
  const cutoff = new Date(Date.now() - HOURS * 60 * 60 * 1000).toISOString();

  const { data: orders, error } = await supabaseFetch(
    `orders?payment_method=eq.razorpay&status=eq.placed&created_at=lt.${cutoff}&select=id`
  );

  if (error) {
    console.error("Cron: failed to fetch abandoned orders", error);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  let processed = 0;
  for (const order of orders) {
    const id = (order as Record<string, unknown>).id as string;
    if (!id) continue;

    await supabaseFetch(`orders?id=eq.${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "cancelled",
        cancellation_reason: "Auto-cancelled — payment not completed",
      }),
    });

    await supabaseFetch("order_status_logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: id,
        status: "cancelled",
        note: "Auto-cancelled — payment not completed",
      }),
    });

    processed++;
  }

  return NextResponse.json({ processed });
}
