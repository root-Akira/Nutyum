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
- [x] **Robust error handling in API routes** — 41 routes, 0 errors
- [x] **Navbar 70px**, glass effect, **hero carousel** smooth animation
- [x] **Default address enforcement** — `unsetAllDefaults()` before setting new default
- [x] **Account section** — Profile, Orders, Wishlist, Addresses, Change Password all verified
- [x] **Hydration fix** — passthrough provider replaced `next-themes`
- [x] **Coming Soon** products — `isComingSoon` + `launchDate`, badge, purchase disabled
- [x] **BestSellers tabs** — toggle Best Sellers / Coming Soon
- [x] **Our Origins** — lucide SVG icons (Leaf, Globe, Mountain)

### Repositories
- **Main website** → `https://github.com/root-Akira/Nutyum` (this repo)
- **Admin panel** → `https://github.com/root-Akira/Nutyum-admin` (separate repo)

## Session: 2026-07-02

### Completed
- [x] **Admin panel** scaffolded — Vite + React 19 + TS 6 + Tailwind v4
- [x] Auth, Dashboard, Products (list/form), Orders (list/detail), Customers, Reviews, Coupons, CMS, Settings (shipping/payments/site)

## Session: 2026-07-08

### Completed
- [x] **Loading states & flash fixes** — shop page no longer shows `STATIC_PRODUCTS` fallback then replaces with real data (shows spinner while loading); product detail page same pattern; API caching headers (`s-maxage=30, stale-while-revalidate=60`) on `/api/products`
- [x] **Block/unblock customers** — admin detail page: Block/Unblock button with ConfirmModal; uses `supabaseAdmin.auth.admin.updateUserById()` with `ban_duration: '876000h'` (block) or `'none'` (unblock); syncs `is_blocked` to `public.users`; invalidates customer list query on success
- [x] **Blocked badge on customer list** — added `blocked` status to `StatusBadge` (red "Blocked" label); list uses `'blocked'` instead of `'cancelled'`
- [x] **Blocked user sign-in message** — `CredentialsSignin` subclass `BlockedError` with code `"blocked"`; `auth.ts` checks `users.is_blocked` before sign-in; `SignInForm.tsx` shows "Your account has been blocked. Please contact support." on `result.code === "blocked"`
- [x] **Session invalidation for blocked users** — `jwt` callback queries `users.is_blocked` on every request; returns empty token if blocked, effectively logging them out
- [x] **Loading states** — `loading.tsx` at `app/`, `app/shop/`, `app/shop/[slug]/`, `app/account/`; spinner on `/account/profile` page while profile data loads; form skeletons on admin `product-form.tsx` and `coupon-form.tsx` edit modes; loading state on `/account/account-settings` profile section
- [x] **Account redirect fix** — moved `/account` → `/account/profile` redirect from `page.tsx` to `next.config.ts` `async redirects()`; deleted `app/account/page.tsx` to eliminate `AccountPage` `performance.measure()` error
- [x] **Banners removed** — deleted `banners.tsx`, removed from `App.tsx` lazy import + route, removed from `sidebar.tsx` nav link + `ImageIcon` import, removed from `dashboard-layout.tsx` path map
- [x] **CMS Pages connected** — `GET /api/cms/content?slug=:slug` API route; `/pages/[slug]` dynamic route renders HTML content with prose styles; `lib/cms.ts` shared fetch helper; admin CMS Pages has "Seed Default Pages" button (inserts about/faq/contact with default HTML via `upsert ignoreDuplicates`)
- [x] **Out of stock button fix** — added `variantsLoading` state; `outOfStock` now waits for variants to finish loading before deciding, preventing "Add to Cart" flash when all variants are OOS
- [x] **You May Also Like alignment** — horizontal scroll cards now have fixed `w-[260px]` wrapper for consistent card sizing
- [x] **Wishlist heart on BestSellers** — added WishlistButton to BestSellers product cards
- [x] **ProductCard responsive width** — `w-full max-w-[260px]` instead of fixed `w-[260px]` to eliminate gap in grid layouts
- [x] **Sidebar Sign Out** — moved from Account Settings page to sidebar below Account Settings
- [x] **Hydration fix** — replaced `next-themes` with passthrough provider to eliminate DOM attribute mismatch
- [x] **Account section audit** — all pages and API routes verified (Profile, Orders, Wishlist, Account Settings, addresses, change password)
- [x] **Coming Soon products** — `isComingSoon` + `launchDate` on Product type, DB migration (0004), seed update, badge logic, purchase disabled
- [x] **BestSellers tabs** — toggle between Best Sellers / Coming Soon with original gold badge design; "We are planning to bring something new!" when empty
- [x] **Our Origins icons** — emojis replaced with lucide SVG icons (Leaf, Globe, Mountain) + glass effect
- [x] **No-action-without-permission rule** — added to AGENTS.md

