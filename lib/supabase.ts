import { createClient, SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://jemypvfnlazkrvrmzcaz.supabase.co";
const DEFAULT_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplbXlwdmZubGF6a3J2cm16Y2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MDc5NDUsImV4cCI6MjA5ODM4Mzk0NX0.xO89H010DO615_FunKuvMwpKUNhe6PxJREKA0vbIPvs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase env vars");
    }
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}
