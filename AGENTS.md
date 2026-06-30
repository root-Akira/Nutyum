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

### Completed (Audit & Polish)
- [x] **Proxy (middleware)** restored — `proxy.ts` correctly protects `/account` + `/checkout`
- [x] **HeroCarousel** — removed `useReducedMotion` dependency (was blocking auto-slide & animations)
- [x] **Discover** — replaced `<a>` with `<Link>` for client-side routing
- [x] **Products data** — removed stale `"TEA SACHETS"` badgeLabel artifact from sea-salt product
- [x] **Footer dead links** — 13 broken paths fixed (`/shop/best-sellers` → `/shop`, `/corporate` → `/wholesale`, etc.)
- [x] **Navbar mega menu** — 4 dead "By Need" links redirected to `/shop`
- [x] **Navbar right side** — unified font to match left side (19px Cormorant Garamond), added Home, reordered to Home→Wholesale→Journal→Sign In
- [x] **Logo** — increased to 70px, scrolled navbar height adjusted to 86px
- [x] **Logo & Home** — scroll-to-top on click (Home keeps it, logo reverted)
- [x] **Navbar scroll animation** — switched CSS transition to Framer Motion spring (stiffness 180, damping 22)
- [x] **Best Sellers** — shows 3 products (slice 0-3), centered grid instead of horizontal scroll, removed decorative dots, staggered scroll-in animation
- [x] **Mega menu featured** — replaced hardcoded placeholder "Nutyum" labels with real product images + names from PRODUCTS (synced with BestSellers)
- [x] **Duplicate keys** — fixed footer (`link.href` → `col-heading-label`) and mega menu (`link.href` → `href-label`)
- [x] **Unused files removed** — 9 dead components, 1 hook, stale data exports
- [x] **Discover → Shop flow** — Discover vibe pills now pass `?vibe=` param, Shop page reads it via `useSearchParams` and auto-filters
- [x] **Build** — 0 errors, 15 routes

### Still Pending
- [ ] Supabase/Drizzle integration, Supabase auth, Razorpay payments
- [ ] Support pages (contact, FAQ, shipping, returns, privacy) — links exist in footer but routes don't
- [ ] `/reviews` route
