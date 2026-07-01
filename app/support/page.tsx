import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support | Nutyum",
  description: "Get help with your Nutyum order — shipping, returns, FAQ, privacy and more.",
};

const TOPICS = [
  {
    title: "Contact Us",
    desc: "Reach our team via email — we respond within 24 hours.",
    href: "/contact",
  },
  {
    title: "FAQ",
    desc: "Answers to common questions about ingredients, shipping, returns and more.",
    href: "/faq",
  },
  {
    title: "Shipping Policy",
    desc: "Delivery timelines, charges, tracking, and lost package procedures.",
    href: "/shipping",
  },
  {
    title: "Returns & Refunds",
    desc: "7-day return policy for damaged or defective items.",
    href: "/returns",
  },
  {
    title: "Privacy Policy",
    desc: "How we collect, use, and protect your personal data.",
    href: "/privacy",
  },
  {
    title: "Terms of Service",
    desc: "The terms governing your use of our website and purchases.",
    href: "/terms",
  },
  {
    title: "Cookie Policy",
    desc: "How we use cookies and similar tracking technologies.",
    href: "/cookies",
  },
  {
    title: "Accessibility",
    desc: "Our commitment to making our website accessible to everyone.",
    href: "/accessibility",
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Support
        </h1>
        <p className="mb-12 text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          Everything you need to get help and understand how Nutyum works.
        </p>

        <div className="space-y-6">
          {TOPICS.map((topic) => (
            <Link
              key={topic.href}
              href={topic.href}
              className="group block rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8 transition-all hover:border-[#173D22] hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-semibold text-[#173D22] group-hover:text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                {topic.title}
              </h2>
              <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                {topic.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
