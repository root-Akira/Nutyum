"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Star, ShoppingBag, Menu, X, User } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { useUIStore } from "@/hooks/use-ui-store";
import { useSession } from "next-auth/react";
import { PRODUCTS as STATIC_PRODUCTS } from "@/data/products";
import type { Product } from "@/types";

// ─── Constants ─────────────────────────────────────────────────────────────────
const SCROLL_EASE = "cubic-bezier(0.5, 0, 0, 1)";
const FE: [number, number, number, number] = [0.5, 0, 0, 1];

// ─── Types ────────────────────────────────────────────────────────────────────
interface MegaNavItem {
  label: string;
  href: string;
  kind: "mega";
  columns: { heading: string; items: { label: string; href: string }[] }[];
  featured: { label: string; href: string; bg: string }[];
  cta: { label: string; href: string };
}
interface DropdownNavItem {
  label: string;
  href: string;
  kind: "dropdown";
  items: { label: string; href: string }[];
}
interface PlainNavItem {
  label: string;
  href: string;
  kind: "plain";
  icon?: React.ElementType;
}
type LeftNavItem = MegaNavItem | DropdownNavItem | PlainNavItem;

// ─── Nav data ─────────────────────────────────────────────────────────────────
const LEFT_NAV: LeftNavItem[] = [
  {
    label: "Shop",
    href: "/shop",
    kind: "mega",
    columns: [
      {
        heading: "All Flavours",
        items: [
          { label: "All Products", href: "/shop" },
          { label: "Himalayan Sea Salt", href: "/shop/himalayan-sea-salt" },
          { label: "Peri Peri", href: "/shop/peri-peri" },
          { label: "Dark Chocolate", href: "/shop/dark-chocolate" },
          { label: "Classic Pudina", href: "/shop/classic-pudina" },
        ],
      },
      {
        heading: "By Need",
        items: [
          { label: "High Protein", href: "/shop" },
          { label: "Low Calorie", href: "/shop" },
          { label: "Guilt-Free Snacks", href: "/shop" },
          { label: "Gift Packs", href: "/shop" },
        ],
      },
    ],
    featured: [
      { label: "Himalayan Sea Salt", href: "/shop/himalayan-sea-salt", bg: "#D4EDD8" },
      { label: "Peri Peri", href: "/shop/peri-peri", bg: "#FFE8CC" },
      { label: "Dark Chocolate", href: "/shop/dark-chocolate", bg: "#E8D8D8" },
    ],
    cta: { label: "Shop All Makhana", href: "/shop" },
  },
  {
    label: "Learn",
    href: "/learn",
    kind: "dropdown",
    items: [
      { label: "What is Makhana?", href: "/learn/what-is-makhana" },
      { label: "Health Benefits", href: "/learn/benefits" },
      { label: "How it's Made", href: "/learn/process" },
    ],
  },
  { label: "Reviews", href: "/reviews", kind: "plain", icon: Star },
];

const RIGHT_NAV = [
  { label: "My Account", href: "/account" },
  { label: "Wholesale Partners", href: "/wholesale" },
  { label: "Snack Journal", href: "/journal" },
];

// Flat list used by mobile drawer
const MOBILE_NAV = [
  ...LEFT_NAV.map(({ label, href }) => ({ label, href })),
  ...RIGHT_NAV,
];

