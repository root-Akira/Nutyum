import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const hasSupabase = !!((process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) && process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password too short" }, { status: 400 });
    }

    if (hasSupabase) {
      const { data, error } = await getSupabaseAdmin().auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
      });

      if (error) {
        if (error.message.includes("already exists") || error.message.includes("already registered")) {
          return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        id: data.user.id,
        name: data.user.user_metadata?.name || name,
        email: data.user.email,
      });
    }

    // Fallback: demo store
    const { createUser } = await import("@/lib/demo-user-store");
    const user = createUser(name, email, password);
    return NextResponse.json({ id: user.id, name: user.name, email: user.email });
  } catch (e: unknown) {
    if ((e as Error)?.message === "User already exists") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
