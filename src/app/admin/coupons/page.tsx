import { getAllCoupons } from "@/services/couponService";
import { CouponManager } from "./CouponManager";

export const metadata = { title: "Manage Coupons" };

export default async function AdminCouponsPage() {
  const coupons = await getAllCoupons();
  return (
    <>
      <h1 className="h4 fw-bold mb-4">Coupons</h1>
      <CouponManager
        coupons={coupons.map((c) => ({
          id: c.id,
          code: c.code,
          discountType: c.discountType,
          value: Number(c.value),
          usageCount: c.usageCount,
          usageLimit: c.usageLimit,
          expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
          isActive: c.isActive,
        }))}
      />
    </>
  );
}
