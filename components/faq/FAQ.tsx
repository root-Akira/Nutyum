"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FAQS = [
  {
    q: "What is makhana?",
    a: "Makhana (fox nut) is a water lily seed, popped into a light, crunchy snack. Naturally gluten-free, high in protein, and rich in antioxidants — a true Indian superfood.",
  },
  {
    q: "What makes Nutyum different?",
    a: "We air-roast, never fry. No preservatives, no artificial flavours. Every batch is traceable to sustainable farms in India.",
  },
  {
    q: "Are your products healthy?",
    a: "Yes — low calorie, high protein, gluten-free, and roasted in zero oil. Perfect for guilt-free snacking.",
  },
  {
    q: "How should I store makhana?",
    a: "Keep in an airtight container in a cool, dry place, away from direct sunlight. This helps maintain its crunch.",
  },
  {
    q: "What are your shipping details?",
    a: "Free shipping on orders above ₹500. Orders are dispatched within 24–48 hours.",
  },
  {
    q: "What is your return policy?",
    a: "We're confident you'll love it. If anything isn't right, contact us within 7 days for a replacement or refund.",
  },
];

function FAQItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: (typeof FAQS)[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.06 }}
      className="border-b border-[rgba(23,61,34,0.1)] last:border-0"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span
          className="text-sm font-semibold text-[#173D22]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {item.q}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          className={`shrink-0 text-[#173D22] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p
              className="pb-5 text-sm leading-relaxed text-[#4C5A48]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className="bg-[#d9eaf0] py-20 sm:py-28"
      aria-labelledby="faq-title"
    >
      <div className="mx-auto max-w-2xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          id="faq-title"
          className="mb-4 text-lg font-extrabold uppercase tracking-widest text-[#173D22]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Got Questions?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
          className="mb-10 text-[clamp(1.6rem,3.5vw,2.8rem)] leading-snug tracking-[-0.02em] text-[#173D22]"
          style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)" }}
        >
          Everything you need to know about Nutyum
        </motion.h2>

        <div className="text-left">
          {FAQS.map((item, i) => (
            <FAQItem
              key={item.q}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
