"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Plus, Check, ChevronDown, MapPin, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
  selectDiscount,
  selectTotal,
} from "@/hooks/use-cart-store";
import { formatPrice } from "@/lib/formatters";
import { useUIStore } from "@/hooks/use-ui-store";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface Address {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
    document.head.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items: cartItems, couponCode, discount } = useCartStore();
  const subtotal = useCartStore(selectSubtotal);
  const total = useCartStore(selectTotal);
  const totalItems = useCartStore(selectTotalItems);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [codEnabled, setCodEnabled] = useState(false);
  const [codCharge, setCodCharge] = useState(0);

  // Address form
  const [addrLine1, setAddrLine1] = useState("");
  const [addrLine2, setAddrLine2] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrPincode, setAddrPincode] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrSaving, setAddrSaving] = useState(false);

  useEffect(() => {
    loadRazorpayScript()
      .then(() => setRazorpayLoaded(true))
      .catch(() => {});

    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.cod_enabled) {
          setCodEnabled(true);
          setCodCharge(Number(data.cod_charge) || 0);
        }
      })
      .catch(() => {});

    if (session?.user?.id) {
      fetch("/api/addresses")
        .then((r) => r.json())
        .then((data: Address[]) => {
          if (Array.isArray(data)) {
            setAddresses(data);
            const def = data.find((a) => a.isDefault) || data[0];
            if (def) setSelectedAddressId(def.id);
          }
        })
        .catch(() => {});
    }
  }, [session]);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (session === null) {
      router.push("/signin?callbackUrl=/checkout");
    }
  }, [session, router]);

  // Redirect if cart empty
  useEffect(() => {
    if (cartItems.length === 0 && session) {
      router.push("/shop");
    }
  }, [cartItems, session, router]);

  const FREE_SHIPPING_THRESHOLD = 999
  const isPaidCOD = paymentMethod === "cod" && codCharge > 0;
  const shipping = isPaidCOD ? codCharge : (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49);
  const codFee = paymentMethod === "cod" ? codCharge : 0;
  const orderTotal = total + shipping;
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const handleAddAddress = useCallback(async () => {
    if (!addrLine1 || !addrCity || !addrState || !addrPincode || !addrPhone) {
      setError("Please fill in all required address fields");
      return;
    }
    setAddrSaving(true);
    setError("");
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          line1: addrLine1,
          line2: addrLine2 || undefined,
          city: addrCity,
          state: addrState,
          pincode: addrPincode,
          phone: addrPhone,
          isDefault: addresses.length === 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save address");
        return;
      }
      if (data.id) {
        setAddresses((prev) => [...prev, data]);
        setSelectedAddressId(data.id);
        setShowAddressForm(false);
        setAddrLine1("");
        setAddrLine2("");
        setAddrCity("");
        setAddrState("");
        setAddrPincode("");
        setAddrPhone("");
      }
    } catch {
      setError("Failed to save address");
    } finally {
      setAddrSaving(false);
    }
  }, [addrLine1, addrLine2, addrCity, addrState, addrPincode, addrPhone, addresses.length]);

  const handlePlaceOrder = useCallback(async () => {
    if (!selectedAddressId) {
      setError("Please select a delivery address");
      return;
    }
    if (paymentMethod === "razorpay" && !razorpayLoaded) {
      setError("Payment system loading, please wait...");
      return;
    }
    setPlacing(true);
    setError("");

    try {
      // Create order
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddressId,
          couponCode: couponCode || null,
          discountAmount: discount?.discountAmount || 0,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create order");
        setPlacing(false);
        return;
      }

      // COD — order confirmed immediately
      if (data.paymentMethod === "cod") {
        useCartStore.getState().clearCart();
        localStorage.removeItem("nutyum-cart");
        localStorage.removeItem("nutyum-coupon");
        useUIStore.getState().showToast("Order placed successfully!");
        setTimeout(() => router.push(`/account/orders/${data.orderId}`), 800);
        return;
      }

      // Open Razorpay checkout
      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "Nutyum",
        description: `Order ${data.orderId.slice(0, 8).toUpperCase()}`,
        image: "https://jemypvfnlazkrvrmzcaz.supabase.co/storage/v1/object/public/product-images/logo.png",
        order_id: data.razorpayOrderId,
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          contact: selectedAddress?.phone || "",
        },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          // Verify payment
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          if (verifyRes.ok) {
            useCartStore.getState().clearCart();
            localStorage.removeItem("nutyum-cart");
            localStorage.removeItem("nutyum-coupon");
            useUIStore.getState().showToast("Order placed successfully!");
            setTimeout(() => router.push(`/account/orders/${data.orderId}`), 800);
          } else {
            const verifyData = await verifyRes.json();
            setError(verifyData.error || "Payment verification failed");
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPlacing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setPlacing(false);
    }
  }, [selectedAddressId, razorpayLoaded, paymentMethod, couponCode, discount, selectedAddress, session, router]);

  if (cartItems.length === 0 || session === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#173D22]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7EE]">
      <div className="mx-auto max-w-[1200px] px-4 py-8">
        <h1 className="text-3xl font-bold text-[#173D22]" style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)" }}>
          Checkout
        </h1>
        <p className="mt-1 text-sm text-[#5C665E]">{totalItems} items in your cart</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left: Address + Payment */}
          <div>
            {/* Address Section */}
            <div className="rounded-2xl bg-[#FFFEFB] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)" }}>
                Delivery Address
              </h2>

              {addresses.length > 0 && !showAddressForm ? (
                <div className="mt-4 space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                        selectedAddressId === addr.id
                          ? "border-[#173D22] bg-[rgba(23,61,34,0.04)]"
                          : "border-[rgba(23,61,34,0.12)]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-[#173D22]"
                      />
                      <div>
                        <p className="font-medium text-[#173D22]">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}
                        </p>
                        <p className="text-sm text-[#5C665E]">
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                        <p className="text-sm text-[#5C665E]">Phone: {addr.phone}</p>
                        {addr.isDefault && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#173D22]/10 px-2.5 py-0.5 text-xs font-medium text-[#173D22]">
                            <Check size={10} /> Default
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="mt-2 flex items-center gap-2 text-sm font-medium text-[#173D22] hover:opacity-70"
                  >
                    <Plus size={16} /> Add New Address
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Address line 1 *"
                    value={addrLine1}
                    onChange={(e) => setAddrLine1(e.target.value)}
                    className="w-full rounded-xl border border-[rgba(23,61,34,0.2)] bg-[#FAF7EE] px-4 py-3 text-sm text-[#173D22] placeholder:text-[#8A9A8C] focus:border-[#173D22] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Address line 2"
                    value={addrLine2}
                    onChange={(e) => setAddrLine2(e.target.value)}
                    className="w-full rounded-xl border border-[rgba(23,61,34,0.2)] bg-[#FAF7EE] px-4 py-3 text-sm text-[#173D22] placeholder:text-[#8A9A8C] focus:border-[#173D22] focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="City *"
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="w-full rounded-xl border border-[rgba(23,61,34,0.2)] bg-[#FAF7EE] px-4 py-3 text-sm text-[#173D22] placeholder:text-[#8A9A8C] focus:border-[#173D22] focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="State *"
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      className="w-full rounded-xl border border-[rgba(23,61,34,0.2)] bg-[#FAF7EE] px-4 py-3 text-sm text-[#173D22] placeholder:text-[#8A9A8C] focus:border-[#173D22] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Pincode *"
                      value={addrPincode}
                      onChange={(e) => setAddrPincode(e.target.value)}
                      className="w-full rounded-xl border border-[rgba(23,61,34,0.2)] bg-[#FAF7EE] px-4 py-3 text-sm text-[#173D22] placeholder:text-[#8A9A8C] focus:border-[#173D22] focus:outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Phone *"
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      className="w-full rounded-xl border border-[rgba(23,61,34,0.2)] bg-[#FAF7EE] px-4 py-3 text-sm text-[#173D22] placeholder:text-[#8A9A8C] focus:border-[#173D22] focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddAddress}
                      disabled={addrSaving}
                      className="flex items-center gap-2 rounded-xl bg-[#173D22] px-6 py-3 text-sm font-medium text-white hover:bg-[#1f4d2e] disabled:opacity-50"
                    >
                      {addrSaving && <Loader2 size={14} className="animate-spin" />}
                      {addrSaving ? "Saving..." : "Save & Continue"}
                    </button>
                    {addresses.length > 0 && (
                      <button
                        onClick={() => setShowAddressForm(false)}
                        className="rounded-xl border border-[rgba(23,61,34,0.2)] px-6 py-3 text-sm text-[#5C665E] hover:bg-[#FAF7EE]"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

            {/* Payment Method */}
            {codEnabled && (
              <div className="mt-6 rounded-2xl bg-[#FFFEFB] p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)" }}>
                  Payment Method
                </h2>
                <div className="mt-4 space-y-3">
                  <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                    paymentMethod === "razorpay"
                      ? "border-[#173D22] bg-[rgba(23,61,34,0.04)]"
                      : "border-[rgba(23,61,34,0.12)]"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="accent-[#173D22]"
                    />
                    <div>
                      <p className="font-medium text-[#173D22]">Pay Online (Card / UPI / Net Banking)</p>
                      <p className="text-sm text-[#5C665E]">Secure payment via Razorpay</p>
                    </div>
                  </label>
                  <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                    paymentMethod === "cod"
                      ? "border-[#173D22] bg-[rgba(23,61,34,0.04)]"
                      : "border-[rgba(23,61,34,0.12)]"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-[#173D22]"
                    />
                    <div>
                      <p className="font-medium text-[#173D22]">Cash on Delivery</p>
                      <p className="text-sm text-[#5C665E]">Pay when you receive</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

          {/* Right: Order Summary */}
          <div>
            <div className="rounded-2xl bg-[#FFFEFB] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)" }}>
                Order Summary
              </h2>

              <div className="mt-4 space-y-3">
                {cartItems.map((item) => (
                  <div key={`${item.productId}_${item.variantId || ""}`} className="flex items-start gap-3 border-b border-[rgba(23,61,34,0.06)] pb-3 last:border-0">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#FAF7EE]">
                      <Image
                        src={item.product.images[0] || "https://jemypvfnlazkrvrmzcaz.supabase.co/storage/v1/object/public/product-images/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#173D22] truncate">{item.product.name}</p>
                      {item.variantName && (
                        <p className="text-xs text-[#5C665E]">{item.variantName}</p>
                      )}
                      <p className="text-xs text-[#5C665E]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-[#173D22] shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t border-[rgba(23,61,34,0.1)] pt-4 text-sm">
                <div className="flex justify-between text-[#5C665E]">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({couponCode})</span>
                    <span>-{formatPrice(discount.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#5C665E]">
                  <span>Shipping</span>
                  <span>
                    {isPaidCOD
                      ? formatPrice(codCharge) + " (COD)"
                      : shipping === 0
                        ? "FREE"
                        : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && subtotal < FREE_SHIPPING_THRESHOLD && !isPaidCOD && (
                  <p className="text-xs text-amber-600">
                    Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between border-t border-[rgba(23,61,34,0.1)] pt-2 text-base font-bold text-[#173D22]">
                  <span>Total</span>
                  <span>{formatPrice(orderTotal)}</span>
                </div>
              </div>

              {error && (
                <p className="mt-3 text-sm text-red-500">{error}</p>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={placing || !selectedAddressId || cartItems.length === 0}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173D22] px-6 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#1f4d2e] disabled:opacity-50"
              >
                {placing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : paymentMethod === "cod" ? (
                  `Place Order — ${formatPrice(orderTotal)}`
                ) : (
                  `Pay ${formatPrice(orderTotal)}`
                )}
              </button>

              <p className="mt-3 text-center text-xs text-[#8A9A8C]">
                {paymentMethod === "cod"
                  ? "Pay when your order is delivered. No online payment needed."
                  : "Secure payment via Razorpay. You will be redirected to complete the payment."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
