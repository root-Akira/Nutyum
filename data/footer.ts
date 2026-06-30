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
      { label: "Best Sellers", href: "/shop/best-sellers" },
      { label: "New Arrivals", href: "/shop/new" },
      { label: "Gift Sets", href: "/shop/gifts" },
      { label: "Bulk Orders", href: "/wholesale" },
    ],
  },
  {
    heading: "Gift Sets",
    links: [
      { label: "Starter Pack", href: "/shop/starter" },
      { label: "Variety Pack", href: "/shop/variety" },
      { label: "Festival Box", href: "/shop/festival" },
      { label: "Corporate Gifting", href: "/corporate" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "What is Makhana?", href: "/learn/what-is-makhana" },
      { label: "Health Benefits", href: "/learn/benefits" },
      { label: "Sustainability", href: "/learn/sustainability" },
      { label: "Our Farm Partners", href: "/learn/farms" },
    ],
  },
  {
    heading: "Snack Journal",
    links: [
      { label: "Recipes", href: "/journal/recipes" },
      { label: "Snack Culture", href: "/journal/culture" },
      { label: "Ingredients", href: "/journal/ingredients" },
      { label: "Reviews", href: "/reviews" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];
