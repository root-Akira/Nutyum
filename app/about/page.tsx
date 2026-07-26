import Image from "next/image";
import { Leaf, WheatOff, Award, Sprout, Flame, Droplets, Wheat } from "lucide-react";

const VALUES = [
  {
    icon: Leaf,
    title: "Natural",
    desc: "Ingredients you can name without a label's help.",
  },
  {
    icon: WheatOff,
    title: "Healthy",
    desc: "Good enough to eat daily without a second thought.",
  },
  {
    icon: Award,
    title: "Premium",
    desc: "A snack break that actually feels like one.",
  },
  {
    icon: Sprout,
    title: "Thoughtful",
    desc: "From hand-harvested ponds to small-batch roasting.",
  },
];

const MAKHANA_FACTS = [
  { icon: Flame, value: "Low fat", desc: "Naturally low in fat, popped not fried" },
  { icon: Droplets, value: "High protein", desc: "Packs more plant protein than most grains" },
  { icon: Wheat, value: "Gluten-free", desc: "Gluten-free by nature, not reformulation" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EE]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#173D22] px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-[#FAF7EE] sm:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-heading)" }}>
            About Nutyum
          </h1>
          <p className="mt-4 text-xl text-[#C4D0BC] sm:text-2xl">
            Real food, real good.
          </p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20 lg:px-8">
        <h2 className="text-3xl font-semibold text-[#173D22] sm:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
          Our Story
        </h2>
        <div className="mt-8 space-y-6 text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          <p className="text-lg leading-relaxed">
            Nutyum began with a simple frustration: snacking in India meant choosing
            between &ldquo;tasty&rdquo; and &ldquo;healthy&rdquo; — never both. Chips came loaded with
            preservatives you couldn&rsquo;t pronounce. &ldquo;Healthy&rdquo; snacks tasted like
            punishment. We wanted something that didn&rsquo;t ask you to compromise —
            a snack that was honest about what&rsquo;s in it, and good enough to reach for
            without a reason.
          </p>
          <p className="text-lg leading-relaxed">
            That snack turned out to already exist. It just needed someone to take it
            seriously.
          </p>
          <p className="text-lg leading-relaxed">
            Makhana — the fox nut — has been part of Indian kitchens for generations,
            grown in the wetlands of Bihar and eaten as a fast, a festival food, a
            grandmother&rsquo;s remedy for an upset stomach. It was never marketed. It never
            needed to be. It was just quietly good. Nutyum exists to bring that
            quiet, unglamorous goodness to the front of the shelf — roasted properly,
            seasoned honestly, and packaged like the premium snack it always deserved
            to be.
          </p>
          <p className="text-lg leading-relaxed">
            Everything we make follows three commitments: <strong>natural</strong> ingredients you
            can name without a label&rsquo;s help, <strong>healthy</strong> enough to eat daily without a
            second thought, and <strong>premium</strong> enough that a snack break feels like one.
          </p>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-[#FAF7EE] p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#173D22]">
                  <v.icon className="h-6 w-6 text-[#FAF7EE]" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Makhana ── */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-semibold text-[#173D22] sm:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
              Why makhana
            </h2>
            <div className="mt-8 space-y-5 text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              <p className="leading-relaxed">
                Most snacks earn your attention through salt, sugar, or fat — and lose it
                just as fast. Makhana works differently. It&rsquo;s a seed, not a grain, popped
                and roasted rather than fried, which gives it a light, satisfying crunch
                without the oil-heavy weight of a chip. Naturally low in fat and calories,
                high in plant protein, and gluten-free by nature rather than by
                reformulation — makhana was never engineered to be healthy. It just is.
              </p>
              <p className="leading-relaxed">
                What sets it apart isn&rsquo;t a marketing claim, it&rsquo;s texture and restraint:
                a clean bite that holds its shape, a mild nuttiness that carries whatever
                flavour we roast it in, and none of the greasy aftertaste that makes most
                &ldquo;better-for-you&rdquo; snacks feel like an apology. It&rsquo;s the rare snack that
                satisfies a craving and a conscience in the same handful.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/hero-product.png"
              alt="Bowl of roasted makhana"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Stat cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {MAKHANA_FACTS.map((f) => (
            <div
              key={f.value}
              className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF7EE]">
                <f.icon className="h-5 w-5 text-[#173D22]" />
              </div>
              <p className="mt-3 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                {f.value}
              </p>
              <p className="mt-1 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── From wetland to packet ── */}
      <section className="bg-[#173D22] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:order-1">
              <Image
                src="/origins-bg.png"
                alt="Aerial view of Indian lotus fields at dawn"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="lg:order-2">
              <h2 className="text-3xl font-semibold text-[#FAF7EE] sm:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
                From wetland to packet
              </h2>
              <div className="mt-8 space-y-5 text-[#C4D0BC]" style={{ fontFamily: "var(--font-body)" }}>
                <p className="leading-relaxed">
                  Good makhana starts long before it reaches a roasting pan. We work with
                  growers in the traditional makhana-cultivation belt, where the seed is
                  still hand-harvested from still-water ponds the way it has been for
                  generations — a slow, seasonal process that machine farming hasn&rsquo;t
                  managed to shortcut.
                </p>
                <p className="leading-relaxed">
                  From there, every batch is checked for size, moisture, and quality before
                  it ever reaches our kitchen. We roast in small batches rather than
                  continuous industrial runs, which costs us speed but gives us control —
                  over crunch, over colour, over consistency from one packet to the next.
                  Seasoning goes on after roasting, not before, so the makhana itself stays
                  the star instead of a vehicle for salt.
                </p>
                <p className="leading-relaxed">
                  Nothing about this process is the fastest way to make a snack. It&rsquo;s the
                  way that makes a snack worth making.
                </p>
              </div>
            </div>
          </div>

          {/* Process cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Hand-harvested", desc: "From still-water ponds in Bihar, the traditional way" },
              { label: "Small-batch roasted", desc: "Each batch checked for size, moisture, and quality" },
              { label: "Seasoned after roasting", desc: "So the makhana stays the star, not a vehicle for salt" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[rgba(250,247,238,0.15)] bg-[rgba(250,247,238,0.06)] p-5"
              >
                <p className="text-lg font-semibold text-[#FAF7EE]" style={{ fontFamily: "var(--font-heading)" }}>
                  {item.label}
                </p>
                <p className="mt-1 text-sm text-[#C4D0BC]" style={{ fontFamily: "var(--font-body)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Promise ── */}
      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20 lg:px-8">
        <h2 className="text-3xl font-semibold text-[#173D22] sm:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
          Our promise to you
        </h2>
        <div className="mt-8 space-y-5 text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          <p className="text-lg leading-relaxed">
            No maida, no trans fats, no ingredients that need a footnote to explain.
            What&rsquo;s on the label is what&rsquo;s in the packet — nothing added to extend
            shelf life at the expense of what&rsquo;s actually good for you.
          </p>
          <p className="text-lg leading-relaxed">
            Every batch is roasted, not fried. Every flavour starts from real spices
            and real ingredients, not flavour-dust chemistry. And every packet is
            sealed to lock in crunch, not just shelf appearance — because a snack
            that&rsquo;s gone soft by the time you open it was never really premium to
            begin with.
          </p>
          <div className="mt-8 rounded-2xl border border-[rgba(23,61,34,0.1)] bg-[#FAF7EE] p-6 text-center">
            <p className="text-xl font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
              Real ingredients, every snack, every time.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
