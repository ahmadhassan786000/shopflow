"use server";

import { requireRole } from "@/lib/authorize";
import { couponSchema } from "@/lib/validations/commerce";
import { createCoupon, updateCoupon, deleteCoupon } from "@/services/couponService";
import { revalidatePath } from "next/cache";

export async function createCouponAction(formData: FormData) {
  await requireRole("ADMIN", "SUPER_ADMIN", "STAFF");
  const raw = Object.fromEntries(formData.entries());
  const parsed = couponSchema.safeParse({ ...raw, isActive: formData.get("isActive") === "on" });
  if (!parsed.success) return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid coupon." };

  await createCoupon(parsed.data);
  revalidatePath("/admin/coupons");
  return { success: true, message: "Coupon created." };
}

export async function updateCouponAction(id: string, formData: FormData) {
  await requireRole("ADMIN", "SUPER_ADMIN", "STAFF");
  const raw = Object.fromEntries(formData.entries());
  const parsed = couponSchema.safeParse({ ...raw, isActive: formData.get("isActive") === "on" });
  if (!parsed.success) return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid coupon." };

  await updateCoupon(id, parsed.data);
  revalidatePath("/admin/coupons");
  return { success: true, message: "Coupon updated." };
}

export async function deleteCouponAction(id: string) {
  await requireRole("ADMIN", "SUPER_ADMIN");
  await deleteCoupon(id);
  revalidatePath("/admin/coupons");
}
