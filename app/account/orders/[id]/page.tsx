"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Package, MapPin, User, Download, Star, CheckCircle, X, Loader2,
} from "lucide-react";
import { formatPrice } from "@/lib/formatters";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STATUS_STEPS = ["placed", "confirmed", "packed", "shipped", "out_for_delivery", "delivered"];
const STATUS_LABELS: Record<string, string> = {
  placed: "Order Placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_BANNER: Record<string, { msg: string; bg: string; icon: string }> = {
  placed: { msg: "Payment successful — no cash needed on delivery", bg: "bg-green-50 border-green-200 text-green-800", icon: "check" },
  confirmed: { msg: "Your order has been confirmed", bg: "bg-green-50 border-green-200 text-green-800", icon: "check" },
  packed: { msg: "Your order is being packed", bg: "bg-amber-50 border-amber-200 text-amber-800", icon: "clock" },
  shipped: { msg: "Your order has been shipped", bg: "bg-amber-50 border-amber-200 text-amber-800", icon: "clock" },
  out_for_delivery: { msg: "Your order is out for delivery", bg: "bg-blue-50 border-blue-200 text-blue-800", icon: "clock" },
  delivered: { msg: "Your order has been delivered", bg: "bg-green-50 border-green-200 text-green-800", icon: "check" },
  cancelled: { msg: "This order was cancelled", bg: "bg-red-50 border-red-200 text-red-800", icon: "x" },
};

