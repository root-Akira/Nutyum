import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What is Makhana? | Nutyum",
  description: "Learn about makhana — the ancient superfood made from lotus seeds.",
};

export default function WhatIsMakhanaPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Link href="/learn" className="mb-8 inline-block text-sm text-[#4C5A48] underline hover:text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
          ← Back to Learn
        </Link>
        <h1 className="mb-6 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          What is Makhana?
        </h1>
        <div className="prose prose-green max-w-none space-y-4 text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          <p>Makhana, also known as fox nuts or lotus seeds, is a nutritious seed harvested from the Euryale ferox plant native to Asia.</p>
          <p>For centuries, makhana has been a staple in Indian households, prized for its light, crunchy texture and impressive nutritional profile.</p>
          <p>At Nutyum, we roast these seeds to perfection, creating a snack that is both delicious and wholesome.</p>
        </div>
      </div>
    </main>
  );
}
