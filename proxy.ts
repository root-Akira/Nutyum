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

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const hasKeys = !!supabaseUrl && !!serviceRoleKey

  if (!hasKeys) {
    const resp = NextResponse.next()
    resp.headers.set('x-proxy-debug', 'no-keys')
    return resp
  }

  try {
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
      const isOn = data?.[0]?.maintenance_mode === true
      if (isOn) {
        return NextResponse.redirect(new URL('/maintenance', request.url))
      }
    }

    const resp = NextResponse.next()
    resp.headers.set('x-proxy-debug', `status-${res.status}`)
    return resp
  } catch (err) {
    const resp = NextResponse.next()
    resp.headers.set('x-proxy-debug', `error-${String(err).slice(0, 60)}`)
    return resp
  }
}
