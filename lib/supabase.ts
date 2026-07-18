import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jemypvfnlazkrvrmzcaz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplbXlwdmZubGF6a3J2cm16Y2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MDc5NDUsImV4cCI6MjA5ODM4Mzk0NX0.xO89H010DO615_FunKuvMwpKUNhe6PxJREKA0vbIPvs";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}
