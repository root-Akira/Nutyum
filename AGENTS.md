<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- REMINDER: Update this file at the end of every session with completed work and current status. -->

<!-- Nutyum Project Tracking -->

# Project: Nutyum — Premium Makhana Snacks

## Tech Stack
- **Frontend:** Next.js 16.2.9 / React 19.2.4 / TypeScript 5 / Tailwind v4
- **Animations:** Framer Motion 12 + GSAP 3.15
- **State:** Zustand 5
- **Forms:** react-hook-form 7 + Zod 4
- **Database:** Supabase (PostgreSQL) + Drizzle ORM (Phase 2)
- **Auth:** NextAuth.js v5 (Phase 3)
- **Payments:** Razorpay (Phase 3)
- **Deployment:** Vercel

## Session: 2026-07-01

### Completed
- [x] **DB products verified** — `/api/products` returns 6 products from Supabase `products` table with proper field mapping (bgColor, isNew, isBestSeller, badgeLabel, weight, vibes); build succeeds with 0 errors, 17 routes
- [x] **Restarted dev server** — confirmed API responding correctly
- [x] **Added "demo classic-pudina"** — ₹499, 500g, NEW badge, upserted via Supabase REST API on `slug` conflict; API now serves 7 products
- [x] **Pushed to GitHub**

### Hydration warning (cosmetic)
- **"Some attributes didn't match"** warning on client — caused by browser extension (password manager/ad blocker) injecting attributes into DOM before React hydrates. Tree hydrates fine. Suppress by testing in incognito.
- `suppressHydrationWarning` already on `<html>` tag.

### Still Pending
- [ ] Support pages (contact, FAQ, shipping, returns, privacy) — links exist in footer but routes don't
- [ ] `/reviews` route
- [ ] Razorpay payments
