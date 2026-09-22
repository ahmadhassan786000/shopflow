"use client";

import Image from "next/image";
import { useTransition } from "react";
import { Button } from "react-bootstrap";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { formatCurrency } from "@/lib/utils";
import { updateCartItemAction, removeCartItemAction } from "@/app/(customer)/cart/actions";

export interface CartLineItem {
  id: string;
  productName: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  variantLabel?: string;
}

export function CartItemRow({ item }: { item: CartLineItem }) {
  const [isPending, startTransition] = useTransition();

  function changeQuantity(next: number) {
    if (next < 1) {
      remove();
      return;
    }

    startTransition(async () => {
      try {
        await updateCartItemAction(item.id, next);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not update cart.");
      }
    });
  }

  function remove() {
    startTransition(async () => {
      try {
        await removeCartItemAction(item.id);
        toast.success("Removed from cart");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not remove item.");
      }
    });
  }

  const lineTotal = item.unitPrice * item.quantity;

  return (
    <div className={`shop-cart-item ${isPending ? "shop-cart-item-pending" : ""}`}>
      <div className="shop-cart-product">
        <div className="shop-cart-image">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.productName}
              fill
              sizes="120px"
              className="shop-cart-product-image"
            />
          ) : (
            <div className="shop-cart-image-placeholder">
              <ShoppingBag size={30} />
            </div>
          )}
        </div>

        <div className="shop-cart-product-info">
          <h2 className="shop-cart-product-name">{item.productName}</h2>

          {item.variantLabel && (
            <p className="shop-cart-variant">{item.variantLabel}</p>
          )}

          <p className="shop-cart-unit-price">
            {formatCurrency(item.unitPrice)} <span>each</span>
          </p>
        </div>
      </div>

      <div className="shop-cart-actions">
        <div className="shop-quantity-control">
          <button
            type="button"
            onClick={() => changeQuantity(item.quantity - 1)}
            disabled={isPending}
            aria-label="Decrease quantity"
          >
            <Minus size={15} />
          </button>

          <span>{item.quantity}</span>

          <button
            type="button"
            onClick={() => changeQuantity(item.quantity + 1)}
            disabled={isPending}
            aria-label="Increase quantity"
          >
            <Plus size={15} />
          </button>
        </div>

        <div className="shop-cart-line-total">
          {formatCurrency(lineTotal)}
        </div>

        <Button
          variant="link"
          className="shop-cart-remove"
          onClick={remove}
          disabled={isPending}
          aria-label={`Remove ${item.productName}`}
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
}
