import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers | Nutyum",
  description: "Join the Nutyum team — send your resume to info.nutyum@gmail.com.",
};

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-[#4C5A48] underline hover:text-[#173D22]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          ← Back to Home
        </Link>

        <h1 className="mb-4 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Join Our Team
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          At Nutyum, we are passionate about crafting premium makhana snacks that bring people together.
          If you share our love for quality food and want to be part of a growing brand, we would love to hear from you.
        </p>

        <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8 text-center">
          <p className="text-sm leading-relaxed text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
            Send your resume to{" "}
            <a href="mailto:info.nutyum@gmail.com" className="text-[#173D22] underline hover:opacity-60">
              info.nutyum@gmail.com
            </a>{" "}
            and we will keep you in mind for future opportunities.
          </p>
        </div>
      </div>
    </main>
  );
}
