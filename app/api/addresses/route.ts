import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch } from "@/lib/supabase-fetch";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabaseFetch(
    `addresses?user_id=eq.${session.user.id}&order=created_at.desc`
  );

  if (error) {
    return NextResponse.json([]);
  }

  const mapped = (data || []).map((a: Record<string, unknown>) => ({
    id: a.id,
    line1: a.line1,
    line2: a.line2,
    city: a.city,
    state: a.state,
    pincode: a.pincode,
    phone: a.phone,
    isDefault: a.is_default || false,
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

  const body: Record<string, unknown> = {
    user_id: session.user.id,
    line1,
    line2: line2 || "",
    city,
    state,
    pincode,
    phone: phone || "",
  };

  // Only include is_default if it's true (column may not exist yet)
  if (isDefault) {
    body.is_default = true;
  }

  const { data, error } = await supabaseFetch("addresses", {
    method: "POST",
    headers: { "Prefer": "return=representation" },
    body: JSON.stringify(body),
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
    isDefault: a.is_default || false,
  });
}
