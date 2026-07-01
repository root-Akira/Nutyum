import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch } from "@/lib/supabase-fetch";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseFetch(
    `addresses?user_id=eq.${session.user.id}&order=is_default.desc,created_at.desc`
  );

  if (error) {
    return NextResponse.json({ error: error.message || error }, { status: 500 });
  }

  const mapped = (data || []).map((a: Record<string, unknown>) => ({
    id: a.id,
    line1: a.line1,
    line2: a.line2,
    city: a.city,
    state: a.state,
    pincode: a.pincode,
    phone: a.phone,
    isDefault: a.is_default,
  }));

  return NextResponse.json(mapped);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { line1, line2, city, state, pincode, phone, isDefault } = await req.json();

  if (!line1 || !city || !state || !pincode) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // If setting as default, unset other defaults first
  if (isDefault) {
    await supabaseFetch(
      `addresses?user_id=eq.${session.user.id}`,
      {
        method: "PATCH",
        headers: { "Prefer": "return=minimal" },
        body: JSON.stringify({ is_default: false }),
      }
    );
  }

  const { data, error } = await supabaseFetch("addresses", {
    method: "POST",
    headers: { "Prefer": "return=representation" },
    body: JSON.stringify({
      user_id: session.user.id,
      line1,
      line2: line2 || "",
      city,
      state,
      pincode,
      phone: phone || "",
      is_default: isDefault || false,
    }),
  });

  if (error) {
    return NextResponse.json({ error: error.message || error }, { status: 500 });
  }

  const a = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({
    id: a.id,
    line1: a.line1,
    line2: a.line2,
    city: a.city,
    state: a.state,
    pincode: a.pincode,
    phone: a.phone,
    isDefault: a.is_default,
  });
}
