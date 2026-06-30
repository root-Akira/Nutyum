import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Snack Journal | Nutyum",
  description: "Stories, recipes, and deep dives into the world of makhana.",
};

const POSTS = [
  {
    title: "Why Makhana is the Perfect Post-Workout Snack",
    excerpt: "Packed with protein and low in calories — here is why athletes are turning to this ancient seed.",
    slug: "#",
    date: "Coming Soon",
  },
  {
    title: "5 Delicious Ways to Eat Makhana",
    excerpt: "From trail mixes to dessert toppings — get creative with your crunch.",
    slug: "#",
    date: "Coming Soon",
  },
  {
    title: "The History of Lotus Seeds in Indian Cuisine",
    excerpt: "Tracing the journey of makhana from temple offerings to modern superfood.",
    slug: "#",
    date: "Coming Soon",
  },
];

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Snack Journal
        </h1>
        <p className="mb-12 text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          Stories, recipes, and deep dives into the world of makhana.
        </p>

        <div className="space-y-6">
          {POSTS.map((post) => (
            <Link
              key={post.title}
              href={post.slug}
              className="group block rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8 transition-all hover:border-[#173D22] hover:shadow-lg"
            >
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                {post.date}
              </p>
              <h2 className="mb-2 text-xl font-semibold text-[#173D22] group-hover:text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                {post.title}
              </h2>
              <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
