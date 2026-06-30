import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Makhana is Made | Nutyum",
  description: "From lotus seed harvest to perfectly roasted makhana — see our process.",
};

const STEPS = [
  { step: "01", title: "Harvest", desc: "Lotus seeds are carefully hand-harvested from freshwater ponds across Asia." },
  { step: "02", title: "Dried & Popped", desc: "Seeds are sun-dried then roasted at high heat until they pop into light, crunchy puffs." },
  { step: "03", title: "Seasoned", desc: "Each batch is tossed with natural seasonings — from Himalayan pink salt to bold peri peri." },
  { step: "04", title: "Packed", desc: "Our makhana is sealed in airtight packs to preserve freshness and crunch." },
];

export default function ProcessPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Link href="/learn" className="mb-8 inline-block text-sm text-[#4C5A48] underline hover:text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
          ← Back to Learn
        </Link>
        <h1 className="mb-6 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          How It&apos;s Made
        </h1>
        <div className="space-y-8">
          {STEPS.map((s) => (
            <div key={s.step} className="flex gap-6">
              <span className="shrink-0 text-3xl font-bold text-[#E0961A]/40" style={{ fontFamily: "var(--font-heading)" }}>
                {s.step}
              </span>
              <div>
                <h2 className="mb-1 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                  {s.title}
                </h2>
                <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
