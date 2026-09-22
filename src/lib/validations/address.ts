import { z } from "zod";

export const addressSchema = z.object({
  type: z.enum(["SHIPPING", "BILLING"]),
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(6, "Enter a valid phone number"),
  line1: z.string().min(3, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(2, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  isDefault: z.boolean().optional().default(false),
});

export const checkoutSchema = z.object({
  shippingAddressId: z.string().min(1, "Select a shipping address"),
  billingAddressId: z.string().min(1, "Select a billing address"),
  shippingMethod: z.enum(["STANDARD", "EXPRESS"]),
  couponCode: z.string().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
