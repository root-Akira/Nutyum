import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch } from "@/lib/supabase-fetch";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json([]);

    const { data, error } = await supabaseFetch(
      `addresses?user_id=eq.${session.user.id}`
    );

    if (error || !Array.isArray(data)) return NextResponse.json([]);

    const mapped = (data).map((a: Record<string, unknown>) => ({
      id: a.id,
      line1: a.line1,
      line2: a.line2,
      city: a.city,
      state: a.state,
      pincode: a.pincode,
      phone: a.phone,
      isDefault: false,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("Addresses GET error:", err);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { line1, line2, city, state, pincode, phone } = await req.json();

    if (!line1 || !city || !state || !pincode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const body = {
      user_id: session.user.id,
      line1,
      line2: line2 || "",
      city,
      state,
      pincode,
      phone: phone || "",
    };

    const { data, error } = await supabaseFetch("addresses", {
      method: "POST",
      headers: { "Prefer": "return=representation" },
      body: JSON.stringify(body),
    });

    if (error) {
      const msg = typeof error === "object" && error ? String((error as Record<string, unknown>).message || "") : String(error);
      if (msg.includes("does not exist") || msg.includes("schema cache")) {
        return NextResponse.json({ error: "Addresses table not set up — run the SQL in Supabase SQL Editor" }, { status: 503 });
      }
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const a = Array.isArray(data) ? data[0] : data;
    if (!a) {
      return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
    }

    return NextResponse.json({
      id: a.id,
      line1: a.line1,
      line2: a.line2,
      city: a.city,
      state: a.state,
      pincode: a.pincode,
      phone: a.phone,
      isDefault: false,
    });
  } catch (err) {
    console.error("Addresses POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
