import { z } from "zod";

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .regex(/^[A-Z0-9_-]+$/, "Use uppercase letters, numbers, - and _ only"),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().positive("Value must be greater than 0"),
  minOrderAmount: z.coerce.number().min(0).optional().nullable(),
  usageLimit: z.coerce.number().int().positive().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1, "Rating is required").max(5),
  title: z.string().max(120).optional(),
  comment: z.string().max(2000).optional(),
});

export type CouponInput = z.infer<typeof couponSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
