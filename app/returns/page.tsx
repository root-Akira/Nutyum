import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Refunds | Nutyum",
  description: "Nutyum return and refund policy — how to return items, refund timelines, and exclusions.",
};

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-block text-sm text-[#4C5A48] underline hover:text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
          ← Back to Home
        </Link>
        <h1 className="mb-6 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Returns & Refunds
        </h1>
        <p className="mb-2 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          Last updated: July 2026
        </p>
        <p className="mb-10 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          This Returns & Refunds Policy forms part of and is incorporated into our Terms of Service. By purchasing from Nutyum, you agree to this policy.
        </p>

        <div className="space-y-8">
          <Section title="1. Eligibility">
            <ul>
              <li>Returns are accepted within <strong>7 calendar days</strong> from the date of delivery.</li>
              <li>Only items that are <strong>damaged, defective, or incorrect</strong> are eligible for return or replacement.</li>
              <li>Items must be unused, unopened, and in their original packaging for a return to be accepted.</li>
              <li>We reserve the right to reject returns that do not meet these conditions.</li>
            </ul>
          </Section>

          <Section title="2. Non-Returnable Items">
            <ul>
              <li>Products that have been opened or partially consumed.</li>
              <li>Products damaged due to improper storage or handling after delivery.</li>
              <li>Free samples or promotional items.</li>
              <li>Gift cards.</li>
            </ul>
          </Section>

          <Section title="3. How to Initiate a Return">
            <ol className="list-decimal pl-5 space-y-1">
              <li>Contact us at <a href="mailto:hello@nutyum.in" className="text-[#173D22] underline">hello@nutyum.in</a> within 7 days of delivery.</li>
              <li>Include your <strong>order number</strong>, a description of the issue, and clear photos showing the damage or defect.</li>
              <li>Our team will review your request and respond within 24–48 business hours.</li>
              <li>If approved, we will provide a return shipping label or arrange a pickup, depending on your location.</li>
            </ol>
          </Section>

          <Section title="4. Refunds">
            <ul>
              <li><strong>Full refund</strong> — issued for damaged, defective, or incorrect items. The refund includes the product price plus any shipping charges paid.</li>
              <li><strong>Partial refund</strong> — may be issued for items returned in non-original condition at our discretion.</li>
              <li>Refunds are processed within <strong>5–7 business days</strong> after we receive and inspect the returned item.</li>
              <li>Refunds are credited to the <strong>original payment method</strong>. Depending on your bank or payment provider, it may take an additional 2–5 business days for the amount to appear in your account.</li>
            </ul>
          </Section>

          <Section title="5. Replacements">
            <p>If a replacement is requested instead of a refund, we will ship a new item at no additional cost once the return is approved. Replacement delivery timelines follow our standard shipping policy.</p>
          </Section>

          <Section title="6. Return Shipping Costs">
            <ul>
              <li>For returns due to our error (damaged, defective, or incorrect item), we will cover the return shipping costs.</li>
              <li>For change-of-mind returns (not eligible under this policy), the customer is responsible for return shipping costs.</li>
            </ul>
          </Section>

          <Section title="7. Order Cancellations">
            <ul>
              <li>Orders can be cancelled within <strong>2 hours</strong> of placement for a full refund.</li>
              <li>After 2 hours, if the order has not yet been shipped, we may accommodate cancellations on a case-by-case basis.</li>
              <li>Once shipped, orders cannot be cancelled.</li>
            </ul>
          </Section>

          <Section title="8. Quality Guarantee">
            <p>We take pride in our products. If you are unsatisfied with the quality of your Nutyum snack, please reach out to us. While taste preferences are subjective, we will work with you to find a fair resolution.</p>
          </Section>

          <Section title="9. Contact">
            <p>For any return or refund inquiries, please contact us at <a href="mailto:hello@nutyum.in" className="text-[#173D22] underline">hello@nutyum.in</a> with your order number.</p>
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
