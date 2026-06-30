"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { useCartStore } from "@/hooks/use-cart-store";
interface CartItemProps {
  item: {
    productId: string;
    quantity: number;
    product: {
      images: string[];
      name: string;
      price: number;
    };
  };
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex items-center gap-3 py-3 border-b border-border last:border-b-0"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image
          src={item.product.images[0] || "/placeholder.svg"}
          alt={item.product.name}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary truncate">
          {item.product.name}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">
          {formatPrice(item.product.price)}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <span className="w-7 text-center text-sm font-medium text-primary tabular-nums">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => removeItem(item.productId)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
        aria-label={`Remove ${item.product.name} from cart`}
      >
        <Trash2 size={15} />
      </button>
    </motion.div>
  );
}
