import { NextResponse } from "next/server";
import { auth } from "@/auth";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const headers = {
  "Content-Type": "application/json",
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
};

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { rating, title, comment } = body;

    if (!rating || !title || !comment) {
      return NextResponse.json({ error: "rating, title, and comment are required" }, { status: 400 });
    }

    // Verify ownership
    const check = await fetch(`${supabaseUrl}/rest/v1/reviews?id=eq.${id}&select=email`, { headers });
    const existing = await check.json();
    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    if (existing[0].email !== session.user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/reviews?id=eq.${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ rating, title, comment }),
    });

    if (!res.ok) return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Verify ownership
    const check = await fetch(`${supabaseUrl}/rest/v1/reviews?id=eq.${id}&select=email`, { headers });
    const existing = await check.json();
    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    if (existing[0].email !== session.user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/reviews?id=eq.${id}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
