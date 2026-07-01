import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
  }

  // Verify current password by attempting sign-in
  const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
    email: session.user.email!,
    password: currentPassword,
  });

  if (signInError) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 403 });
  }

  // Update password
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(session.user.id, {
    password: newPassword,
  });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
