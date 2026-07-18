import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    supabaseUrl: !!process.env.SUPABASE_URL,
    nextPublicSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseUrlValue: process.env.SUPABASE_URL ? "set" : "unset",
    nextPublicSupabaseUrlValue: process.env.NEXT_PUBLIC_SUPABASE_URL ? "set" : "unset",
  });
}
