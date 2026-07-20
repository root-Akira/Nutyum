"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/formatters";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STATUS_STYLES: Record<string, string> = {
  placed: "bg-yellow-100 text-yellow-800",
  packed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  placed: "Placed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

type Order = {
  id: string;
  status: string;
  subtotal: number;
  shipping: number;
  discountAmount: number;
  total: number;
  items: { id: string; productId: string; productName?: string; quantity: number; price: number }[];
  createdAt: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setOrders(data);
        }
      })
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[rgba(23,61,34,0.15)] border-t-[#173D22]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8 text-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8 text-center"
      >
        <Package className="mx-auto mb-4 h-12 w-12 text-[#4C5A48]" />
        <h2 className="mb-2 text-xl font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          No orders yet
        </h2>
        <p className="mb-6 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          Start shopping to see your orders here.
        </p>
        <Link
          href="/shop"
          className="inline-flex rounded-full bg-[#173D22] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0e2616]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Browse Products
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, i) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
        >
          <Link
            href={`/account/orders/${order.id}`}
            className="flex items-center justify-between rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-5 transition-all hover:shadow-md sm:p-6"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                  #{order.id.slice(0, 8)}
                </p>
                <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-800"}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                <span>{formatDate(order.createdAt)}</span>
                <span>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
                <span className="font-semibold text-[#173D22]">{formatPrice(order.total)}</span>
              </div>
            </div>
            <ChevronRight className="ml-4 h-5 w-5 shrink-0 text-[#4C5A48]" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
