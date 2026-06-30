<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

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

## Session: 2026-06-30

### Completed (Supabase Auth Integration)
- [x] **Supabase Auth connected** — credentials provider validates against Supabase Auth (falls back to demo store if disconnected)
- [x] **Sign-up route** — creates users in Supabase Auth via admin API with `email_confirm: true`
- [x] **Forgot password** — `/forgot-password` page with Supabase `resetPasswordForEmail()`, `/auth/callback` route, `/reset-password` page with `updateUser()`
- [x] **Callback URL redirect** — sign-in redirects back to the page user was trying to access
- [x] **Reset success banner** — green alert on sign-in page when redirected from password reset
- [x] **"Forgot password?" link** added to sign-in form
- [x] **Session auto-refresh** — `session.update()` called after sign-in/sign-up so Navbar updates immediately
- [x] **Demo users removed** — test accounts deleted from Supabase Auth
- [x] **Google OAuth** — configured in NextAuth, needs env vars (deferred)
- [x] **BestSellers "Add" button** — wired to cart store (was missing onClick)
- [x] **Navbar shadow** — subtle bottom shadow always present (deepens on scroll)
- [x] **Build** — 0 errors, 17 routes
- [x] **Git push** — committed and pushed to GitHub
- [x] **Cart persistence fix** — sign-out no longer overwrites API cart, CartSync uses session status for reliable load/sync
- [x] **localStorage cart cache** — cart renders instantly from localStorage, API syncs in background

### Still Pending
- [ ] Supabase/Drizzle integration, Supabase auth, Razorpay payments
- [ ] Support pages (contact, FAQ, shipping, returns, privacy) — links exist in footer but routes don't
- [ ] `/reviews` route
