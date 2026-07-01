import type { FooterColumn } from "@/types";

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Flavours",
    links: [
      { label: "Himalayan Sea Salt", href: "/shop/himalayan-sea-salt" },
      { label: "Peri Peri", href: "/shop/peri-peri" },
      { label: "Dark Chocolate", href: "/shop/dark-chocolate" },
      { label: "Classic Pudina", href: "/shop/classic-pudina" },
      { label: "Turmeric & Pepper", href: "/shop/turmeric-pepper" },
    ],
  },
  {
    heading: "Collections",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Best Sellers", href: "/shop" },
      { label: "New Arrivals", href: "/shop" },
      { label: "Gift Sets", href: "/shop" },
      { label: "Bulk Orders", href: "/wholesale" },
    ],
  },
  {
    heading: "Gift Sets",
    links: [
      { label: "Starter Pack", href: "/shop" },
      { label: "Variety Pack", href: "/shop/variety-pack" },
      { label: "Festival Box", href: "/shop" },
      { label: "Corporate Gifting", href: "/wholesale" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "What is Makhana?", href: "/learn/what-is-makhana" },
      { label: "Health Benefits", href: "/learn/benefits" },
      { label: "Sustainability", href: "/learn" },
      { label: "Our Farm Partners", href: "/learn" },
    ],
  },
  {
    heading: "Snack Journal",
    links: [
      { label: "Recipes", href: "/journal" },
      { label: "Snack Culture", href: "/journal" },
      { label: "Ingredients", href: "/journal" },
      { label: "Reviews", href: "/shop" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Support Home", href: "/support" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];
