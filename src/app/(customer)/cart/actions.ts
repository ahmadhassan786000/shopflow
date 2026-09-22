"use server";

import { requireUser } from "@/lib/authorize";
import { updateCartItemQuantity, removeCartItem } from "@/services/cartService";
import { validateCoupon } from "@/services/couponService";
import { revalidatePath } from "next/cache";

export async function updateCartItemAction(cartItemId: string, quantity: number) {
  const user = await requireUser();
  await updateCartItemQuantity(user.id, cartItemId, quantity);
  revalidatePath("/cart");
}

export async function removeCartItemAction(cartItemId: string) {
  const user = await requireUser();
  await removeCartItem(user.id, cartItemId);
  revalidatePath("/cart");
}

export async function previewCouponAction(code: string, subtotal: number) {
  try {
    const { discount } = await validateCoupon(code, subtotal);
    return { success: true, message: "Coupon applied.", discount };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Invalid coupon." };
  }
}
