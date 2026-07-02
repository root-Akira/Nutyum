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

### Repositories
- **Main website** → `https://github.com/root-Akira/Nutyum` (this repo)
- **Admin panel** → `https://github.com/root-Akira/Nutyum-admin` (separate repo, linked below)

## Session: 2026-07-02 (cont'd)

### Completed
- [x] **Navbar height reduced to 70px** — changed from animated 86/97px to fixed 70px; updated hero offset
- [x] **Hero carousel smooth slide animation** — `mode="sync"` with opacity fade, ease-in-out, `willChange: transform`, preloaded images
- [x] **Navbar glass effect** — `bg-[#FFFEFB]/70 backdrop-blur-xl`
- [x] **Admin panel scaffolded** — `/home/akira/Downloads/nutyum-admin/` — Vite + React 19 + TypeScript 6 + Tailwind v4
- [x] **Admin panel: Foundation** — routing, auth, layout (sidebar/navbar), UI components (toast/skeleton/modal/button/input/table/badge)
- [x] **Admin panel: Dashboard** — stats cards, recent orders, top-selling products (TanStack Query with 30s refetch)
- [x] **Admin panel: Products** — list (search, status badges, delete), form (images, tags, SEO, nutrition, coming-soon toggle)
- [x] **Admin panel: Orders** — list (filter by status, search), detail (items, address, status update, tracking, notes, status history)
- [x] **Admin panel: Customers** — list (search), detail (profile, order history, addresses, stats)
- [x] **Admin panel: Reviews** — pending/approved tabs, approve/reject/delete, admin reply modal
- [x] **Admin panel: Coupons** — list (search), form (type, value, dates, usage limits)
- [x] **Admin panel: CMS** — banners (add/delete), CMS pages (list/edit HTML content)
- [x] **Admin panel: Settings** — shipping zones (add/delete), payments (transaction log), site settings (store info, COD, maintenance mode, social links)

### Still Pending
- [ ] Razorpay payments

## Session: 2026-07-02 (cont'd)

### Completed
- [x] **Admin panel: RLS fix** — separated supabase clients (anon key for auth, service role for data queries) so login doesn't override the service role key
- [x] **Admin panel: Image upload** — file upload to Supabase Storage `product-images` bucket in product form; `Upload` button alongside URL input
- [x] **Supabase Storage bucket** — created `product-images` bucket (public), uploaded all asset images
- [x] **DB images updated** — all 8 product records now use Supabase Storage URLs instead of relative paths
- [x] **Main site: all image paths migrated** — `data/products.ts`, `db/seed.ts`, `HeroCarousel.tsx`, `BrandPanel.tsx`, `OurOrigins.tsx`, `Navbar.tsx` now use Storage URLs; placeholder fallbacks updated
- [x] **Hydration fix** — `suppressHydrationWarning` on `<body>` (Grammarly extension interference)
- [x] **next/image config** — added `remotePatterns` for Supabase Storage hostname in `next.config.ts`
- [x] **ProductCard clickable** — wrapped in `<Link href="/shop/{slug}">`; Add to Cart and WishlistButton use `e.stopPropagation()` to avoid navigation
- [x] **ProductCard bgColor fallback** — `#f0ece4` default when `bg_color` is null
- [x] **You May Also Like scroll arrows** — left/right buttons with hidden scrollbar, fixed-width cards
- [x] **Navbar Best Sellers filter** — only shows `isBestSeller` products, sliced to 3
- [x] **Demo product fixed** — `bg_color`, `rating`, `review_count`, `description` updated via API
- [x] **GitHub push** — `bd6a4c8` (ProductCard clickable, scroll arrows, best seller filter, demo fix, wishlist stopPropagation)

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
| 3 | **Products** | List (search), Add/Edit form (images, stock, price, SEO, coming-soon toggle, tags, nutrition, ingredients, categories) | ✅ |
| 4 | **Orders** | List (filter by status, search), Detail (items, address, timeline, status update, tracking, internal notes, status history) | ✅ |
| 5 | **Customers** | List (search), Detail (profile, order history, addresses, stats) | ✅ |
| 6 | **Reviews** | Pending/approved tabs, approve/reject/delete, admin reply modal | ✅ |
| 7 | **Coupons** | List (search), Add/Edit form (type, value, min-order, dates, usage limits) | ✅ |
| 8 | **CMS** | Banners (add/delete/reorder), CMS Pages (list/edit HTML content) | ✅ |
| 9 | **Settings** | Shipping zones (add/delete), Payments (transaction log), Site Settings (store info, COD, maintenance mode, social links) | ✅ |

### Not Yet Built
- Variants per product (pack sizes / flavors)
- Bulk actions (prices, stock, delete)
- Stock history / low-stock threshold config
- Invoice generation / packing slips
- Block/unblock customers
- Auto-discounts
- Subscriptions (Subscribe & Save)
- Promotional pop-ups
- Courier partner integration
- Refund management
- GST / tax settings
- Analytics & reports (CSV export)
- Marketing tools (abandoned cart, campaigns, referral)
- Email/SMS notification templates
- Activity log / role-based access / auto-logout

### Running
```bash
cd /home/akira/Downloads/nutyum-admin
npm run dev      # Vite dev server (default port 5173)
npm run build    # tsc + vite build
```

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
