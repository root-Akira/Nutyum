"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ReviewCard, Review, StarRating } from "./ReviewCard";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FALLBACK_REVIEWS: Review[] = [
  { id: "1", name: "Priya S.", location: "Mumbai, Maharashtra", rating: 5, date: "June 2026", title: "Best snack I've ever had!", comment: "I ordered the Variety Pack and every single flavour is amazing. The Dark Chocolate one is my absolute favourite!", product: "Nutyum Variety Pack" },
  { id: "2", name: "Arjun M.", location: "Bengaluru, Karnataka", rating: 5, date: "May 2026", title: "Perfect evening munch", comment: "The Himalayan Sea Salt Makhana is perfectly seasoned!", product: "Himalayan Sea Salt Makhana" },
  { id: "3", name: "Ananya K.", location: "Delhi", rating: 4, date: "May 2026", title: "Great taste, loved the peri peri", comment: "The Peri Peri flavour has a nice kick to it without being overwhelming.", product: "Peri Peri Makhana" },
  { id: "4", name: "Rahul V.", location: "Pune, Maharashtra", rating: 5, date: "April 2026", title: "Healthy snacking, finally!", comment: "I've been looking for a healthy snack that actually tastes good.", product: "Classic Pudina Makhana" },
  { id: "5", name: "Sneha R.", location: "Hyderabad, Telangana", rating: 5, date: "April 2026", title: "Gift-worthy presentation", comment: "Ordered the Variety Pack as a gift and she loved it!", product: "Nutyum Variety Pack" },
  { id: "6", name: "Vikram P.", location: "Chennai, Tamil Nadu", rating: 4, date: "March 2026", title: "Turmeric & Pepper is a must-try", comment: "The earthy turmeric with the pepper kick is brilliant.", product: "Turmeric & Pepper Makhana" },
  { id: "7", name: "Neha G.", location: "Ahmedabad, Gujarat", rating: 5, date: "March 2026", title: "Better than expected", comment: "I tried Nutyum at a friend's place and immediately ordered 3 packs.", product: "Dark Chocolate Makhana" },
  { id: "8", name: "Amit T.", location: "Kolkata, West Bengal", rating: 5, date: "February 2026", title: "Finally, a snack for my diet", comment: "Nutyum makhana is low calorie, high protein, and tasty.", product: "Himalayan Sea Salt Makhana" },
];

export function ReviewsSection() {
  const [apiReviews, setApiReviews] = useState<Review[]>(FALLBACK_REVIEWS);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
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
            admin_reply: r.admin_reply || undefined,
          }));
          setApiReviews(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const overall = apiReviews.reduce((s, r) => s + r.rating, 0) / apiReviews.length || 0;

  return (
    <section className="overflow-hidden bg-[#FAF7EE] py-20 sm:py-28" aria-labelledby="reviews-title">
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
          <div className="relative" ref={trackRef}>
            <style jsx>{`
              @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .scroll-track {
                display: flex;
                gap: 20px;
                width: fit-content;
                animation: scroll 50s linear infinite;
                will-change: transform;
              }

            `}</style>
            <div className="scroll-track">
              {[...apiReviews, ...apiReviews].map((review, i) => (
                <div key={`${review.id}-${i >= apiReviews.length ? 'dup' : 'orig'}-${i}`} className="w-[340px] shrink-0">
                  <ReviewCard review={review} index={0} />
                </div>
              ))}
            </div>
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
