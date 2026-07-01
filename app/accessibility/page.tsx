import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility | Nutyum",
  description: "Nutyum accessibility statement — our commitment to making our website accessible to everyone.",
};

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-block text-sm text-[#4C5A48] underline hover:text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
          ← Back to Home
        </Link>
        <h1 className="mb-6 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Accessibility Statement
        </h1>
        <p className="mb-2 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          Last updated: July 2026
        </p>
        <p className="mb-10 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          Nutyum is committed to ensuring digital accessibility for all users, regardless of ability. We are continuously working to improve the user experience for everyone and apply relevant accessibility standards.
        </p>

        <div className="space-y-8">
          <Section title="1. Our Commitment">
            <p>We believe everyone should be able to browse, explore, and purchase from our website with ease. We are dedicated to making our website accessible to people with disabilities, including those who use assistive technologies such as screen readers, magnifiers, and voice recognition software.</p>
          </Section>

          <Section title="2. Standards We Follow">
            <p>We aim to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>, published by the World Wide Web Consortium (W3C). These guidelines define how to make web content more accessible to people with a wide range of disabilities.</p>
          </Section>

          <Section title="3. What We Have Done">
            <ul>
              <li>Used semantic HTML structure with proper heading hierarchy (h1, h2, etc.).</li>
              <li>Added descriptive alt text for all images.</li>
              <li>Ensured sufficient colour contrast between text and background.</li>
              <li>Provided ARIA labels for interactive elements where necessary.</li>
              <li>Made the website navigable via keyboard.</li>
              <li>Ensured focus indicators are visible for keyboard navigation.</li>
              <li>Used relative font sizes that respect browser zoom settings.</li>
            </ul>
          </Section>

          <Section title="4. Areas for Improvement">
            <p>We acknowledge that some areas of our website may not yet be fully accessible. We are actively working on:</p>
            <ul>
              <li>Improving screen reader support for interactive components (menus, dialogs, cart drawer).</li>
              <li>Enhancing keyboard navigation flow throughout the checkout process.</li>
              <li>Adding skip-to-content links for faster navigation.</li>
            </ul>
          </Section>

          <Section title="5. Feedback">
            <p>We welcome your feedback on the accessibility of our website. If you encounter any accessibility barriers or have suggestions for improvement, please let us know. We aim to respond within 2 business days.</p>
            <ul className="mt-3">
              <li>Email: <a href="mailto:hello@nutyum.in" className="text-[#173D22] underline">hello@nutyum.in</a></li>
              <li>Please include the page URL and a description of the issue you encountered.</li>
            </ul>
          </Section>

          <Section title="6. Ongoing Efforts">
            <p>Accessibility is an ongoing commitment. We regularly review our website and make improvements as part of our development cycle. This statement will be updated as we make progress.</p>
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
        {title}
      </h2>
      <div className="space-y-2 text-sm leading-relaxed text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
        {children}
      </div>
    </div>
  );
}
