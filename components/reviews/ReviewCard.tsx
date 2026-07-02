"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  product: string;
  admin_reply?: string;
}

export function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < rating ? "#E0961A" : "none"}
          stroke={i < rating ? "#E0961A" : "#d1d5db"}
        />
      ))}
    </div>
  );
}

export function ReviewCard({ review, index = 0 }: { review: Review; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.05 }}
      className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 transition-all hover:shadow-md"
    >
      <div className="mb-3 flex items-center justify-between">
        <StarRating rating={review.rating} />
        <span className="text-xs text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          {review.date}
        </span>
      </div>
      <h3 className="mb-1 text-base font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
        {review.title}
      </h3>
      <p className="mb-3 text-sm leading-relaxed text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
        {review.comment}
      </p>
      {review.admin_reply && (
        <div className="mb-3 rounded-lg bg-[rgba(23,61,34,0.04)] border border-[rgba(23,61,34,0.08)] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#173D22] mb-0.5">Response from Nutyum</p>
          <p className="text-sm text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>{review.admin_reply}</p>
        </div>
      )}
      <div className="flex items-center justify-between border-t border-[rgba(23,61,34,0.06)] pt-3">
        <div>
          <p className="text-sm font-medium text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
            {review.name}
          </p>
          <p className="text-xs text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
            {review.location}
          </p>
        </div>
        <span className="rounded-full bg-[rgba(23,61,34,0.06)] px-3 py-1 text-[10px] font-medium text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          {review.product}
        </span>
      </div>
    </motion.div>
  );
}
