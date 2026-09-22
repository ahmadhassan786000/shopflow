"use server";

import { requireRole } from "@/lib/authorize";
import { moderateReview, deleteReview } from "@/services/reviewService";
import { revalidatePath } from "next/cache";

export async function moderateReviewAction(reviewId: string, status: "APPROVED" | "REJECTED") {
  await requireRole("ADMIN", "SUPER_ADMIN", "STAFF");
  await moderateReview(reviewId, status);
  revalidatePath("/admin/reviews");
}

export async function deleteReviewAction(reviewId: string) {
  await requireRole("ADMIN", "SUPER_ADMIN", "STAFF");
  await deleteReview(reviewId);
  revalidatePath("/admin/reviews");
}
