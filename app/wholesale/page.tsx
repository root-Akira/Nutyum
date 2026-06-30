import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wholesale Partners | Nutyum",
  description: "Partner with Nutyum — premium makhana snacks for retail, hospitality, and corporate gifting.",
};

export default function WholesalePage() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Wholesale Partners
        </h1>
        <p className="mb-8 text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          Bring the crunch of premium makhana to your shelves, menu, or gift catalogue.
        </p>

        <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8 space-y-6">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
              Retail
            </h2>
            <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              Stock Nutyum in your store or supermarket. We offer competitive wholesale pricing and branded display units.
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
              Hospitality
            </h2>
            <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              Perfect for hotels, cafes, and airlines looking to offer a healthy, premium snack option.
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
              Corporate Gifting
            </h2>
            <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              Custom-branded gift boxes and variety packs for employee gifts, client appreciations, and events.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-[rgba(23,61,34,0.1)] bg-[#E0961A]/5 p-8">
          <h2 className="mb-2 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
            Get in Touch
          </h2>
          <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
            Reach out to our partnerships team at <span className="font-semibold text-[#173D22]">partners@nutyum.com</span> to discuss bulk pricing and custom orders.
          </p>
        </div>
      </div>
    </main>
  );
}
