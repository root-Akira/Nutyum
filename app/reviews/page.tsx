"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { ReviewCard, StarRating, type Review } from "@/components/reviews/ReviewCard";
import { CITIES_BY_STATE, STATES } from "@/lib/locations";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type SortKey = "recent" | "oldest" | "highest";

function SubmitForm() {
  const [form, setForm] = useState({ name: "", email: "", rating: 0, title: "", comment: "", product: "", city: "", state: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [productNames, setProductNames] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setProductNames(data.map((p: any) => p.name));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="mb-2 text-lg font-semibold text-green-800" style={{ fontFamily: "var(--font-heading)" }}>
          Thank you for your review!
        </p>
        <p className="text-sm text-green-700" style={{ fontFamily: "var(--font-body)" }}>
          Your feedback helps us improve. We&apos;ll review and publish it shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-medium text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
            Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-[rgba(23,61,34,0.2)] bg-white px-4 py-2.5 text-sm text-[#173D22] placeholder:text-[#4C5A48]/60 focus:border-[#173D22] focus:outline-none"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-medium text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
            Email (not published) *
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-[rgba(23,61,34,0.2)] bg-white px-4 py-2.5 text-sm text-[#173D22] placeholder:text-[#4C5A48]/60 focus:border-[#173D22] focus:outline-none"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="mb-1 block text-xs font-medium text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
            City
          </label>
          <select
            id="city"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full rounded-xl border border-[rgba(23,61,34,0.2)] bg-white px-4 py-2.5 text-sm text-[#173D22] focus:border-[#173D22] focus:outline-none"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <option value="">Select city (optional)</option>
            {(CITIES_BY_STATE[form.state] || []).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="state" className="mb-1 block text-xs font-medium text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
            State
          </label>
          <select
            id="state"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value, city: "" })}
            className="w-full rounded-xl border border-[rgba(23,61,34,0.2)] bg-white px-4 py-2.5 text-sm text-[#173D22] focus:border-[#173D22] focus:outline-none"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <option value="">Select state (optional)</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="product" className="mb-1 block text-xs font-medium text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
          Product reviewed *
        </label>
        <select
          id="product"
          required
          value={form.product}
          onChange={(e) => setForm({ ...form, product: e.target.value })}
          className="w-full rounded-xl border border-[rgba(23,61,34,0.2)] bg-white px-4 py-2.5 text-sm text-[#173D22] focus:border-[#173D22] focus:outline-none"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <option value="">Select a product</option>
          {productNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
          Rating *
        </label>
        <div className="flex flex-row gap-2">
          {[1, 2, 3, 4, 5].map((r) => {
            const active = r <= (hoverRating || form.rating);
            return (
              <button
                key={r}
                type="button"
                onClick={() => setForm({ ...form, rating: r === form.rating ? 0 : r })}
                onMouseEnter={() => setHoverRating(r)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
                aria-label={`${r} star${r !== 1 ? "s" : ""}`}
              >
                <Star size={22} fill={active ? "#E0961A" : "none"} stroke={active ? "#E0961A" : "#d1d5db"} />
              </button>
            );
          })}
        </div>
        <p className="mt-1 text-xs text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          {form.rating > 0 ? `You rated ${form.rating} out of 5` : "Click a star to rate"}
        </p>
      </div>

      <div>
        <label htmlFor="title" className="mb-1 block text-xs font-medium text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
          Review title *
        </label>
        <input
          id="title"
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Summarise your experience"
          className="w-full rounded-xl border border-[rgba(23,61,34,0.2)] bg-white px-4 py-2.5 text-sm text-[#173D22] placeholder:text-[#4C5A48]/60 focus:border-[#173D22] focus:outline-none"
          style={{ fontFamily: "var(--font-body)" }}
        />
      </div>

      <div>
        <label htmlFor="comment" className="mb-1 block text-xs font-medium text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
          Your review *
        </label>
        <textarea
          id="comment"
          required
          rows={4}
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          placeholder="Tell us what you loved (or what we can improve)"
          className="w-full rounded-xl border border-[rgba(23,61,34,0.2)] bg-white px-4 py-2.5 text-sm text-[#173D22] placeholder:text-[#4C5A48]/60 focus:border-[#173D22] focus:outline-none resize-none"
          style={{ fontFamily: "var(--font-body)" }}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" style={{ fontFamily: "var(--font-body)" }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        className="rounded-full bg-[#173D22] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0e2616] hover:shadow-[0_8px_30px_rgba(23,61,34,0.25)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Submit Review
      </button>
    </form>
  );
}

export default function ReviewsPage() {
  const [apiReviews, setApiReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("recent");
  const scrollToForm = () => {
    document.getElementById("write-review")?.scrollIntoView({ behavior: "smooth" });
  };

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

  const allReviews = useMemo(() => {
    if (sort === "recent") return apiReviews;
    if (sort === "oldest") return [...apiReviews].reverse();
    return [...apiReviews].sort((a, b) => b.rating - a.rating);
  }, [apiReviews, sort]);

  const overall = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length || 0;

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "recent", label: "Most Recent" },
    { key: "oldest", label: "Oldest First" },
    { key: "highest", label: "Highest Rated" },
  ];

  return (
    <main className="min-h-screen bg-[#FAF7EE]">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-16 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
            What Our Customers Say
          </h1>
          <p className="mb-6 text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
            Real reviews from real people who love Nutyum.
          </p>
          <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(23,61,34,0.15)] bg-white px-6 py-3">
            {allReviews.length > 0 && <StarRating rating={Math.round(overall)} size={16} />}
            <span className="text-sm font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
              {allReviews.length > 0 ? `${overall.toFixed(1)} out of 5  &middot;  ${allReviews.length} reviews` : "No reviews yet"}
            </span>
          </div>
        </motion.div>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={scrollToForm}
            className="rounded-full border border-[#E0961A] bg-[#E0961A]/10 px-5 py-2 text-xs font-medium text-[#173D22] transition-all hover:bg-[#E0961A]/20"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Write a Review
          </button>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSort(opt.key)}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all ${
                sort === opt.key
                  ? "bg-[#173D22] text-white"
                  : "border border-[rgba(23,61,34,0.2)] bg-white text-[#173D22] hover:border-[#173D22]"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mb-20 flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[rgba(23,61,34,0.15)] border-t-[3px] border-t-[#173D22]" />
              <p className="text-sm font-medium text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                Loading reviews...
              </p>
            </div>
          </div>
        ) : allReviews.length === 0 ? (
          <div className="mb-20 py-16 text-center">
            <p className="text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              No reviews yet. Be the first to share your experience!
            </p>
          </div>
        ) : (
          <div className="mb-20 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {allReviews.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </div>
        )}

        <motion.div
          id="write-review"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto max-w-2xl"
        >
          <h2 className="mb-2 text-center text-2xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
            Write a Review
          </h2>
          <p className="mb-8 text-center text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
            Loved our snacks? Share your experience — your feedback helps other snack lovers discover Nutyum.
          </p>
          <SubmitForm />
        </motion.div>
      </div>
    </main>
  );
}
