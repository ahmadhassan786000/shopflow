"use server";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { rateLimit, RATE_LIMITS } from "@/lib/rateLimit";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";

export interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export async function registerAction(formData: FormData): Promise<ActionResult> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const { success } = rateLimit(`register:${ip}`, RATE_LIMITS.REGISTER.limit, RATE_LIMITS.REGISTER.windowMs);
  if (!success) return { success: false, message: "Too many attempts. Please try again later." };

  const raw = Object.fromEntries(formData.entries());
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Generic message - don't confirm/deny account existence beyond what's necessary here,
    // though for registration UX we do need to say the email is taken.
    return { success: false, message: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, email, passwordHash, role: "CUSTOMER" },
  });

  // TODO: send verification email via your email provider, linking to /verify-email?token=...

  return { success: true, message: "Account created. You can now log in." };
}