type StatusLog = { status: string; changedAt: string; note: string };
type OrderItem = { id: string; productId: string; productName?: string; variantName?: string; productImage?: string; quantity: number; price: number };
type OrderDetail = {
  id: string; status: string; subtotal: number; shipping: number; discountAmount: number; total: number;
  paymentMethod: string; notes: string;
  email?: string; name?: string; phone?: string;
  recipientName?: string; recipientEmail?: string; recipientPhone?: string;
  shippingAddress?: { line1: string; line2?: string; city: string; state: string; pincode: string; phone: string; recipient_name?: string; recipient_email?: string; recipient_phone?: string };
  items: OrderItem[]; statusLogs: StatusLog[]; createdAt: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function formatDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)} className="transition-transform hover:scale-110">
          <Star className={`h-6 w-6 ${star <= value ? "fill-[#E0961A] text-[#E0961A]" : "text-[rgba(23,61,34,0.2)]"}`} />
        </button>
      ))}
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);

  useEffect(() => {
    const reviewed = JSON.parse(localStorage.getItem("nutyum-reviewed-orders") || "[]");
    if (Array.isArray(reviewed) && reviewed.includes(id)) {
      setReviewDone(true);
    }
  }, [id]);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); } else { setOrder(data); }
      })
      .catch(() => setError("Failed to load order"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[rgba(23,61,34,0.15)] border-t-[#173D22]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8 text-center">
        <p className="mb-4 text-sm text-red-600">{error || "Order not found"}</p>
        <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm font-medium text-[#173D22] underline" style={{ fontFamily: "var(--font-body)" }}>
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === "cancelled";
  const isDelivered = order.status === "delivered";
  const canCancel = ["placed", "confirmed"].includes(order.status);
  const currentStep = STATUS_STEPS.indexOf(order.status);
  const logMap = new Map<string, StatusLog>();
  for (const log of order.statusLogs) {
    logMap.set(log.status, log);
  }

  const listingPrice = order.subtotal + order.discountAmount;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
      {/* Status Banner */}
      {(STATUS_BANNER[order.status]) && (
        <div className={`mb-6 rounded-2xl border px-5 py-3 text-sm font-medium ${STATUS_BANNER[order.status].bg}`}>
          <div className="flex items-center gap-2">
            {STATUS_BANNER[order.status].icon === "check" ? (
              <CheckCircle className="h-5 w-5 shrink-0" />
            ) : STATUS_BANNER[order.status].icon === "x" ? (
              <X className="h-5 w-5 shrink-0" />
            ) : (
              <div className="h-5 w-5 shrink-0 rounded-full border-2 border-current" />
            )}
            <span style={{ fontFamily: "var(--font-body)" }}>{STATUS_BANNER[order.status].msg}</span>
          </div>
        </div>
      )}

      <Link href="/account/orders" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#4C5A48] transition-colors hover:text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      {/* Order Header */}
      <div className="mb-6 rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
              Order #{order.id.slice(0, 8)}
            </h2>
            <p className="mt-1 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-4 py-1.5 text-sm font-medium ${isCancelled ? "bg-red-100 text-red-800" : isDelivered ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
              {STATUS_LABELS[order.status] || order.status}
            </span>
            {canCancel && (
              <button onClick={() => setShowCancelModal(true)} className="rounded-full border border-red-300 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50" style={{ fontFamily: "var(--font-body)" }}>
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

        {/* Left: Tracking Timeline + Items */}
        <div className="space-y-6">

          {/* Vertical Tracking Timeline */}
          <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
            <h3 className="mb-6 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
              Tracking
            </h3>
            {isCancelled ? (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                This order has been cancelled.
              </div>
            ) : (
              <div className="space-y-0">
                {STATUS_STEPS.map((step, idx) => {
                  const done = idx <= currentStep;
                  const isLast = idx === STATUS_STEPS.length - 1;
                  const logEntry = logMap.get(step);
                  return (
                    <div key={step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                          done ? "border-[#173D22] bg-[#173D22] text-white" : "border-[rgba(23,61,34,0.2)] bg-white text-[#4C5A48]"
                        }`}>
                          {done ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                        </div>
                        {!isLast && <div className={`h-8 w-0.5 ${done ? "bg-[#173D22]" : "bg-[rgba(23,61,34,0.15)]"}`} />}
                      </div>
                      <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                        <p className={`text-sm font-medium ${done ? "text-[#173D22]" : "text-[#4C5A48]"}`} style={{ fontFamily: "var(--font-body)" }}>
                          {STATUS_LABELS[step]}
                        </p>
                        {logEntry && (
                          <p className="mt-0.5 text-xs text-[#8A9A8C]" style={{ fontFamily: "var(--font-body)" }}>
                            {formatDateShort(logEntry.changedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Items */}
          <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
            <h3 className="mb-4 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
              Items
            </h3>
            <div className="divide-y divide-[rgba(23,61,34,0.08)]">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#FAF7EE]">
                      {item.productImage ? (
                        <Image src={item.productImage} alt={item.productName || ""} width={48} height={48} className="h-full w-full object-contain" />
                      ) : (
                        <Package className="h-5 w-5 text-[#4C5A48]" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                        {item.productName || item.productId}
                      </p>
                      {item.variantName && <p className="text-xs text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>{item.variantName}</p>}
                      <p className="text-xs text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-[#173D22]">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rate & Review for delivered orders */}
          {isDelivered && !reviewDone && (
            <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
              <h3 className="mb-3 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                Rate your experience
              </h3>
              <p className="mb-3 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                How was your Nutyum experience?
              </p>
              <StarRating value={rating} onChange={setRating} />
              {rating > 0 && (
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Review title"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-[#FAF7EE] px-4 py-2.5 text-sm text-[#173D22] placeholder:text-[#8A9A8C] outline-none focus:border-[#173D22]"
                  />
                  <textarea
                    placeholder="Write your review..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-[#FAF7EE] px-4 py-2.5 text-sm text-[#173D22] placeholder:text-[#8A9A8C] outline-none focus:border-[#173D22]"
                  />
                  <button
                    onClick={async () => {
                      if (!reviewTitle.trim() || !reviewComment.trim()) return;
                      setSubmittingReview(true);
                      try {
                        const firstItem = order.items[0];
                        await fetch("/api/reviews", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: order.recipientName || order.name || "Customer",
                            email: order.recipientEmail || order.email,
                            rating,
                            title: reviewTitle,
                            comment: reviewComment,
                            product: firstItem?.productId || order.id,
                            city: order.shippingAddress?.city || "",
                            state: order.shippingAddress?.state || "",
                          }),
                        });
                        setReviewDone(true);
                        const reviewed = JSON.parse(localStorage.getItem("nutyum-reviewed-orders") || "[]");
                        if (!reviewed.includes(order.id)) {
                          reviewed.push(order.id);
                          localStorage.setItem("nutyum-reviewed-orders", JSON.stringify(reviewed));
                        }
                      } catch {
                        // ignore
                      } finally {
                        setSubmittingReview(false);
                      }
                    }}
                    disabled={submittingReview || !reviewTitle.trim() || !reviewComment.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#173D22] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0e2616] disabled:opacity-50"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {submittingReview ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Submit Review
                  </button>
                </div>
              )}
            </div>
          )}
          {reviewDone && (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center text-sm font-medium text-green-800">
              Thank you for your review!
            </div>
          )}
        </div>

        {/* Right: Delivery Details + Price Breakdown + Invoice */}
        <div className="space-y-6">

          {/* Delivery Details (merged) */}
          <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
            <h3 className="mb-4 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
              Delivery Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#173D22]" />
                <div>
                  {order.shippingAddress ? (
                    <>
                      <p>{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
                    </>
                  ) : (
                    <p className="text-[#8A9A8C]">No address on file</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                <User className="mt-0.5 h-4 w-4 shrink-0 text-[#173D22]" />
                <div>
                  <p>{order.recipientName || order.name || "—"}</p>
                  <p>{order.recipientPhone || order.phone || "—"}</p>
                  <p className="text-xs text-[#8A9A8C]">{order.recipientEmail || order.email || ""}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
            <h3 className="mb-4 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
              Price Breakdown
            </h3>
            <div className="space-y-2 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              <div className="flex justify-between text-[#4C5A48]">
                <span>Listing Price</span>
                <span className={order.discountAmount > 0 ? "text-[#8A9A8C] line-through" : ""}>
                  {formatPrice(listingPrice)}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <>
                  <div className="flex justify-between text-[#4C5A48]">
                    <span>Selling Price</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-[#4C5A48]">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-[rgba(23,61,34,0.1)] pt-2 text-base font-bold text-[#173D22]">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Download Invoice */}
          <Link
            href={`/api/invoice/${order.id}`}
            target="_blank"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[rgba(23,61,34,0.2)] bg-white px-6 py-3 text-sm font-semibold text-[#173D22] transition-colors hover:border-[#173D22] hover:bg-[#FAF7EE]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Download className="h-4 w-4" /> Download Invoice
          </Link>

          {/* Payment method info */}
          {order.paymentMethod && (
            <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
              <h3 className="mb-2 text-sm font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                Payment
              </h3>
              <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>Cancel Order</h3>
              <button onClick={() => setShowCancelModal(false)} className="text-[#4C5A48] hover:text-[#173D22]"><X className="h-5 w-5" /></button>
            </div>
            <p className="mb-4 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <label className="mb-4 block text-sm font-medium text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
              Reason (optional)
              <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-[#FAF7EE] px-3 py-2 text-sm text-[#173D22] outline-none focus:border-[#173D22]" placeholder="Tell us why you're cancelling..." />
            </label>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 rounded-xl border border-[rgba(23,61,34,0.15)] py-2.5 text-sm font-medium text-[#4C5A48] transition-colors hover:bg-[#FAF7EE]" style={{ fontFamily: "var(--font-body)" }}>
                Keep Order
              </button>
              <button
                onClick={async () => {
                  setCancelling(true);
                  try {
                    const res = await fetch(`/api/orders/${order.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "cancel", reason: cancelReason }) });
                    const data = await res.json();
                    if (data.error) { alert(data.error); } else { setOrder({ ...order, status: "cancelled" }); setShowCancelModal(false); setCancelReason(""); }
                  } catch { alert("Failed to cancel order. Please try again."); } finally { setCancelling(false); }
                }}
                disabled={cancelling}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel Order"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
