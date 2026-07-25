import { Leaf, WheatOff, Award, Sprout } from "lucide-react";

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

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAF7EE]">
      {/* Hero */}
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

      {/* Story */}
      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20 lg:px-8">
        <div className="prose prose-lg max-w-none text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          <p>
            Nutyum began with a simple frustration: snacking in India meant choosing
            between &ldquo;tasty&rdquo; and &ldquo;healthy&rdquo; — never both. Chips came loaded with
            preservatives you couldn&rsquo;t pronounce. &ldquo;Healthy&rdquo; snacks tasted like
            punishment. We wanted something that didn&rsquo;t ask you to compromise —
            a snack that was honest about what&rsquo;s in it, and good enough to reach for
            without a reason.
          </p>
          <p>
            That snack turned out to already exist. It just needed someone to take it
            seriously.
          </p>
          <p>
            Makhana — the fox nut — has been part of Indian kitchens for generations,
            grown in the wetlands of Bihar and eaten as a fast, a festival food, a
            grandmother&rsquo;s remedy for an upset stomach. It was never marketed. It never
            needed to be. It was just quietly good. Nutyum exists to bring that
            quiet, unglamorous goodness to the front of the shelf — roasted properly,
            seasoned honestly, and packaged like the premium snack it always deserved
            to be.
          </p>
          <p>
            Everything we make follows three commitments: <strong>natural</strong> ingredients you
            can name without a label&rsquo;s help, <strong>healthy</strong> enough to eat daily without a
            second thought, and <strong>premium</strong> enough that a snack break feels like one.
          </p>
        </div>
      </section>

      {/* Values */}
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

      {/* Why makhana */}
      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20 lg:px-8">
        <h2 className="text-3xl font-semibold text-[#173D22] sm:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
          Why makhana
        </h2>
        <div className="mt-6 prose prose-lg max-w-none text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          <p>
            Most snacks earn your attention through salt, sugar, or fat — and lose it
            just as fast. Makhana works differently. It&rsquo;s a seed, not a grain, popped
            and roasted rather than fried, which gives it a light, satisfying crunch
            without the oil-heavy weight of a chip. Naturally low in fat and calories,
            high in plant protein, and gluten-free by nature rather than by
            reformulation — makhana was never engineered to be healthy. It just is.
          </p>
          <p>
            What sets it apart isn&rsquo;t a marketing claim, it&rsquo;s texture and restraint:
            a clean bite that holds its shape, a mild nuttiness that carries whatever
            flavour we roast it in, and none of the greasy aftertaste that makes most
            &ldquo;better-for-you&rdquo; snacks feel like an apology. It&rsquo;s the rare snack that
            satisfies a craving and a conscience in the same handful.
          </p>
        </div>
      </section>

      {/* From wetland to packet */}
      <section className="bg-[#173D22] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-[#FAF7EE] sm:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
            From wetland to packet
          </h2>
          <div className="mt-6 prose prose-lg max-w-none text-[#C4D0BC]" style={{ fontFamily: "var(--font-body)" }}>
            <p>
              Good makhana starts long before it reaches a roasting pan. We work with
              growers in the traditional makhana-cultivation belt, where the seed is
              still hand-harvested from still-water ponds the way it has been for
              generations — a slow, seasonal process that machine farming hasn&rsquo;t
              managed to shortcut.
            </p>
            <p>
              From there, every batch is checked for size, moisture, and quality before
              it ever reaches our kitchen. We roast in small batches rather than
              continuous industrial runs, which costs us speed but gives us control —
              over crunch, over colour, over consistency from one packet to the next.
              Seasoning goes on after roasting, not before, so the makhana itself stays
              the star instead of a vehicle for salt.
            </p>
            <p>
              Nothing about this process is the fastest way to make a snack. It&rsquo;s the
              way that makes a snack worth making.
            </p>
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20 lg:px-8">
        <h2 className="text-3xl font-semibold text-[#173D22] sm:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
          Our promise to you
        </h2>
        <div className="mt-6 prose prose-lg max-w-none text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          <p>
            No maida, no trans fats, no ingredients that need a footnote to explain.
            What&rsquo;s on the label is what&rsquo;s in the packet — nothing added to extend
            shelf life at the expense of what&rsquo;s actually good for you.
          </p>
          <p>
            Every batch is roasted, not fried. Every flavour starts from real spices
            and real ingredients, not flavour-dust chemistry. And every packet is
            sealed to lock in crunch, not just shelf appearance — because a snack
            that&rsquo;s gone soft by the time you open it was never really premium to
            begin with.
          </p>
          <p className="text-lg font-semibold text-[#173D22]">
            That&rsquo;s the whole promise: real ingredients, every snack, every time.
          </p>
        </div>
      </section>
    </main>
  );
}
