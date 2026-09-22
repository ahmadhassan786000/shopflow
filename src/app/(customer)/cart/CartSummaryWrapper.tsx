"use client";

import { CartSummary } from "@/components/cart/CartSummary";
import { previewCouponAction } from "./actions";

export function CartSummaryWrapper({ subtotal }: { subtotal: number }) {
  return (
    <CartSummary
      subtotal={subtotal}
      onApplyCoupon={(code) => previewCouponAction(code, subtotal)}
    />
  );
}
