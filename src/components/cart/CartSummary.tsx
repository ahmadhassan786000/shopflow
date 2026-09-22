"use client";

import { useState, useTransition } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { ArrowRight, CheckCircle2, LockKeyhole, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CartSummaryProps {
  subtotal: number;
  shippingEstimate?: number;
  onApplyCoupon?: (
    code: string
  ) => Promise<{
    success: boolean;
    message: string;
    discount?: number;
  }>;
  checkoutHref?: string;
  checkoutDisabled?: boolean;
}

export function CartSummary({
  subtotal,
  shippingEstimate = 0,
  onApplyCoupon,
  checkoutHref = "/checkout",
  checkoutDisabled,
}: CartSummaryProps) {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  const total = Math.max(0, subtotal - discount + shippingEstimate);

  function applyCoupon() {
    if (!onApplyCoupon || !code.trim()) return;

    startTransition(async () => {
      const result = await onApplyCoupon(code.trim());

      setMessage({
        type: result.success ? "success" : "danger",
        text: result.message,
      });

      setDiscount(result.success ? result.discount ?? 0 : 0);
    });
  }

  return (
    <div className="shop-cart-summary-wrapper">
      <Card className="shop-cart-summary border-0">
        <Card.Body>
          <div className="shop-summary-heading">
            <div>
              <span className="shop-summary-eyebrow">CHECKOUT</span>
              <Card.Title className="shop-summary-title">
                Order Summary
              </Card.Title>
            </div>

            <div className="shop-summary-lock">
              <LockKeyhole size={18} />
            </div>
          </div>

          {onApplyCoupon && (
            <div className="shop-coupon-box">
              <div className="shop-coupon-label">
                <Tag size={16} />
                <span>Have a coupon?</span>
              </div>

              <div className="shop-coupon-input">
                <Form.Control
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  disabled={isPending}
                />

                <Button
                  type="button"
                  onClick={applyCoupon}
                  disabled={isPending || !code.trim()}
                >
                  Apply
                </Button>
              </div>

              {message && (
                <Alert
                  variant={message.type}
                  className="shop-coupon-message mb-0"
                >
                  {message.text}
                </Alert>
              )}
            </div>
          )}

          <div className="shop-summary-lines">
            <div className="shop-summary-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>

            {discount > 0 && (
              <div className="shop-summary-row shop-summary-discount">
                <span>Discount</span>
                <strong>-{formatCurrency(discount)}</strong>
              </div>
            )}

            <div className="shop-summary-row">
              <span>Shipping</span>
              <strong className={shippingEstimate === 0 ? "shop-shipping-text" : ""}>
                {shippingEstimate > 0
                  ? formatCurrency(shippingEstimate)
                  : "Calculated at checkout"}
              </strong>
            </div>
          </div>

          <div className="shop-summary-total">
            <div>
              <span>Total</span>
              <small>Including applicable taxes</small>
            </div>

            <strong>{formatCurrency(total)}</strong>
          </div>

          <Button
            href={checkoutHref}
            className="shop-checkout-button"
            disabled={checkoutDisabled}
          >
            Proceed to Checkout
            <ArrowRight size={19} />
          </Button>

          <div className="shop-secure-checkout">
            <CheckCircle2 size={17} />
            <span>Secure checkout & protected payment</span>
          </div>
        </Card.Body>
      </Card>

      
    </div>
  );
}
