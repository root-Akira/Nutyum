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
- [x] **Robust error handling in API routes** — `getErrorMessage()` helper, `Array.isArray()` guards before `.map()`/`.length`, safe non-JSON response parsing; 41 routes, 0 errors
- [x] **Default address enforcement** — only one address can be default; `unsetAllDefaults()` clears existing default before setting new one in both POST and PUT
- [x] **`is_default` column persistence** — API now reads/writes `is_default` to Supabase; Default badge shows on address cards

### Still Pending
- [ ] Razorpay payments
