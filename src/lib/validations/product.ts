import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers and hyphens only",
    ),
  description: z.string().min(10, "Description is required"),
  shortDescription: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  salePrice: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0),
  brand: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  isFeatured: z.boolean().default(false),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers and hyphens only",
    ),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;