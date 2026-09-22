"use server";

import { signIn } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";
import { rateLimit, RATE_LIMITS } from "@/lib/rateLimit";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { AuthError } from "next-auth";

export async function loginAction(formData: FormData) {
  const headersList = await headers();

  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const email = String(formData.get("email") ?? "");

  const { success } = rateLimit(
    `login:${ip}:${email}`,
    RATE_LIMITS.LOGIN.limit,
    RATE_LIMITS.LOGIN.windowMs,
  );

  if (!success) {
    return {
      success: false,
      message:
        "Too many login attempts. Please try again in a few minutes.",
    };
  }

  const parsed = loginSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) {
    return {
      success: false,
      message: "Enter a valid email and password.",
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: parsed.data.email,
      },
      select: {
        role: true,
      },
    });

    const redirectTo =
      user?.role === "ADMIN" ||
      user?.role === "SUPER_ADMIN" ||
      user?.role === "STAFF"
        ? "/admin"
        : "/";

    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    throw error;
  }

  return {
    success: true,
    message: "Logged in.",
  };
}