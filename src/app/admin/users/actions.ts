"use server";

import { requireRole } from "@/lib/authorize";
import { setUserRole, setUserDisabled } from "@/services/userService";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function setUserRoleAction(userId: string, role: string) {
  // Only SUPER_ADMIN can grant admin-level roles - a plain ADMIN cannot escalate others (or themselves) further.
  await requireRole("SUPER_ADMIN");
  if (!Object.values(Role).includes(role as Role)) return { success: false, message: "Invalid role." };

  await setUserRole(userId, role as Role);
  revalidatePath("/admin/users");
  return { success: true, message: "Role updated." };
}

export async function setUserDisabledAction(userId: string, isDisabled: boolean) {
  await requireRole("ADMIN", "SUPER_ADMIN");
  await setUserDisabled(userId, isDisabled);
  revalidatePath("/admin/users");
  return { success: true, message: isDisabled ? "Account disabled." : "Account enabled." };
}
