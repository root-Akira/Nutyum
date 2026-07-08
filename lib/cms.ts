const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function getCmsContent(slug: string): Promise<{ title: string; content: string } | null> {
  if (!supabaseUrl || !serviceRoleKey) return null;

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/cms_pages?slug=eq.${slug}&select=title,content`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data[0];
    return null;
  } catch {
    return null;
  }
}
