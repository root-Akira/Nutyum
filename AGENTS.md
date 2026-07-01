<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:opencode-rules -->
# IMPORTANT — No action without permission

Do NOT commit, push, or take any action (including file edits, installations, etc.) without the user explicitly asking you to. Wait for instructions.
<!-- END:opencode-rules -->

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
- [x] **Wishlist heart on BestSellers** — added WishlistButton to BestSellers product cards
- [x] **ProductCard responsive width** — `w-full max-w-[260px]` instead of fixed `w-[260px]` to eliminate gap in grid layouts
- [x] **Sidebar Sign Out** — moved from Account Settings page to sidebar below Account Settings
- [x] **Hydration fix** — replaced `next-themes` with passthrough provider to eliminate DOM attribute mismatch
- [x] **Account section audit** — all pages and API routes verified (Profile, Orders, Wishlist, Account Settings, addresses, change password)
- [x] **Coming Soon products** — `isComingSoon` + `launchDate` on Product type, DB migration (0004), seed update, badge logic, purchase disabled
- [x] **BestSellers tabs** — toggle between Best Sellers / Coming Soon with original gold badge design; "We are planning to bring something new!" when empty
- [x] **Our Origins icons** — emojis replaced with lucide SVG icons (Leaf, Globe, Mountain) + glass effect
- [x] **No-action-without-permission rule** — added to AGENTS.md

### Still Pending
- [ ] Razorpay payments
