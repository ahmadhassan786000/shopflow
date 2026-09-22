"use server";

import { requireUser } from "@/lib/authorize";
import { addToCart } from "@/services/cartService";
import { toggleWishlistItem } from "@/services/wishlistService";
import { submitReview } from "@/services/reviewService";
import { reviewSchema } from "@/lib/validations/commerce";
import { rateLimit, RATE_LIMITS } from "@/lib/rateLimit";
import { revalidatePath } from "next/cache";

export async function addToCartAction(productId: string, quantity: number, variantId?: string) {
  const user = await requireUser();
  await addToCart(user.id, productId, quantity, variantId);
  revalidatePath("/cart");
}

export async function toggleWishlistAction(productId: string) {
  const user = await requireUser();
  const result = await toggleWishlistItem(user.id, productId);
  revalidatePath("/wishlist");
  return result;
}

export async function submitReviewAction(formData: FormData) {
  const user = await requireUser();
  const { success } = rateLimit(`review:${user.id}`, RATE_LIMITS.REVIEW_SUBMIT.limit, RATE_LIMITS.REVIEW_SUBMIT.windowMs);
  if (!success) return { success: false, message: "You're submitting reviews too quickly." };

  const parsed = reviewSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid review." };

  await submitReview(user.id, parsed.data.productId, parsed.data.rating, parsed.data.title, parsed.data.comment);
  return { success: true, message: "Thanks! Your review is pending approval." };
}
