import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export async function validateCoupon(code: string, subtotal: number) {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.isActive) throw new Error("Coupon is invalid or no longer active.");
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new Error("Coupon has expired.");
  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit has been reached.");
  }
  if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
    throw new Error(
      `Order must be at least ${formatCurrency(coupon.minOrderAmount.toString())} to use this coupon.`,
    );
  }

  const discount =
    coupon.discountType === "PERCENTAGE" ? subtotal * (Number(coupon.value) / 100) : Number(coupon.value);

  return { coupon, discount: Math.min(discount, subtotal) };
}

export async function incrementCouponUsage(couponId: string) {
  return prisma.coupon.update({ where: { id: couponId }, data: { usageCount: { increment: 1 } } });
}

export async function getAllCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createCoupon(data: Prisma.CouponUncheckedCreateInput) {
  return prisma.coupon.create({ data: { ...data, code: data.code.toUpperCase() } });
}

export async function updateCoupon(id: string, data: Prisma.CouponUncheckedUpdateInput) {
  return prisma.coupon.update({ where: { id }, data });
}

export async function deleteCoupon(id: string) {
  return prisma.coupon.delete({ where: { id } });
}