#### Main Website
- [x] **Set `is_best_seller=true` on DB products** — 3 products already flagged ✅
- [ ] **Razorpay payments** integration (High)
- [ ] **Google OAuth** — configure `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET` (Medium)
- [x] **Error boundaries** — `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx` created
- [x] **Align DB schemas** — added `is_out_of_stock`, `image_alts`, `compare_price`, `sku`, `stock` + TypeScript types + `mapDbToProduct` mapping
- [ ] **Bulk Order page** — replace static wholesale page with real inquiry form + API (pending client feedback)

#### Admin Panel — Setup
- [x] **Run `supabase-migration.sql`** in Supabase SQL Editor — all 10 tables created, default data inserted, users synced ✅
- [x] **Tighten RLS policies** — admin role only (ss5494602@gmail.com) ✅
- [x] **Zod validation** on admin forms — product, coupon, site settings forms (High/Medium)
- [ ] **Configure SMTP** for production email sending (password reset, order confirmations) (Low)

#### Admin Panel — Features Not Yet Built
- [x] Variants per product (pack sizes / flavors)
- [x] Bulk actions (prices, stock, delete)
- [x] Stock history / low-stock threshold config
- [ ] Invoice generation / packing slips
- [x] Block/unblock customers
- [ ] Auto-discounts
- [ ] Promotional pop-ups
- [ ] Courier partner integration
- [ ] Refund management
- [ ] GST / tax settings
- [ ] Analytics & reports (CSV export)
- [ ] Marketing tools (abandoned cart, campaigns, referral)
- [ ] Email/SMS notification templates
- [ ] Activity log / role-based access / auto-logout

#### Deployment
- [x] **Main site** live at `https://nutyum.in` ✅
- [x] **Admin panel** live at `https://admin.nutyum.in` ✅
- [ ] **Google OAuth** — configure `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET` (needs Cloud Console setup)
- [ ] **SMTP** — configure for production email

#### Blocked (need Supabase Dashboard SQL Editor)
- [ ] Direct Postgres unreachable (IPv6 only, no route)
- [x] `public.users` table + auth trigger created ✅
- [x] `admin_reply` column on `reviews` — Storage JSON fallback removed, using DB directly ✅
- [ ] DB schema drift on `products` table
- [x] `ALTER TABLE coupons ADD COLUMN IF NOT EXISTS show_in_store BOOLEAN NOT NULL DEFAULT false;` — done ✅

---

## Nutyum Admin Panel — `/home/akira/Downloads/nutyum-admin/`

### Tech Stack
- **Vite 8 + React 19 + TypeScript 6 + Tailwind v4**
- **Supabase JS client** (same project as main Nutyum)
- **React Router v7** — SPA routing, lazy-loaded pages
- **TanStack Query v5** — server state, cache, refetch intervals
- **Lucide React** — icons (matches main site)

### Theme
Nutyum palette: `#173D22` (green primary), `#E0961A` (gold accent), `#FAF7EE` (cream bg), `#FFFEFB` (card bg)

### Features Built

