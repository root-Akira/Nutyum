import { createClient, SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://jemypvfnlazkrvrmzcaz.supabase.co";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
