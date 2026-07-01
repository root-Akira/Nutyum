import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | Nutyum",
  description: "Nutyum cookie policy — how we use cookies and similar tracking technologies on our website.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-block text-sm text-[#4C5A48] underline hover:text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
          ← Back to Home
        </Link>
        <h1 className="mb-6 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Cookie Policy
        </h1>
        <p className="mb-2 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          Last updated: July 2026
        </p>
        <p className="mb-10 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          This Cookie Policy explains how Nutyum (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) uses cookies and similar tracking technologies on nutyum.in. It forms part of our <Link href="/privacy" className="text-[#173D22] underline">Privacy Policy</Link>.
        </p>

        <div className="space-y-8">
          <Section title="1. What Are Cookies">
            <p>Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.</p>
          </Section>

          <Section title="2. Types of Cookies We Use">
            <p className="font-medium">Essential Cookies:</p>
            <ul>
              <li>Required for the Website to function properly. They enable core functionality such as security, session management, and shopping cart persistence.</li>
              <li>Without these cookies, certain services (like maintaining your cart or logging in) cannot function.</li>
            </ul>

            <p className="font-medium mt-4">Analytics Cookies:</p>
            <ul>
              <li>We use Google Analytics and Vercel Analytics to understand how visitors interact with our Website — which pages are visited, how long users stay, and what links they click.</li>
              <li>This data helps us improve our Website and user experience. The data is aggregated and anonymised where possible.</li>
            </ul>

            <p className="font-medium mt-4">Functionality Cookies:</p>
            <ul>
              <li>These cookies remember choices you make (such as your preferred theme) to provide a more personalised experience.</li>
            </ul>

            <p className="font-medium mt-4">Marketing Cookies:</p>
            <ul>
              <li>We may use marketing cookies to deliver relevant advertisements and measure the effectiveness of our marketing campaigns.</li>
              <li>These cookies may be set by third-party advertising platforms with your consent.</li>
            </ul>
          </Section>

          <Section title="3. Third-Party Cookies">
            <ul>
              <li><strong>Google Analytics:</strong> Collects anonymous usage data. View Google&apos;s privacy policy at <a href="https://policies.google.com/privacy" className="text-[#173D22] underline">policies.google.com/privacy</a>.</li>
              <li><strong>Vercel Analytics:</strong> First-party analytics that does not use any cookies for tracking page views.</li>
              <li><strong>Razorpay:</strong> May set essential cookies for payment processing. View Razorpay&apos;s privacy policy at <a href="https://razorpay.com/privacy" className="text-[#173D22] underline">razorpay.com/privacy</a>.</li>
            </ul>
          </Section>

          <Section title="4. How to Manage Cookies">
            <p>You can control and manage cookies in several ways:</p>
            <ul>
              <li><strong>Browser settings:</strong> Most browsers allow you to view, block, or delete cookies. Check your browser&apos;s help section for instructions.</li>
              <li><strong>Opt-out tools:</strong> You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on.</li>
              <li>Please note that blocking essential cookies may affect the functionality of the Website.</li>
            </ul>
          </Section>

          <Section title="5. Do Not Track">
            <p>Our Website does not currently respond to &ldquo;Do Not Track&rdquo; (DNT) signals. We will update this policy if we implement DNT handling in the future.</p>
          </Section>

          <Section title="6. Changes to This Policy">
            <p>We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date.</p>
          </Section>

          <Section title="7. Contact">
            <p>If you have any questions about our use of cookies, please contact us at <a href="mailto:hello@nutyum.in" className="text-[#173D22] underline">hello@nutyum.in</a>.</p>
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
