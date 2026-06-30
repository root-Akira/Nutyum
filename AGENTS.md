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

## Session: 2026-06-29

### Completed
- [x] Full codebase analysis (every file read and understood)
- [x] PRD, TRD, Architecture, Brand Guide generated as 4 .docx files
- [x] All .docx files validated successfully
- [x] Documents merged, reviewed, and fixed → `docs/Nutyum-master-doc.docx`
- [x] AGENTS.md tracking established
- [x] **Phase 1: Foundation** ✅
  - [x] TypeScript types (`types/index.ts`)
  - [x] Data layer (`data/` — 5 files: products, navigation, footer, hero, barrel)
  - [x] shadcn/ui components installed (10 components)
  - [x] Zustand stores (`hooks/use-cart-store.ts`, `hooks/use-ui-store.ts`)
  - [x] Utility functions (`lib/formatters.ts`, `lib/constants.ts`)
- [x] **Phase 2: E-Commerce Layer** ✅
  - [x] ProductCard component (`components/products/ProductCard.tsx`)
  - [x] Cart drawer with quantity controls (`components/cart/CartDrawer.tsx`, `CartItem.tsx`)
  - [x] Search overlay (`components/search/SearchOverlay.tsx`)
  - [x] Why Nutyum section (`components/why-nutyum/WhyNutyum.tsx`)
  - [x] Shop listing page with vibe filtering (`app/shop/page.tsx`)
  - [x] Product detail page (`app/shop/[slug]/page.tsx`)
- [x] **Layout Wiring** ✅
  - [x] LayoutShell component wrapping Navbar + children + CartDrawer + SearchOverlay
  - [x] CartDrawer made controllable (accepts `open`/`onOpenChange` props)
  - [x] uiStore extended with `cartOpen`, `openCart`, `closeCart`
  - [x] Navbar cart links (desktop + mobile) changed from `<Link href="/cart">` to `openCart()` calls
  - [x] WhyNutyum added to homepage between BrandPanel and Newsletter
  - [x] Full build (next build) — 0 errors, 6.4s
  - [x] Dev server — all 3 routes return HTTP 200
- [x] **Phase 3: Auth + Database** ✅
  - [x] NextAuth v5 installed + configured (Google OAuth + Credentials providers)
  - [x] Sign-in / sign-up pages (`/signin`, `/signup`)
  - [x] In-memory demo user store (survives hot reloads via globalThis)
  - [x] Sign-up API route (`POST /api/auth/signup`)
  - [x] Account page with profile info + sign out (`/account`)
  - [x] Navbar shows user state (Sign In / user name)
  - [x] Proxy.ts protects `/account` and `/checkout` routes
  - [x] Drizzle ORM + Supabase packages installed
  - [x] DB schema: products, orders, order_items, addresses
  - [x] Drizzle connection config + migration config + seed script
  - [x] Supabase client (`lib/supabase.ts`)
  - [x] auth.ts conditionally uses SupabaseAdapter when env vars are set
  - [x] `.env.example` documents all required variables
  - [x] Build — 0 errors, 8 routes
- [x] **Phase 3+: Content Pages** ✅
  - [x] `/learn` + sub-pages (`/what-is-makhana`, `/benefits`, `/process`) — full content
  - [x] `/wholesale` — retail, hospitality, corporate gifting info
  - [x] `/journal` — blog-style post listings
  - [x] Navbar dropdown links all resolve (no more 404s from primary nav)
- [x] **Performance** ✅
  - [x] Navbar scroll handler throttled with `requestAnimationFrame`
  - [x] All IntersectionObserver hooks removed (7 files) — replaced with simple mount animations
  - [x] `will-change-transform` added to all animated elements (GPU compositing)
  - [x] Horizontal scroll: `snap-x snap-mandatory` + `-webkit-overflow-scrolling: touch`
  - [x] Footer imports from shared `data/footer.ts` — dead links fixed
  - [x] Build: 0 errors, 15 routes

### Pending
- [ ] Phase 3+: Supabase/Drizzle integration, auth (NextAuth.js v5), payments (Razorpay)
- **Database:** Supabase (PostgreSQL) + Drizzle ORM
- **Auth:** NextAuth.js v5 → Supabase
- **Payments:** Razorpay (deferred to Phase 3)
- **Hero direction:** HeroCarousel (current) — keep both; decision pending
- **Data source:** Static TS files → Supabase API (Phase 2) → CMS (Phase 4)
- **State management:** Zustand (cartStore + uiStore)
- **No UI changes without explicit user request
- **Demo data:** `data/products.ts` contains 6 demo/test products with placeholder images. Fully commented with replacement instructions. Single source of truth — swap the array and everything updates.**

### Execution Rules
- Break work into parallel tasks using `task` tool
- Each agent gets a single clear goal with exit criteria
- Max 3 iterations per sub-task before escalating
- Update AGENTS.md after every session
- Update `docs/Nutyum-master-doc.docx` whenever code changes affect documented behavior
- Show summary before ending each session
