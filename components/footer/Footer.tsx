import Link from "next/link";
import { FOOTER_COLUMNS } from "@/data/footer";

export function Footer() {
  return (
    <footer className="bg-[#FAF7EE]" aria-label="Site footer">

      {/* ── 6-column link grid ── */}
      <div className="mx-auto max-w-[1400px] border-t border-[rgba(23,61,34,0.1)] px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3
                className="mb-4 text-[11px] font-extrabold uppercase tracking-widest text-[#173D22]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {col.heading}
              </h3>
              <ul className="space-y-2.5" role="list">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[#4C5A48] transition-colors hover:text-[#173D22]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Large brand name + legal row (Two Leaves style) ── */}
      <div className="border-t border-[rgba(23,61,34,0.1)]">
        <div className="mx-auto max-w-[1400px] px-8 pt-8 pb-12">
          {/* Large Nutyum wordmark */}
          <div className="mb-6 overflow-hidden">
            <p
              className="font-medium leading-none tracking-[-0.04em] text-[#173D22] select-none"
              style={{
                fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
                fontSize: "clamp(5rem, 18vw, 16rem)",
                opacity: 0.08,
              }}
              aria-hidden="true"
            >
              Nutyum
            </p>
          </div>

          {/* Legal row */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p
              className="text-xs text-[#4C5A48]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              © {new Date().getFullYear()} Nutyum. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4">
              {["Terms", "Privacy", "Cookies", "Accessibility"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-xs text-[#4C5A48] transition-colors hover:text-[#173D22]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
