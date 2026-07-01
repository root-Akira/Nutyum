import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | Nutyum",
  description: "Frequently asked questions about Nutyum makhana snacks — ingredients, shipping, returns and more.",
};

const FAQS = [
  {
    q: "What is makhana?",
    a: "Makhana, also known as fox nuts or lotus seeds, is a nutritious seed harvested from the Euryale ferox plant. It has been a staple in Indian households for centuries and is prized for its light, crunchy texture and impressive nutritional profile.",
  },
  {
    q: "Are Nutyum products gluten-free?",
    a: "Yes. All Nutyum makhana snacks are naturally gluten-free. Our ingredients and facility are carefully managed to avoid cross-contamination, but we recommend contacting us if you have severe gluten sensitivity.",
  },
  {
    q: "Are Nutyum products vegan?",
    a: "Yes, all our flavours are 100% plant-based and vegan-friendly. We use no animal products or by-products in any of our recipes.",
  },
  {
    q: "What is the shelf life of your products?",
    a: "Our products have a shelf life of 6 months from the date of manufacture. The best-before date is clearly printed on every pack. Once opened, we recommend consuming within 7 days for optimal freshness.",
  },
  {
    q: "How should I store makhana after opening?",
    a: "Store in an airtight container in a cool, dry place away from direct sunlight. Avoid refrigeration as moisture can affect the crunchiness.",
  },
  {
    q: "Do you use any preservatives or artificial additives?",
    a: "No. Nutyum products contain no artificial preservatives, flavours, or colours. We use only natural ingredients and seasonings.",
  },
  {
    q: "What is your shipping policy?",
    a: "We offer free shipping on all orders above ₹999. Orders are processed within 1-2 business days and delivered within 3-7 business days across India. For full details, see our Shipping Policy.",
  },
  {
    q: "Can I modify or cancel my order?",
    a: "Orders can be modified or cancelled within 2 hours of placement. Please contact us immediately with your order number and we will do our best to accommodate.",
  },
  {
    q: "What is your return policy?",
    a: "We accept returns for damaged or defective items within 7 days of delivery. Please contact us with your order number and photos of the issue, and we will arrange a replacement or refund.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently we ship only within India. We are working on expanding to international markets and will announce availability through our newsletter and social media.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-block text-sm text-[#4C5A48] underline hover:text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
          ← Back to Home
        </Link>
        <h1 className="mb-6 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Frequently Asked Questions
        </h1>

        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8">
              <h2 className="mb-3 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                {faq.q}
              </h2>
              <p className="text-sm leading-relaxed text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          Still have questions? <Link href="/contact" className="text-[#173D22] underline hover:opacity-60">Contact us</Link>
        </p>
      </div>
    </main>
  );
}
