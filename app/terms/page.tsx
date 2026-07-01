import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Nutyum",
  description: "Nutyum terms of service — the terms governing your use of our website and purchase of our products.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-block text-sm text-[#4C5A48] underline hover:text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
          ← Back to Home
        </Link>
        <h1 className="mb-6 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Terms of Service
        </h1>
        <p className="mb-2 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          Last updated: July 2026
        </p>
        <p className="mb-10 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully before using nutyum.in (the &ldquo;Website&rdquo;) or purchasing any products from Nutyum (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
        </p>

        <div className="space-y-8">
          <Section title="1. Acceptance of Terms">
            <p>By accessing or using our Website, creating an account, or placing an order, you agree to be bound by these Terms. If you do not agree, please do not use our Website or services.</p>
          </Section>

          <Section title="2. Eligibility">
            <ul>
              <li>You must be at least 18 years old to create an account and place an order.</li>
              <li>If you are under 18, you may use the Website only with the involvement of a parent or guardian.</li>
              <li>By placing an order, you represent that the information you provide is accurate and complete.</li>
            </ul>
          </Section>

          <Section title="3. Account Registration">
            <ul>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You are responsible for all activities that occur under your account.</li>
              <li>You must notify us immediately of any unauthorised use of your account.</li>
              <li>We reserve the right to suspend or terminate accounts at our discretion for violation of these Terms.</li>
            </ul>
          </Section>

          <Section title="4. Products & Pricing">
            <ul>
              <li>All product descriptions, images, and prices are subject to change without notice.</li>
              <li>We make every effort to display accurate colours and images, but we cannot guarantee that your monitor&apos;s display will accurately reflect the product.</li>
              <li>We reserve the right to limit quantities and discontinue products at any time.</li>
              <li>In the event of a pricing error, we will contact you before processing the order and offer the option to proceed at the corrected price or cancel for a full refund.</li>
            </ul>
          </Section>

          <Section title="5. Orders & Payment">
            <ul>
              <li>All orders are subject to acceptance and availability.</li>
              <li>We reserve the right to refuse or cancel any order for any reason, including suspected fraud or unauthorised transactions.</li>
              <li>Payment is processed securely through Razorpay. By providing payment information, you represent that you are authorised to use the payment method.</li>
              <li>Prices are inclusive of applicable taxes (GST). Shipping charges are additional unless stated otherwise.</li>
            </ul>
          </Section>

          <Section title="6. Shipping & Delivery">
            <p>Shipping and delivery are governed by our <Link href="/shipping" className="text-[#173D22] underline">Shipping Policy</Link>, which is incorporated into these Terms.</p>
          </Section>

          <Section title="7. Returns & Refunds">
            <p>Returns and refunds are governed by our <Link href="/returns" className="text-[#173D22] underline">Returns & Refunds Policy</Link>, which is incorporated into these Terms.</p>
          </Section>

          <Section title="8. Intellectual Property">
            <ul>
              <li>All content on the Website, including text, images, logos, graphics, and product designs, is the property of Nutyum or our licensors and is protected by applicable intellectual property laws.</li>
              <li>You may not reproduce, distribute, modify, or create derivative works from our content without our prior written consent.</li>
              <li>The Nutyum name and logo are trademarks of Nutyum. You may not use them without our permission.</li>
            </ul>
          </Section>

          <Section title="9. User Conduct">
            <p>You agree not to:</p>
            <ul>
              <li>Use the Website for any unlawful purpose or in violation of any applicable laws.</li>
              <li>Attempt to gain unauthorised access to our systems or user accounts.</li>
              <li>Interfere with the proper functioning of the Website.</li>
              <li>Submit false or misleading information.</li>
              <li>Engage in any activity that could harm, disable, or overburden our infrastructure.</li>
            </ul>
          </Section>

          <Section title="10. Limitation of Liability">
            <ul>
              <li>To the maximum extent permitted by law, Nutyum shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Website or purchase of products.</li>
              <li>Our total liability for any claim arising from these Terms or your use of the Website shall not exceed the amount paid by you for the product giving rise to the claim.</li>
              <li>We are not liable for delays or failures caused by circumstances beyond our reasonable control, including acts of God, natural disasters, strikes, or courier partner disruptions.</li>
            </ul>
          </Section>

          <Section title="11. Disclaimer of Warranties">
            <ul>
              <li>The Website and all products are provided &ldquo;as is&rdquo; without any warranties, express or implied.</li>
              <li>We do not warrant that the Website will be uninterrupted, error-free, or free of viruses or other harmful components.</li>
              <li>Nutritional information is provided for general guidance only and should not be considered medical advice. Please consult a healthcare professional for dietary concerns.</li>
            </ul>
          </Section>

          <Section title="12. Indemnification">
            <p>You agree to indemnify and hold Nutyum and its officers, employees, and affiliates harmless from any claims, damages, losses, or expenses arising out of your violation of these Terms or your use of the Website.</p>
          </Section>

          <Section title="13. Governing Law">
            <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.</p>
          </Section>

          <Section title="14. Changes to Terms">
            <p>We may update these Terms at any time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date. Continued use of the Website after changes constitutes acceptance of the new Terms. Material changes will be notified via email or a notice on our website.</p>
          </Section>

          <Section title="15. Contact">
            <p>If you have any questions about these Terms, please contact us at <a href="mailto:hello@nutyum.in" className="text-[#173D22] underline">hello@nutyum.in</a>.</p>
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
