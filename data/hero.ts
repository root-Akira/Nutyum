export const HERO_SLIDES = [
  {
    id: "sea-salt",
    bgColor: "#d6e8c0",
    heading: "Meet Your\nMakhana",
    body: "Whether your mornings are more grab-and-go or\nintentional and slow, we have makhana for every ritual.",
    cta: { label: "Shop Now", href: "/shop" },
    image: "/hero-slide1.png",
    imageAlt: "Himalayan sea salt makhana with scattered lotus seeds on sage green background",
    pillLabel: "Himalayan Sea Salt",
    pillSub: "Premium Makhana · 70g",
  },
  {
    id: "peri-peri",
    bgColor: "#fde8cc",
    heading: "Bold Flavour,\nZero Guilt.",
    body: "Roasted to perfection, each lotus seed puffs up into a\nlightweight, crunchy cloud of bold flavour.",
    cta: { label: "Explore Flavours", href: "/shop" },
    image: "/hero-product.png",
    imageAlt: "Premium makhana bowl on cream background",
    pillLabel: "Peri Peri Makhana",
    pillSub: "New Arrival · 70g",
  },
];

export const TRUST_ITEMS = [
  { Icon: "Leaf", label: "100% Natural" },
  { Icon: "Star", label: "4.9 ★ Rating" },
  { Icon: "ShieldCheck", label: "Free Shipping" },
];

export const HERO_FRAME_CONFIG = {
  totalFrames: 241,
  getFrameUrl: (index: number) =>
    `/frames/frame_${String(index + 1).padStart(4, "0")}.png`,
};
