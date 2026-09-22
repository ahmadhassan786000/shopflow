"use client";

import { useState, useTransition } from "react";
import { Button, Form } from "react-bootstrap";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { addToCartAction, toggleWishlistAction } from "./actions";

interface Variant {
  id: string;
  name: string;
  value: string;
  stock: number;
}

export function ProductPurchasePanel({ productId, stock, variants }: { productId: string; stock: number; variants: Variant[] }) {
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const effectiveStock = variants.length > 0 ? variants.find((v) => v.id === selectedVariant)?.stock ?? 0 : stock;
  const outOfStock = effectiveStock <= 0;

  function handleAddToCart() {
    startTransition(async () => {
      try {
        await addToCartAction(productId, quantity, selectedVariant);
        toast.success("Added to cart");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not add to cart.");
      }
    });
  }

  function handleWishlist() {
    startTransition(async () => {
      try {
        const result = await toggleWishlistAction(productId);
        toast.success(result.added ? "Added to wishlist" : "Removed from wishlist");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Please log in first.");
      }
    });
  }

  const variantGroups = variants.reduce<Record<string, Variant[]>>((acc, v) => {
    (acc[v.name] ??= []).push(v);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(variantGroups).map(([name, options]) => (
        <div className="mb-3" key={name}>
          <Form.Label className="small fw-medium">{name}</Form.Label>
          <div className="d-flex gap-2 flex-wrap">
            {options.map((opt) => (
              <Button
                key={opt.id}
                size="sm"
                variant={selectedVariant === opt.id ? "primary" : "outline-secondary"}
                onClick={() => setSelectedVariant(opt.id)}
                disabled={opt.stock <= 0}
              >
                {opt.value}
              </Button>
            ))}
          </div>
        </div>
      ))}

      <div className="d-flex align-items-center gap-2 mb-3">
        <Form.Label className="small fw-medium mb-0">Qty</Form.Label>
        <Form.Select style={{ width: 80 }} size="sm" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
          {Array.from({ length: Math.min(effectiveStock, 10) || 1 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </Form.Select>
        <span className="small text-muted">{outOfStock ? "Out of stock" : `${effectiveStock} in stock`}</span>
      </div>

      <div className="d-flex gap-2">
        <Button variant="primary" size="lg" className="flex-grow-1" disabled={outOfStock || isPending} onClick={handleAddToCart}>
          Add to Cart
        </Button>
        <Button variant="outline-secondary" size="lg" onClick={handleWishlist} disabled={isPending} aria-label="Add to wishlist">
          <Heart size={20} />
        </Button>
      </div>
    </div>
  );
}
