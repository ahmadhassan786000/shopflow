import { z } from "zod";

export const sliderSchema = z.object({
  title: z
    .string()
    .min(2, "Title is required")
    .max(150, "Title must be 150 characters or less"),

  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional(),

  buttonText: z
    .string()
    .max(50, "Button text must be 50 characters or less")
    .optional(),

  buttonUrl: z
    .string()
    .max(500, "Button URL is too long")
    .optional(),

  isActive: z.boolean().default(true),

  sortOrder: z.coerce
    .number()
    .int()
    .min(0, "Sort order cannot be negative")
    .default(0),
});

export type SliderInput = z.infer<typeof sliderSchema>;