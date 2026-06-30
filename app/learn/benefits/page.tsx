import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Health Benefits of Makhana | Nutyum",
  description: "Discover the health benefits of makhana — high protein, antioxidants, and more.",
};

const BENEFITS = [
  { title: "High Protein", desc: "Excellent plant-based protein source for muscle health and satiety." },
  { title: "Rich in Antioxidants", desc: "Helps combat oxidative stress and supports overall wellness." },
  { title: "Low Glycemic Index", desc: "A diabetes-friendly snack that doesn't spike blood sugar." },
  { title: "Gluten-Free", desc: "Naturally gluten-free, suitable for those with dietary restrictions." },
  { title: "Digestive Health", desc: "Contains dietary fibre that supports healthy digestion." },
];

export default function BenefitsPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Link href="/learn" className="mb-8 inline-block text-sm text-[#4C5A48] underline hover:text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
          ← Back to Learn
        </Link>
        <h1 className="mb-6 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Health Benefits
        </h1>
        <div className="space-y-6">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6">
              <h2 className="mb-2 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                {b.title}
              </h2>
              <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
