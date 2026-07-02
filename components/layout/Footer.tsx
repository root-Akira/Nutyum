import Link from "next/link";

const COLUMNS = [
  {
    label: "Shop",
    links: [
      { name: "All Products", href: "/shop" },
      { name: "Flavors", href: "/shop" },
      { name: "Combos", href: "/shop" },
      { name: "Subscribe & Save", href: "/shop" },
    ],
  },
  {
    label: "Support",
    links: [
      { name: "Track Order", href: "/support" },
      { name: "Returns", href: "/returns" },
      { name: "FAQs", href: "/faq" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Our Story", href: "/learn" },
      { name: "Blog", href: "/journal" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#173D22]">
      {/* ── Top Section ── */}
      <div className="mx-auto max-w-[1400px] px-6 pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-28">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
          {/* Tagline */}
          <div className="lg:w-[35%]">
            <h2
              className="text-3xl font-semibold leading-tight text-[#FAF7EE] sm:text-4xl"
              style={{ fontFamily: "var(--font-body), sans-serif" }}
            >
              Premium makhana,
              <br />
              thoughtfully roasted.
            </h2>
            <p
              className="mt-4 text-sm leading-relaxed text-[#C4D0BC]"
              style={{ fontFamily: "var(--font-body), sans-serif" }}
            >
              Real ingredients. Every snack, every time.
            </p>
          </div>

          {/* 4-column grid */}
          <div className="flex flex-1 flex-wrap gap-x-12 gap-y-10 sm:grid-cols-2 lg:flex lg:gap-14 xl:gap-20">
            {COLUMNS.map((col) => (
              <div key={col.label} className="min-w-[120px]">
                <p
                  className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C4D0BC]"
                  style={{ fontFamily: "var(--font-body), sans-serif" }}
                >
                  {col.label}
                </p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#FAF7EE] transition-colors hover:text-[#E0961A]"
                        style={{ fontFamily: "var(--font-body), sans-serif" }}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Connect column */}
            <div className="min-w-[120px]">
              <p
                className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C4D0BC]"
                style={{ fontFamily: "var(--font-body), sans-serif" }}
              >
                Connect
              </p>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C4D0BC] text-[#FAF7EE] transition-colors hover:border-[#E0961A] hover:text-[#E0961A]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C4D0BC] text-[#FAF7EE] transition-colors hover:border-[#E0961A] hover:text-[#E0961A]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C4D0BC] text-[#FAF7EE] transition-colors hover:border-[#E0961A] hover:text-[#E0961A]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H8l-4 2 1.5-4.5A8.5 8.5 0 1 1 21 11.5z" />
                    <path d="M9 10.5a1 1 0 0 1 1-1h.5a1 1 0 0 1 1 1v.5a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-.5z" />
                    <path d="M13.5 10.5a1 1 0 0 1 1-1H15a1 1 0 0 1 1 1v.5a1 1 0 0 1-1 1h-.5a1 1 0 0 1-1-1v-.5z" />
                    <path d="M10 14c.5.5 1.3 1 2 1s1.5-.5 2-1" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p
          className="mt-16 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9DB896]"
          style={{ fontFamily: "var(--font-body), sans-serif" }}
        >
          &copy; 2026 &middot; NUTYUM &middot; ALL RIGHTS RESERVED
        </p>
      </div>

      {/* ── Giant Wordmark ── */}
      <div
        className="select-none leading-[0.7] text-[clamp(6rem,30vw,18rem)] font-bold tracking-[-0.03em] text-[#1E4A2D]"
        style={{
          fontFamily: "var(--font-body), sans-serif",
          marginTop: "-0.15em",
          marginBottom: "-0.12em",
          lineHeight: "0.7",
          paddingLeft: "clamp(0px, 2vw, 40px)",
        }}
        aria-hidden="true"
      >
        NUTYUM
      </div>
    </footer>
  );
}
