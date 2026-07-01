const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function getErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") return String((err as Record<string, unknown>).message || "") || String(err);
  return String(err);
}

export async function supabaseFetch(path: string, options?: RequestInit) {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
        "Accept": "application/json",
        ...options?.headers as Record<string, string>,
      },
    });
    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text || null;
    }
    return { data, error: res.ok ? null : data, status: res.status };
  } catch (err) {
    console.error("supabaseFetch network error:", err);
    return { data: null, error: err, status: 0 };
  }
}
