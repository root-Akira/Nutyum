"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews?mine=1")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setReviews(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#173D22] border-t-transparent" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
        <h2 className="mb-6 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          My Reviews &amp; Ratings
        </h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
            You haven&apos;t reviewed any products yet. After your orders are delivered, you can rate and review them!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r: any) => (
              <div
                key={r.id}
                className="rounded-xl border border-[rgba(23,61,34,0.1)] bg-[#FAF7EE] p-4"
              >
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                    {r.product_name || r.product}
                  </p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < (r.rating || 0) ? "fill-[#E0961A] text-[#E0961A]" : "text-[rgba(23,61,34,0.15)]"}`}
                      />
                    ))}
                  </div>
                </div>
                {r.title && (
                  <p className="mt-1 text-sm font-medium text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
                    {r.title}
                  </p>
                )}
                {r.comment && (
                  <p className="mt-0.5 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                    {r.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
