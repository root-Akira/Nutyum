"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ReviewCard, Review, StarRating } from "./ReviewCard";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function ReviewsSection() {
  const [apiReviews, setApiReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data.map((r: any) => ({
            id: r.id,
            name: r.name,
            location: r.location || "",
            rating: r.rating,
            date: new Date(r.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" }),
            title: r.title,
            comment: r.comment,
            product: r.product,
            product_name: r.product_name,
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
            {apiReviews.length > 0 && <StarRating rating={Math.round(overall)} size={16} />}
            <span className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              {apiReviews.length > 0
                ? `${overall.toFixed(1)} out of 5 &middot; ${apiReviews.length} reviews`
                : "No reviews yet"}
            </span>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[rgba(23,61,34,0.15)] border-t-[3px] border-t-[#173D22]" />
          </div>
        ) : apiReviews.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              No reviews yet. Be the first to share your experience!
            </p>
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
