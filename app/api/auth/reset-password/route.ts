import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Get access token from Supabase auth cookie
    const cookies = request.cookies;
    const authCookie = cookies.get("sb-access-token") || cookies.get("sb-jwt") || cookies.get("sb-jwt-test");

    if (!authCookie) {
      return NextResponse.json({ error: "No session found. Please reset your password again." }, { status: 401 });
    }

    // Use the admin client to find and update the user by their access token
    const { data: { user }, error: userError } = await getSupabaseAdmin().auth.getUser(authCookie.value);
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { error: updateError } = await getSupabaseAdmin().auth.admin.updateUserById(user.id, {
      password,
    });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
