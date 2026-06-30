import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Learn About Makhana | Nutyum",
  description: "Discover the health benefits, process, and story behind premium makhana snacks.",
};

const TOPICS = [
  {
    title: "What is Makhana?",
    desc: "Discover the ancient superfood that has been cherished for centuries.",
    href: "/learn/what-is-makhana",
  },
  {
    title: "Health Benefits",
    desc: "Rich in protein, antioxidants, and essential minerals.",
    href: "/learn/benefits",
  },
  {
    title: "How it's Made",
    desc: "From lotus seeds to perfectly roasted makhana snacks.",
    href: "/learn/process",
  },
];

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Learn About Makhana
        </h1>
        <p className="mb-12 text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          Everything you need to know about the superfood that is taking the snacking world by storm.
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
