"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ReviewCard, Review, StarRating } from "./ReviewCard";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FALLBACK_REVIEWS: Review[] = [
  { id: "1", name: "Priya S.", location: "Mumbai, Maharashtra", rating: 5, date: "June 2026", title: "Best snack I've ever had!", comment: "I ordered the Variety Pack and every single flavour is amazing. The Dark Chocolate one is my absolute favourite!", product: "Nutyum Variety Pack" },
  { id: "2", name: "Arjun M.", location: "Bengaluru, Karnataka", rating: 5, date: "May 2026", title: "Perfect evening munch", comment: "The Himalayan Sea Salt Makhana is perfectly seasoned!", product: "Himalayan Sea Salt Makhana" },
  { id: "3", name: "Ananya K.", location: "Delhi", rating: 4, date: "May 2026", title: "Great taste, loved the peri peri", comment: "The Peri Peri flavour has a nice kick to it without being overwhelming.", product: "Peri Peri Makhana" },
];

export function ReviewsSection() {
  const [apiReviews, setApiReviews] = useState<Review[]>(FALLBACK_REVIEWS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          const mapped = data.map((r: any) => ({
            id: r.id,
            name: r.name,
            location: r.location || "",
            rating: r.rating,
            date: new Date(r.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" }),
            title: r.title,
            comment: r.comment,
            product: r.product,
          }));
          setApiReviews(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const top3 = apiReviews.slice(0, 3);
  const overall = apiReviews.reduce((s, r) => s + r.rating, 0) / apiReviews.length || 0;

  return (
    <section className="bg-[#FAF7EE] py-20 sm:py-28" aria-labelledby="reviews-title">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12 text-center"
        >
          <h2
            id="reviews-title"
            className="border-2 border-[#E0961A] inline-block px-6 py-2 text-lg font-bold uppercase tracking-widest text-[#173D22] bg-[rgba(224,150,26,0.08)] mb-6"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Real Reviews
          </h2>
          <div className="flex items-center justify-center gap-3">
            <StarRating rating={Math.round(overall)} size={16} />
            <span className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              {overall.toFixed(1)} out of 5 &middot; {apiReviews.length} reviews
            </span>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[rgba(23,61,34,0.15)] border-t-[3px] border-t-[#173D22]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {top3.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 rounded-full bg-[#173D22] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#0e2616] hover:shadow-[0_8px_30px_rgba(23,61,34,0.25)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            See More Reviews
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
