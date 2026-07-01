import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Nutyum",
  description: "Nutyum privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-block text-sm text-[#4C5A48] underline hover:text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
          ← Back to Home
        </Link>
        <h1 className="mb-6 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Privacy Policy
        </h1>
        <p className="mb-2 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          Last updated: July 2026
        </p>
        <p className="mb-10 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          Nutyum (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website nutyum.in.
        </p>

        <div className="space-y-8">
          <Section title="1. Information We Collect">
            <p className="font-medium">Personal Data:</p>
            <ul>
              <li>Name, email address, phone number, shipping address, and billing address.</li>
              <li>Payment information (processed securely by Razorpay — we do not store full card details).</li>
              <li>Account credentials (email and password, stored securely using hashing).</li>
            </ul>
            <p className="font-medium mt-4">Usage Data:</p>
            <ul>
              <li>IP address, browser type, device information, pages visited, time spent on pages, and referring URLs.</li>
              <li>We use Google Analytics and Vercel Analytics to understand how our website is used. This data is anonymised where possible.</li>
            </ul>
          </Section>

          <Section title="2. How We Collect Your Information">
            <ul>
              <li><strong>Direct interactions:</strong> When you create an account, place an order, contact us, or sign up for our newsletter.</li>
              <li><strong>Automated technologies:</strong> Cookies, log files, and web beacons (see our Cookie Policy for details).</li>
              <li><strong>Third parties:</strong> Payment processors (Razorpay) and analytics providers (Google, Vercel).</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul>
              <li>To process and fulfil your orders, including payment processing, shipping, and delivery updates.</li>
              <li>To manage your account and provide customer support.</li>
              <li>To send order confirmations, shipping notifications, and service updates (transactional emails).</li>
              <li>With your consent, to send marketing communications about new products, offers, and news.</li>
              <li>To improve our website, products, and services through analytics.</li>
              <li>To comply with legal obligations and enforce our terms.</li>
            </ul>
          </Section>

          <Section title="4. Legal Basis for Processing (GDPR)">
            <p>If you are from the European Economic Area (EEA), our legal basis for collecting and using your personal data depends on the data concerned and the context in which we collect it. We rely on:</p>
            <ul>
              <li><strong>Performance of a contract</strong> — to fulfil your orders and provide services.</li>
              <li><strong>Consent</strong> — for marketing emails and optional data collection.</li>
              <li><strong>Legitimate interests</strong> — for analytics, fraud prevention, and improving our services.</li>
            </ul>
          </Section>

          <Section title="5. Data Sharing & Disclosure">
            <p>We may share your data with:</p>
            <ul>
              <li><strong>Service providers:</strong> Courier partners, payment processors (Razorpay), analytics providers (Google, Vercel), and email delivery services.</li>
              <li><strong>Legal authorities:</strong> If required by law or to protect our legal rights.</li>
              <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity.</li>
            </ul>
            <p className="mt-3">We do not sell your personal information to third parties.</p>
          </Section>

          <Section title="6. Data Retention">
            <ul>
              <li>We retain your personal data for as long as your account is active or as needed to provide services.</li>
              <li>Order data is retained for <strong>5 years</strong> for tax and legal compliance purposes.</li>
              <li>Marketing data is retained until you unsubscribe or request deletion.</li>
              <li>When data is no longer needed, it is securely deleted or anonymised.</li>
            </ul>
          </Section>

          <Section title="7. Data Security">
            <ul>
              <li>We implement appropriate technical and organisational measures to protect your data, including SSL/TLS encryption for all data transmitted between your browser and our servers.</li>
              <li>Payment information is processed and stored by Razorpay, which is PCI-DSS compliant. We do not store full credit/debit card numbers on our servers.</li>
              <li>Passwords are hashed and salted using industry-standard algorithms.</li>
              <li>While we strive to protect your data, no method of electronic storage or transmission is 100% secure. We cannot guarantee absolute security.</li>
            </ul>
          </Section>

          <Section title="8. Your Rights">
            <p>Depending on your jurisdiction, you may have the following rights:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data (subject to legal retention requirements).</li>
              <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances.</li>
              <li><strong>Data portability:</strong> Request a copy of your data in a machine-readable format.</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interests or direct marketing.</li>
              <li><strong>Withdraw consent:</strong> Withdraw consent at any time where processing is based on consent.</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:hello@nutyum.in" className="text-[#173D22] underline">hello@nutyum.in</a>.</p>
          </Section>

          <Section title="9. Cookies">
            <p>We use cookies and similar tracking technologies to enhance your experience. For full details, please see our <Link href="/cookies" className="text-[#173D22] underline">Cookie Policy</Link>.</p>
          </Section>

          <Section title="10. Third-Party Links">
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these websites. We encourage you to read their privacy policies before providing any personal data.</p>
          </Section>

          <Section title="11. Children&apos;s Privacy">
            <p>Our services are not directed to individuals under the age of 13. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us and we will take steps to delete it.</p>
          </Section>

          <Section title="12. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date. We encourage you to review this policy periodically. Material changes will be notified via email or a notice on our website.</p>
          </Section>

          <Section title="13. Contact">
            <p>If you have any questions, concerns, or complaints regarding this Privacy Policy or our data practices, please contact us:</p>
            <ul>
              <li>Email: <a href="mailto:hello@nutyum.in" className="text-[#173D22] underline">hello@nutyum.in</a></li>
            </ul>
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
