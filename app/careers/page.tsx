import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers | Nutyum",
  description: "Join the Nutyum team — explore career opportunities in premium makhana snacking.",
};

const OPENINGS = [
  {
    title: "Production Supervisor",
    location: "Mumbai, India",
    type: "Full-time",
    description: "Oversee daily production operations, maintain quality standards, and manage a team of production associates in our makhana roasting facility.",
  },
  {
    title: "Quality Assurance Lead",
    location: "Mumbai, India",
    type: "Full-time",
    description: "Develop and implement QA protocols, conduct regular audits, and ensure all products meet Nutyum's quality and safety standards.",
  },
  {
    title: "Marketing Associate",
    location: "Remote",
    type: "Full-time",
    description: "Drive brand awareness through social media, content creation, and digital campaigns. Experience in food/wellness brands preferred.",
  },
  {
    title: "Operations Executive",
    location: "Mumbai, India",
    type: "Full-time",
    description: "Manage order fulfillment, logistics coordination, and vendor relationships to ensure timely delivery across India.",
  },
];

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
        <p className="mb-12 text-sm leading-relaxed text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          At Nutyum, we are passionate about crafting premium makhana snacks that bring people together. 
          If you share our love for quality food and want to be part of a growing brand, we would love to hear from you.
        </p>

        <div className="space-y-4">
          {OPENINGS.map((role) => (
            <div
              key={role.title}
              className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                    {role.title}
                  </h2>
                  <p className="mt-1 text-sm text-[#5C665E]">
                    {role.location} &middot; {role.type}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                {role.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
            Don&apos;t see the right fit?
          </h2>
          <p className="mt-2 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
            Send your resume to{" "}
            <a href="mailto:careers@nutyum.in" className="text-[#173D22] underline hover:opacity-60">
              careers@nutyum.in
            </a>{" "}
            and we will keep you in mind for future opportunities.
          </p>
        </div>
      </div>
    </main>
  );
}
