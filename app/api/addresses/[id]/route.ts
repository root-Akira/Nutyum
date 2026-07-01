import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch, unsetAllDefaults } from "@/lib/supabase-fetch";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { line1, line2, city, state, pincode, phone, isDefault } = await req.json();

    const body: Record<string, unknown> = {};
    if (line1 !== undefined) body.line1 = line1;
    if (line2 !== undefined) body.line2 = line2;
    if (city !== undefined) body.city = city;
    if (state !== undefined) body.state = state;
    if (pincode !== undefined) body.pincode = pincode;
    if (phone !== undefined) body.phone = phone;
    if (isDefault !== undefined) body.is_default = !!isDefault;
    if (body.is_default) await unsetAllDefaults(session.user.id);

    const { data, error } = await supabaseFetch(
      `addresses?id=eq.${id}&user_id=eq.${session.user.id}`,
      {
        method: "PATCH",
        headers: { "Prefer": "return=representation" },
        body: JSON.stringify(body),
      }
    );

    if (error) {
      const msg = typeof error === "object" && error ? String((error as Record<string, unknown>).message || "") : String(error);
      if (msg.includes("does not exist") || msg.includes("schema cache")) {
        return NextResponse.json({ error: "Addresses table not set up — run the SQL in Supabase SQL Editor" }, { status: 503 });
      }
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const a = Array.isArray(data) ? data[0] : data;
    if (!a) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: a.id,
      line1: a.line1,
      line2: a.line2,
      city: a.city,
      state: a.state,
      pincode: a.pincode,
      phone: a.phone,
      isDefault: !!a.is_default,
    });
  } catch (err) {
    console.error("Addresses PUT error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabaseFetch(
      `addresses?id=eq.${id}&user_id=eq.${session.user.id}`,
      {
        method: "DELETE",
        headers: { "Prefer": "return=minimal" },
      }
    );

    if (error) {
      const msg = typeof error === "object" && error ? String((error as Record<string, unknown>).message || "") : String(error);
      if (msg.includes("does not exist") || msg.includes("schema cache")) {
        return NextResponse.json({ error: "Addresses table not set up — run the SQL in Supabase SQL Editor" }, { status: 503 });
      }
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Addresses DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
