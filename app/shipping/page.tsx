import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping Policy | Nutyum",
  description: "Nutyum shipping policy — delivery timelines, charges, and order tracking information.",
};

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-block text-sm text-[#4C5A48] underline hover:text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
          ← Back to Home
        </Link>
        <h1 className="mb-6 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Shipping Policy
        </h1>
        <p className="mb-2 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          Last updated: July 2026
        </p>
        <p className="mb-10 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          This Shipping Policy applies to all orders placed on nutyum.in (the &ldquo;Website&rdquo;) operated by Nutyum (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
        </p>

        <div className="space-y-8">
          <Section title="1. Shipping Locations">
            <p>We currently ship to all states and union territories within India. We do not offer international shipping at this time.</p>
          </Section>

          <Section title="2. Shipping Charges">
            <ul>
              <li><strong>Free shipping</strong> on all orders of ₹999 or more.</li>
              <li>Orders below ₹999 are charged a flat shipping fee of ₹49.</li>
              <li>Additional charges may apply for remote areas (certain pin codes in North-East India, Jammu & Kashmir, Ladakh, and island territories). Any such charges will be displayed at checkout before payment.</li>
            </ul>
          </Section>

          <Section title="3. Order Processing">
            <ul>
              <li>Orders are processed within 1–2 business days after payment confirmation.</li>
              <li>Orders placed on weekends or public holidays are processed on the next business day.</li>
              <li>During high-volume periods (festive seasons, sales), processing may take up to 3 business days.</li>
            </ul>
          </Section>

          <Section title="4. Delivery Timelines">
            <ul>
              <li><strong>Metro cities:</strong> 2–4 business days</li>
              <li><strong>Tier 2 & 3 cities:</strong> 3–6 business days</li>
              <li><strong>Remote areas:</strong> 5–7 business days</li>
              <li>Delivery timelines are estimates and not guaranteed. We are not liable for delays caused by courier partners, weather, or unforeseen circumstances.</li>
            </ul>
          </Section>

          <Section title="5. Order Tracking">
            <p>Once your order is shipped, you will receive a confirmation email and SMS with a tracking link. You can also track your order by contacting us at <a href="mailto:hello@nutyum.in" className="text-[#173D22] underline">hello@nutyum.in</a> with your order number.</p>
          </Section>

          <Section title="6. Delivery Attempts">
            <ul>
              <li>Our courier partner will make up to 3 delivery attempts.</li>
              <li>If delivery fails after 3 attempts, the package will be returned to us. Refunds for returned orders will be processed minus the original shipping charges (if any).</li>
              <li>Please ensure the shipping address is correct and someone is available to receive the package.</li>
            </ul>
          </Section>

          <Section title="7. Damaged or Lost in Transit">
            <ul>
              <li>If your package arrives damaged, please contact us within 48 hours of delivery with photos of the damage and the outer packaging.</li>
              <li>If your package is lost in transit, we will initiate a trace with the courier partner. If the package cannot be located within 7 business days, we will issue a full refund or replacement.</li>
            </ul>
          </Section>

          <Section title="8. Address Changes">
            <p>If you need to change your shipping address after placing an order, please contact us immediately. We will do our best to accommodate the change if the order has not yet been shipped. Once shipped, we cannot modify the delivery address.</p>
          </Section>

          <Section title="9. Contact">
            <p>For any shipping-related inquiries, please contact us at <a href="mailto:hello@nutyum.in" className="text-[#173D22] underline">hello@nutyum.in</a> with your order number.</p>
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
