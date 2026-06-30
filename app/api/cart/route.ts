import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ items: [] });
  }

  const { data, error } = await supabaseAdmin.auth.admin.getUserById(session.user.id);
  if (error || !data?.user) {
    return NextResponse.json({ items: [] });
  }

  const cart = (data.user.user_metadata as any)?.cart || [];
  return NextResponse.json({ items: cart });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items } = await req.json();

  const { error } = await supabaseAdmin.auth.admin.updateUserById(session.user.id, {
    user_metadata: { cart: items },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
