import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) return NextResponse.next()

    const res = await fetch(
      `${supabaseUrl}/rest/v1/site_settings?select=maintenance_mode&limit=1`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      },
    )

    if (res.ok) {
      const data: Array<{ maintenance_mode: boolean }> = await res.json()
      if (data?.[0]?.maintenance_mode) {
        return NextResponse.redirect(new URL('/maintenance', request.url))
      }
    }
  } catch {
    // Fail open — site works if check fails
  }

  return NextResponse.next()
}
