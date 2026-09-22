"use server";

import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { rateLimit, RATE_LIMITS } from "@/lib/rateLimit";
import { headers } from "next/headers";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function forgotPasswordAction(formData: FormData) {
  const headersList = await headers();

  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const { success } = rateLimit(
    `forgot:${ip}`,
    RATE_LIMITS.FORGOT_PASSWORD.limit,
    RATE_LIMITS.FORGOT_PASSWORD.windowMs,
  );

  const GENERIC_MESSAGE =
    "If an account exists for that email, a reset link has been sent.";

  if (!success) {
    return {
      success: true,
      message: GENERIC_MESSAGE,
    };
  }

  const parsed = forgotPasswordSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) {
    return {
      success: true,
      message: GENERIC_MESSAGE,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: parsed.data.email,
    },
  });

  // Always return the same message whether or not
  // the user exists. This prevents email enumeration.
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");

    await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        token,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const resetUrl =
      `${siteUrl}/reset-password?token=${encodeURIComponent(token)}`;

    await sendPasswordResetEmail(user.email, resetUrl);
  }

  return {
    success: true,
    message: GENERIC_MESSAGE,
  };
}