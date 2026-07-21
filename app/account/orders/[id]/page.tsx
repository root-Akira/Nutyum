"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Package, MapPin, X } from "lucide-react";
import { formatPrice } from "@/lib/formatters";


const CANCELLABLE_STATUSES = ["placed", "confirmed"];
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STATUS_STEPS = ["placed", "packed", "shipped", "delivered"];
const STATUS_LABELS: Record<string, string> = {
  placed: "Placed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

type OrderDetail = {
  id: string;
  status: string;
  subtotal: number;
  shipping: number;
  discountAmount: number;
  total: number;
  items: { id: string; productId: string; productName?: string; variantName?: string; quantity: number; price: number }[];
  createdAt: string;
  email?: string;
  name?: string;
  phone?: string;
  recipientName?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  shippingAddress?: { line1: string; line2?: string; city: string; state: string; pincode: string; phone: string };
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setOrder(data);
        }
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
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#173D22] underline"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>
      </div>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <Link
        href="/account/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#4C5A48] transition-colors hover:text-[#173D22]"
        style={{ fontFamily: "var(--font-body)" }}
      >
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
            <span className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              isCancelled ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}>
              {STATUS_LABELS[order.status] || order.status}
            </span>
            {CANCELLABLE_STATUSES.includes(order.status) && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="rounded-full border border-red-300 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-6 rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
        <h3 className="mb-4 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Customer Details
        </h3>
        <div className="space-y-2 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          <p><span className="font-medium text-[#173D22]">Delivered to:</span></p>
          <p>{order.recipientName || order.name || "—"}</p>
          <p>{order.recipientEmail || order.email || "—"}</p>
          <p>{order.recipientPhone || order.phone || "—"}</p>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="mb-6 rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
          <h3 className="mb-4 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
            Shipping Address
          </h3>
          <div className="flex items-start gap-3 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#173D22]" />
            <div>
              <p>{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="mb-6 rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
        <h3 className="mb-4 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Items
        </h3>
        <div className="divide-y divide-[rgba(23,61,34,0.08)]">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-[#FAF7EE]">
                  <Package className="h-5 w-5 text-[#4C5A48]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                    {item.productName || item.productId}
                  </p>
                  {item.variantName && (
                    <p className="text-xs text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>{item.variantName}</p>
                  )}
                  <p className="text-xs text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium text-[#173D22]">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
        <h3 className="mb-4 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Order Summary
        </h3>
        <div className="space-y-2 text-sm" style={{ fontFamily: "var(--font-body)" }}>
          <div className="flex justify-between text-[#4C5A48]">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatPrice(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-[#4C5A48]">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-[rgba(23,61,34,0.1)] pt-2 font-semibold text-[#173D22]">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="mb-6 rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
        <h3 className="mb-6 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Tracking
        </h3>

        {isCancelled ? (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            This order has been cancelled.
          </div>
        ) : (
          <div className="flex items-center">
            {STATUS_STEPS.map((step, idx) => {
              const done = idx <= currentStep;
              const isLast = idx === STATUS_STEPS.length - 1;
              return (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                      done ? "border-[#173D22] bg-[#173D22] text-white" : "border-[rgba(23,61,34,0.2)] bg-white text-[#4C5A48]"
                    }`}>
                      {done ? "✓" : idx + 1}
                    </div>
                    <span className={`mt-2 whitespace-nowrap text-xs font-medium ${done ? "text-[#173D22]" : "text-[#4C5A48]"}`} style={{ fontFamily: "var(--font-body)" }}>
                      {STATUS_LABELS[step]}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={`mx-3 h-0.5 w-12 sm:w-20 ${done ? "bg-[#173D22]" : "bg-[rgba(23,61,34,0.15)]"}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                Cancel Order
              </h3>
              <button onClick={() => setShowCancelModal(false)} className="text-[#4C5A48] hover:text-[#173D22]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <label className="mb-4 block text-sm font-medium text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
              Reason (optional)
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-[#FAF7EE] px-3 py-2 text-sm text-[#173D22] outline-none focus:border-[#173D22]"
                placeholder="Tell us why you're cancelling..."
              />
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 rounded-xl border border-[rgba(23,61,34,0.15)] py-2.5 text-sm font-medium text-[#4C5A48] transition-colors hover:bg-[#FAF7EE]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Keep Order
              </button>
              <button
                onClick={async () => {
                  setCancelling(true);
                  try {
                    const res = await fetch(`/api/orders/${order.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ action: "cancel", reason: cancelReason }),
                    });
                    const data = await res.json();
                    if (data.error) {
                      alert(data.error);
                    } else {
                      setOrder({ ...order, status: "cancelled" });
                      setShowCancelModal(false);
                      setCancelReason("");
                    }
                  } catch {
                    alert("Failed to cancel order. Please try again.");
                  } finally {
                    setCancelling(false);
                  }
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
