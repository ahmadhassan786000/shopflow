"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
import { X } from "lucide-react";
import { toggleWishlistAction } from "@/app/(public)/products/[slug]/actions";

export function WishlistItemActions({ productId }: { productId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function remove() {
    startTransition(async () => {
      await toggleWishlistAction(productId);
      router.refresh();
    });
  }

  return (
    <Button size="sm" variant="outline-danger" className="w-100 mt-2 d-flex align-items-center justify-content-center gap-1" onClick={remove} disabled={isPending}>
      <X size={14} /> Remove
    </Button>
  );
}
