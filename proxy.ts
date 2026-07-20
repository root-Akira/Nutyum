import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const MAINTENANCE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>We'll Be Right Back — Nutyum</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#FAF7EE;color:#173D22;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1rem}
.card{text-align:center;max-width:480px}
.icon{display:flex;align-items:center;justify-content:center;width:80px;height:80px;border-radius:50%;background:#173D22;margin:0 auto 1.5rem}
.icon svg{width:40px;height:40px;stroke:#E0961A;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
h1{font-family:Georgia,"Times New Roman",serif;font-size:1.875rem;font-weight:700;margin-bottom:.75rem;color:#173D22}
p{color:#6b7280;margin-bottom:2rem;line-height:1.6}
.badge{display:inline-flex;align-items:center;gap:.5rem;font-size:.875rem;color:rgba(23,61,34,.6)}.dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#E0961A;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
</style>
</head>
<body><div class="card">
<div class="icon"><svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>
<h1>We&rsquo;ll Be Right Back</h1>
<p>We&rsquo;re currently performing scheduled maintenance to improve your experience. Please check back shortly.</p>
<div class="badge"><span class="dot"></span>Under Maintenance</div>
</div></body></html>`

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const bypassSecret = searchParams.get('bypass')
  if (bypassSecret && bypassSecret === process.env.MAINTENANCE_BYPASS_SECRET) {
    return NextResponse.next()
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) return NextResponse.next()

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/site_settings?select=maintenance_mode&limit=1&order=updated_at.desc`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      },
    )

    if (res.ok) {
      const data: Array<{ maintenance_mode: boolean }> = await res.json()
      if (data?.[0]?.maintenance_mode === true) {
        return new Response(MAINTENANCE_HTML, {
          status: 503,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })
      }
    }
  } catch {
    // Fail open — site works if check fails
  }

  return NextResponse.next()
}
