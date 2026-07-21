import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/site_settings?select=store_name,store_email,store_phone,store_address,gst_number,cod_enabled,cod_charge&limit=1&order=updated_at.desc`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        next: { revalidate: 60 },
      },
    )
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    }
    const data = await res.json()
    return NextResponse.json(data?.[0] ?? null)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
