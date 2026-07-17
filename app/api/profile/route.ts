import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await getSupabaseAdmin().auth.admin.getUserById(session.user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const meta = data.user.user_metadata || {};
  return NextResponse.json({
    id: data.user.id,
    email: data.user.email,
    name: meta.name || data.user.email?.split("@")[0] || "",
    phone: meta.phone || "",
  });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, phone } = await req.json();

  const { data, error } = await getSupabaseAdmin().auth.admin.updateUserById(session.user.id, {
    user_metadata: { name, phone },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const meta = data.user.user_metadata || {};
  return NextResponse.json({
    id: data.user.id,
    email: data.user.email,
    name: meta.name || "",
    phone: meta.phone || "",
  });
}
