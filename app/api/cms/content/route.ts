import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json(null);

  if (!supabaseUrl || !serviceRoleKey) return NextResponse.json(null);

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
    if (!res.ok) return NextResponse.json(null);
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) && data.length > 0 ? data[0] : null);
  } catch {
    return NextResponse.json(null);
  }
}
