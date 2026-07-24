"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Package, ChevronRight, ChevronDown, X } from "lucide-react";
import { formatPrice } from "@/lib/formatters";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STATUS_STYLES: Record<string, string> = {
  placed: "bg-yellow-100 text-yellow-800",
  packed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  out_for_delivery: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  placed: "Placed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_SUBTEXT: Record<string, string> = {
  placed: "Order is being processed",
  packed: "Order has been packed",
  shipped: "On its way to you",
  out_for_delivery: "Out for delivery — almost there!",
  delivered: "Your order has been delivered",
  cancelled: "This order was cancelled",
};

type OrderItem = {
  id: string;
  productId: string;
  productName?: string;
  productImage?: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  status: string;
  total: number;
  items: OrderItem[];
  notes?: string;
  createdAt: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getCancelReason(notes?: string): string {
  if (!notes) return "";
  const match = notes.match(/\[Cancellation reason: ([^\]]+)\]/);
  return match ? match[1] : "";
}

function ItemThumbnail({ item, itemsCount }: { item?: OrderItem; itemsCount: number }) {
  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#FAF7EE]">
      {item?.productImage ? (
        <Image
          src={item.productImage}
          alt={item.productName || "Product"}
          width={64}
          height={64}
          className="h-full w-full object-contain"
        />
      ) : (
        <Package className="h-7 w-7 text-[#4C5A48]" />
      )}
      {itemsCount > 1 && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#173D22] text-[10px] font-bold text-white shadow-sm">
          {itemsCount}
        </span>
      )}
    </div>
  );
}

function OrderInfo({ order }: { order: Order }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <p className="truncate text-sm font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          {order.items[0]?.productName || `Order #${order.id.slice(0, 8)}`}
        </p>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-800"}`}>
          {STATUS_LABELS[order.status] || order.status}
        </span>
        <span className="text-xs text-[#8A9A8C]">{formatDate(order.createdAt)}</span>
      </div>
      <p className="mt-1 text-xs text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
        {STATUS_SUBTEXT[order.status] || ""}
      </p>
      <div className="mt-1.5 flex items-center gap-3 text-xs text-[#4C5A48]">
        <span className="font-semibold text-[#173D22]">{formatPrice(order.total)}</span>
        <span className="text-[#8A9A8C]">•</span>
        <span>{order.items.reduce((s, it) => s + it.quantity, 0)} item{order.items.length !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}

function CancelReason({ reason, orderId }: { reason: string; orderId: string }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      className="rounded-b-2xl border border-t-0 border-[rgba(23,61,34,0.1)] bg-red-50 px-4 pb-4 pt-2 sm:px-5"
    >
      <div className="flex items-start gap-2 text-sm text-red-700">
        <X className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-medium">Order Cancelled</p>
          <p className="mt-0.5 text-xs text-red-600">Reason: {reason}</p>
          <Link
            href={`/account/orders/${orderId}`}
            className="mt-1.5 inline-block text-xs font-medium text-red-700 underline"
          >
            View details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const filteredOrders = filter === "all"
    ? orders
    : orders.filter((o) => o.status === filter);

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
    <div>
      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["all", "placed", "shipped", "delivered", "cancelled"].map((key) => {
          const count = key === "all" ? orders.length : (statusCounts[key] || 0);
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === key
                  ? "bg-[#173D22] text-white"
                  : "border border-[rgba(23,61,34,0.15)] bg-white text-[#4C5A48] hover:border-[#173D22]"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {key === "all" ? "All" : STATUS_LABELS[key] || key}
              <span className="ml-1.5 text-xs opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Order list */}
      <div className="space-y-4">
        {filteredOrders.map((order, i) => {
          const reason = order.status === "cancelled" ? getCancelReason(order.notes) : "";
          const isExpanded = expandedId === order.id;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04, ease: EASE }}
            >
              {reason ? (
                <>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className={`w-full rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white text-left transition-all hover:shadow-md ${
                      isExpanded ? "rounded-b-none border-b-0" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4 p-4 sm:p-5">
                      <ItemThumbnail item={order.items[0]} itemsCount={order.items.length} />
                      <OrderInfo order={order} />
                      <div className="shrink-0 text-[#4C5A48]">
                        {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                      </div>
                    </div>
                  </button>
                  {isExpanded && <CancelReason reason={reason} orderId={order.id} />}
                </>
              ) : (
                <Link
                  href={`/account/orders/${order.id}`}
                  className={`block rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white transition-all hover:shadow-md`}
                >
                  <div className="flex items-center gap-4 p-4 sm:p-5">
                    <ItemThumbnail item={order.items[0]} itemsCount={order.items.length} />
                    <OrderInfo order={order} />
                    <ChevronRight className="h-5 w-5 shrink-0 text-[#4C5A48]" />
                  </div>
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
