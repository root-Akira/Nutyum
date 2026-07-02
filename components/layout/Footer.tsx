import Link from "next/link";

const COLUMNS = [
  {
    label: "Shop",
    links: [
      { name: "All Products", href: "/shop" },
      { name: "Flavors", href: "/shop" },
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
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/journal" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#173D22]">
      {/* ── Top Section ── */}
      <div className="mx-auto max-w-[1400px] px-6 pt-12 pb-10 sm:pt-16 sm:pb-12 lg:pt-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* Tagline */}
          <div className="lg:w-[35%]">
            <h2 className="text-3xl font-semibold leading-tight text-[#FAF7EE] sm:text-4xl">
              Premium makhana,
              <br />
              thoughtfully roasted.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#C4D0BC]">
              Real ingredients. Every snack, every time.
            </p>
          </div>

          {/* 4-column grid */}
          <div className="flex flex-1 flex-wrap gap-x-12 gap-y-10 sm:grid-cols-2 lg:flex lg:gap-14 xl:gap-20">
            {COLUMNS.map((col) => (
              <div key={col.label} className="min-w-[120px]">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C4D0BC]">
                  {col.label}
                </p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#FAF7EE] transition-colors hover:text-[#E0961A]"
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
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C4D0BC]">
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
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C4D0BC] text-[#FAF7EE] transition-colors hover:border-[#E0961A] hover:text-[#E0961A]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-10 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9DB896]">
          &copy; 2026 &middot; NUTYUM &middot; ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  );
}