// ─── Mega Menu Panel ──────────────────────────────────────────────────────────
function MegaMenuPanel({ item, products }: { item: MegaNavItem; products: Product[] }) {
  return (
    <motion.div
      key="mega-panel"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.35, ease: FE }}
      className="absolute top-full left-0 right-0 border-t border-[rgba(23,61,34,0.08)] bg-[#FAF7EE] shadow-[0_24px_64px_rgba(23,61,34,0.14)]"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-[auto_1fr] gap-20 px-10 py-10">
        {/* ── Link columns ── */}
        <div className="flex gap-16">
          {item.columns.map((col, colIdx) => (
            <div key={col.heading}>
              <p
                className="mb-5 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#4C5A48]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.items.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-[#173D22] transition-opacity hover:opacity-50"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {/* CTA pill under first column */}
              {colIdx === 0 && (
                <Link
                  href={item.cta.href}
                  className="mt-8 inline-flex items-center rounded-full border border-[#173D22] px-5 py-2 text-[10px] font-medium tracking-[0.14em] uppercase text-[#173D22] transition-all hover:bg-[#173D22] hover:text-white"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.cta.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* ── Featured products ── */}
        <div>
          <p
            className="mb-5 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#4C5A48]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Shop Best Sellers
          </p>
          <div className="grid grid-cols-3 gap-3">
            {products.map((prod) => (
              <Link
                key={prod.id}
                href={`/shop/${prod.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl"
                style={{ backgroundColor: prod.bgColor }}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={prod.images[0] || "/placeholder.png"}
                    alt={prod.name}
                    fill
                    sizes="(max-width: 768px) 33vw, 200px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-4 pb-4 pt-2">
                  <span
                    className="text-[13px] font-medium text-[#173D22] group-hover:underline"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {prod.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Simple Dropdown ──────────────────────────────────────────────────────────
function SimpleDropdown({ items }: { items: { label: string; href: string }[] }) {
  return (
    <motion.div
      key="simple-dropdown"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.35, ease: FE }}
      className="absolute top-full left-0 mt-1 min-w-[220px] rounded-xl border border-[rgba(23,61,34,0.08)] bg-[#FAF7EE] py-2 shadow-[0_20px_60px_rgba(23,61,34,0.12)]"
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block px-5 py-3 text-[14px] text-[#173D22] transition-colors hover:bg-[rgba(23,61,34,0.04)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {item.label}
        </Link>
      ))}
    </motion.div>
  );
}

// ─── Left Nav Item ─────────────────────────────────────────────────────────────
function LeftNavItem({
  item,
  isOpen,
  onEnter,
}: {
  item: LeftNavItem;
  isOpen: boolean;
  onEnter: () => void;
}) {
  const hasMenu = item.kind !== "plain";

  return (
    <div
      className={item.kind === "dropdown" ? "relative" : "static"}
      onMouseEnter={onEnter}
    >
      <Link
        href={item.href}
        className="flex items-center gap-2 text-[#173D22] transition-opacity hover:opacity-60"
        style={{
          fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
          fontSize: "19px",
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        {item.kind === "plain" && item.icon && (
          <item.icon size={15} strokeWidth={1.5} className="fill-[#E0961A] text-[#E0961A]" aria-hidden />
        )}
        {item.label}
        {hasMenu && (
          <span
            className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-current transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden
          >
            <ChevronDown size={10} strokeWidth={2.5} />
          </span>
        )}
      </Link>

      {item.kind === "dropdown" && (
        <AnimatePresence>
          {isOpen && <SimpleDropdown items={item.items} />}
        </AnimatePresence>
      )}
    </div>
  );
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────
function MobileDrawer({ isOpen, onClose, session }: { isOpen: boolean; onClose: () => void; session: any }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.45, ease: FE }}
            className="fixed inset-y-0 left-0 z-50 w-[min(320px,85vw)] overflow-y-auto bg-[#FAF7EE] py-6 shadow-[4px_0_40px_rgba(23,61,34,0.15)]"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between border-b border-[rgba(23,61,34,0.1)] px-6 pb-4">
              <Image
                src="/logo.png"
                alt="Nutyum"
                width={120}
                height={42}
                className="object-contain"
                style={{ height: "36px", width: "auto" }}
              />
              <button onClick={onClose} aria-label="Close menu" className="p-1 text-[#173D22]">
                <X size={20} strokeWidth={1.6} />
              </button>
            </div>
            <nav className="px-6 py-4" aria-label="Mobile navigation links">
              {LEFT_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="block border-b border-[rgba(23,61,34,0.06)] py-3.5 text-base font-medium text-[#173D22]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.label}
                </Link>
              ))}
              {session?.user ? (
                <Link
                  href="/account"
                  onClick={onClose}
                  className="block border-b border-[rgba(23,61,34,0.06)] py-3.5 text-base font-medium text-[#173D22]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  My Account
                </Link>
              ) : (
                <Link
                  href="/signin"
                  onClick={onClose}
                  className="block border-b border-[rgba(23,61,34,0.06)] py-3.5 text-base font-medium text-[#173D22]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Sign In
                </Link>
              )}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export function Navbar({ cartItemCount = 0 }: { cartItemCount?: number }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [topProducts, setTopProducts] = useState<Product[]>(
    STATIC_PRODUCTS.slice(0, 3)
  );
  const closeTimerRef = useRef<number | undefined>(undefined);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) setTopProducts(data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenMenu(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleNavEnter = (label: string, hasMenu: boolean) => {
    window.clearTimeout(closeTimerRef.current);
    setOpenMenu(hasMenu ? label : null);
  };
  const scheduleClose = useCallback(() => {
    closeTimerRef.current = window.setTimeout(() => setOpenMenu(null), 200);
  }, []);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setTimeout(() => hamburgerRef.current?.focus(), 10);
  }, []);

  const activeMega = LEFT_NAV.find(
    (item) => item.kind === "mega" && openMenu === item.label
  ) as MegaNavItem | undefined;

  const { data: session } = useSession();

  return (
    <>
      <AnnouncementBar />

      <motion.header
        className="sticky top-0 z-40 bg-[#FFFEFB]"
        style={{
          boxShadow: scrolled
            ? "0 4px 24px rgba(0,0,0,0.10)"
            : "0 2px 12px rgba(0,0,0,0.06)",
          transition: `box-shadow 0.4s ${SCROLL_EASE}`,
        }}
        onMouseLeave={scheduleClose}
      >
        <motion.div
          className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-8"
          animate={{ height: scrolled ? 86 : 97 }}
          transition={{ type: "spring", stiffness: 180, damping: 22 } as any}
        >
          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary navigation">
            {LEFT_NAV.map((item) => (
              <LeftNavItem
                key={item.href}
                item={item}
                isOpen={openMenu === item.label}
                onEnter={() => handleNavEnter(item.label, item.kind !== "plain")}
              />
            ))}
          </nav>

          <Link
            href="/"
            aria-label="Nutyum — go to homepage"
            className="justify-self-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173D22] focus-visible:ring-offset-2 rounded-sm"
          >
            <Image
              src="/logo.png"
              alt="Nutyum — Real Food. Real Good."
              width={160}
              height={56}
              priority
              unoptimized
              className="object-contain"
              style={{
                height: "70px",
                width: "auto",
                transition: `height 0.8s ${SCROLL_EASE}`,
              }}
            />
          </Link>

          <div className="ml-auto hidden items-center gap-6 lg:flex" aria-label="Secondary navigation">
            <Link
              href="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[#173D22] transition-opacity hover:opacity-50"
              style={{
                fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
                fontSize: "19px",
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              Home
            </Link>
            <Link
              href="/wholesale"
              className="text-[#173D22] transition-opacity hover:opacity-50"
              style={{
                fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
                fontSize: "19px",
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              Wholesale
            </Link>
            <Link
              href="/journal"
              className="text-[#173D22] transition-opacity hover:opacity-50"
              style={{
                fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
                fontSize: "19px",
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              Journal
            </Link>
            {session?.user ? (
              <Link
                href="/account"
                className="flex items-center gap-1.5 text-[#173D22] transition-opacity hover:opacity-50"
                style={{
                  fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
                  fontSize: "19px",
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                <User size={14} strokeWidth={1.8} aria-hidden="true" />
                {session.user.name?.split(" ")[0] || "Account"}
              </Link>
            ) : (
              <Link
                href="/signin"
                className="text-[#173D22] transition-opacity hover:opacity-50"
                style={{
                  fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
                  fontSize: "19px",
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                Sign In
              </Link>
            )}

            <span className="h-4 w-px bg-[rgba(23,61,34,0.2)]" aria-hidden="true" />

            <button
              type="button"
              onClick={() => useUIStore.getState().openCart()}
              aria-label={cartItemCount > 0 ? `Cart, ${cartItemCount} items` : "Cart"}
              className="relative text-[#173D22] transition-opacity hover:opacity-50"
            >
              <ShoppingBag size={17} strokeWidth={1.8} aria-hidden="true" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E0961A] text-[9px] font-bold text-white">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </button>
          </div>

          <div className="ml-auto flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => useUIStore.getState().openCart()}
              aria-label="Cart"
              className="relative text-[#173D22]"
            >
              <ShoppingBag size={20} strokeWidth={1.7} aria-hidden="true" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E0961A] text-[9px] font-bold text-white">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </button>
            <button
              ref={hamburgerRef}
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              onClick={openMobile}
              className="text-[#173D22]"
            >
              <Menu size={22} strokeWidth={1.7} aria-hidden="true" />
            </button>
          </div>
        </motion.div>

        {/* ── Mega menu panel (full-width, anchored to header) ── */}
        <AnimatePresence>
          {activeMega && <MegaMenuPanel item={activeMega} products={topProducts} />}
        </AnimatePresence>
      </motion.header>

      <MobileDrawer isOpen={mobileOpen} onClose={closeMobile} session={session} />
    </>
  );
}