| # | Section | Pages | Status |
|---|---------|-------|--------|
| 1 | **Auth** | Login, ProtectedRoute, session timeout | ✅ |
| 2 | **Dashboard** | Stats cards (orders/revenue/pending/low-stock), recent orders, top products | ✅ |
| 3 | **Products** | List (search), Add/Edit form (images, stock, price, SEO, coming-soon toggle, tags, nutrition, ingredients, categories, vibes) | ✅ |
| 4 | **Orders** | List (filter by status, search), Detail (items, address, timeline, status update, tracking, internal notes, status history) | ✅ |
| 5 | **Customers** | List (search), Detail (profile, order history, addresses, stats) | ✅ |
| 6 | **Reviews** | Pending/approved tabs, approve/reject/delete, admin reply modal | ✅ |
| 7 | **Coupons** | List (search), Add/Edit form (type, value, min-order, dates, usage limits) | ✅ |
| 8 | **CMS** | Banners (add/delete/reorder), CMS Pages (list/edit HTML content), Vibes (add/list/delete) | ✅ |
| 9 | **Settings** | Shipping zones (add/delete), Payments (transaction log), Site Settings (store info, COD, maintenance mode, social links) | ✅ |

### Running
```bash
cd /home/akira/Downloads/nutyum-admin
npm run dev      # Vite dev server (default port 5173)
npm run build    # tsc + vite build
```

## Session: 2026-07-21
- [x] **COD payment implemented** — checkout page shows Pay Online / Cash on Delivery radio buttons (fetches `cod_enabled`/`cod_charge` from `/api/site-settings`). COD charge replaces shipping cost when > 0 (shows "₹X (COD)" instead of "FREE"). Order API handles COD flow: skips Razorpay, confirms immediately, sends confirmation email, clears cart.
- [x] **Footer** — removed Shop column. Connect column shows store email/phone/address/GST fetched from site_settings. Removed Blog link. Removed Journal from navbar.
- [x] **Admin site settings** — removed Currency and Low Stock Threshold fields (user wanted only COD options). Low Stock Threshold restored on request. Currency hardcoded as INR.

## Session: 2026-07-17
- [x] **Production login fixed** — `NEXT_PUBLIC_SUPABASE_URL` at module scope was `undefined` in auth server chunk (webpack DefinePlugin didn't inline it). Fixed by using `SUPABASE_URL` (non-public, runtime `process.env`) as primary fallback across all server files.
- [x] **All DB operations fixed** — Same `NEXT_PUBLIC_` replacement issue affected `supabase-fetch.ts`, `cms.ts`, `products.ts`, and all API routes. Fixed all 7+ files.
- [x] **Admin panel env vars added** — `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_SERVICE_ROLE` configured on Vercel.
- [x] **Main website** — Login, cart, wishlist, addresses, profile, products, reviews, CMS pages all verified connected to database and working.
- [x] **Admin panel** — Login page rendering at `admin.nutyum.in`.
- [x] **Google OAuth** — Configured `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET` on Vercel. Auto-links new/existing Supabase Auth users by email. Working at `nutyum.in/signin`.
- [x] **SMTP/Emails** — Resend configured via Supabase SMTP. Custom HTML templates for Confirm Signup + Reset Password. Transactional email helper (`lib/email.ts`) built with order confirmation/shipping/cancellation templates.
- [x] **Client-side Supabase fix** — Moved forgot password to server-side API route to avoid `NEXT_PUBLIC_` replacement issue. Reset password form uses hardcoded Supabase URL fallback.
- [x] **Pending:** Razorpay payments + Checkout page (needed for order emails to work).

### DB Tables Needed in Supabase
- `orders` — order data with status/payment tracking
- `order_items` — line items per order
- `order_status_logs` — status change history
- `products` — product details (already exists)
- `reviews` — customer reviews (already exists)
- `coupons` — discount coupons
- `banners` — homepage banners
- `cms_pages` — static page content
- `shipping_zones` — shipping rates by region
- `site_settings` — store-wide config (single row)
- `users` — customer profiles (already exists in auth schema)
