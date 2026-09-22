"use server";

import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";

export async function resetPasswordAction(formData: FormData) {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const { token, password } = parsed.data;

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date()) {
    return { success: false, message: "This reset link is invalid or has expired." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({ where: { email: record.email }, data: { passwordHash } }),
    prisma.passwordResetToken.delete({ where: { token } }), // single-use token
  ]);

  return { success: true, message: "Password updated. You can now log in." };
}
