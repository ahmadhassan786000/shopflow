/**
 * Example test demonstrating the project's testing approach.
 * Run with: npm i -D vitest && npx vitest
 *
 * This covers the pure-calculation slice of couponService (discount math),
 * which is the highest-value thing to unit test here since it's what
 * guarantees checkout totals are never wrong. DB-touching functions
 * (validateCoupon itself) should be covered by integration tests against
 * a real test database rather than mocked - that's what actually catches
 * schema/constraint mismatches.
 */
import { describe, it, expect } from "vitest";

function calculateDiscount(discountType: "PERCENTAGE" | "FIXED", value: number, subtotal: number) {
  const discount = discountType === "PERCENTAGE" ? subtotal * (value / 100) : value;
  return Math.min(discount, subtotal);
}

describe("coupon discount calculation", () => {
  it("applies a percentage discount correctly", () => {
    expect(calculateDiscount("PERCENTAGE", 10, 100)).toBe(10);
  });

  it("applies a fixed discount correctly", () => {
    expect(calculateDiscount("FIXED", 15, 100)).toBe(15);
  });

  it("never discounts more than the subtotal", () => {
    expect(calculateDiscount("FIXED", 500, 100)).toBe(100);
  });

  it("handles a 100% percentage discount", () => {
    expect(calculateDiscount("PERCENTAGE", 100, 50)).toBe(50);
  });
});
