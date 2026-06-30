import { Star } from "lucide-react";
import type { LeftNavItem } from "@/types";

export const LEFT_NAV: LeftNavItem[] = [
  {
    label: "Shop",
    href: "/shop",
    kind: "mega",
    columns: [
      {
        heading: "All Flavours",
        items: [
          { label: "All Products", href: "/shop" },
          { label: "Himalayan Sea Salt", href: "/shop/sea-salt" },
          { label: "Peri Peri", href: "/shop/peri-peri" },
          { label: "Dark Chocolate", href: "/shop/dark-chocolate" },
          { label: "Classic Pudina", href: "/shop/pudina" },
        ],
      },
      {
        heading: "By Need",
        items: [
          { label: "High Protein", href: "/shop/high-protein" },
          { label: "Low Calorie", href: "/shop/low-calorie" },
          { label: "Guilt-Free Snacks", href: "/shop/guilt-free" },
          { label: "Gift Packs", href: "/shop/gifts" },
        ],
      },
    ],
    featured: [
      { label: "Himalayan Sea Salt", href: "/shop/sea-salt", bg: "#D4EDD8" },
      { label: "Peri Peri", href: "/shop/peri-peri", bg: "#FFE8CC" },
      { label: "Dark Chocolate", href: "/shop/dark-chocolate", bg: "#E8D8D8" },
    ],
    cta: { label: "Shop All Makhana", href: "/shop" },
  },
  {
    label: "Learn",
    href: "/learn",
    kind: "dropdown",
    items: [
      { label: "What is Makhana?", href: "/learn/what-is-makhana" },
      { label: "Health Benefits", href: "/learn/benefits" },
      { label: "How it's Made", href: "/learn/process" },
    ],
  },
  { label: "Reviews", href: "/reviews", kind: "plain", icon: Star },
];

export const RIGHT_NAV: { label: string; href: string }[] = [
  { label: "My Account", href: "/account" },
  { label: "Wholesale Partners", href: "/wholesale" },
  { label: "Snack Journal", href: "/journal" },
];

export const MOBILE_NAV: { label: string; href: string }[] = [
  { label: "Shop", href: "/shop" },
  { label: "Learn", href: "/learn" },
  { label: "Reviews", href: "/reviews" },
  { label: "My Account", href: "/account" },
  { label: "Wholesale Partners", href: "/wholesale" },
  { label: "Snack Journal", href: "/journal" },
];
