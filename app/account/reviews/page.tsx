"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Pencil, Trash2 } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editTitle, setEditTitle] = useState("");
  const [editComment, setEditComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = () => {
    fetch("/api/reviews?mine=1")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setReviews(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchReviews, []);

  const startEdit = (r: any) => {
    setEditingId(r.id);
    setEditRating(r.rating);
    setEditTitle(r.title || "");
    setEditComment(r.comment || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    if (!editTitle.trim() || !editComment.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/reviews/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: editRating, title: editTitle.trim(), comment: editComment.trim() }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchReviews();
      }
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      setDeletingId(null);
      fetchReviews();
    } catch {
      setDeletingId(null);
    }
  };

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
                {editingId === r.id ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-[#173D22]">{r.product_name || r.product}</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button key={i} type="button" onClick={() => setEditRating(i + 1)}>
                          <Star
                            className={`h-5 w-5 ${i < editRating ? "fill-[#E0961A] text-[#E0961A]" : "text-[rgba(23,61,34,0.15)]"}`}
                          />
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Review title"
                      className="w-full rounded-lg border border-[rgba(23,61,34,0.15)] bg-white px-3 py-2 text-sm text-[#173D22] outline-none focus:border-[#173D22]"
                    />
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      placeholder="Your review"
                      rows={3}
                      className="w-full rounded-lg border border-[rgba(23,61,34,0.15)] bg-white px-3 py-2 text-sm text-[#173D22] outline-none focus:border-[#173D22] resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={saveEdit}
                        disabled={saving || !editTitle.trim() || !editComment.trim()}
                        className="rounded-lg bg-[#173D22] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0e2616] disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-lg border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2 text-sm font-medium text-[#4C5A48] transition-colors hover:bg-[#FAF7EE]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
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
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(r)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#4C5A48] transition-colors hover:bg-[#173D22]/10 hover:text-[#173D22]"
                          aria-label="Edit review"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this review?")) {
                              confirmDelete(r.id);
                            }
                          }}
                          disabled={deletingId === r.id}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-red-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                          aria-label="Delete review"
                        >
                          <Trash2 size={14} />
                        </button>
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
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
