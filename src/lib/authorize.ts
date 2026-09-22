import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";

export class UnauthorizedError extends Error {
  constructor(message = "You must be logged in to do this.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "You do not have permission to do this.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Call this at the top of every server action / route handler that touches
 * sensitive data. Middleware only gates page loads — this is the real check.
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  return session.user;
}

export async function requireRole(...allowed: Role[]) {
  const user = await requireUser();
  if (!allowed.includes(user.role)) throw new ForbiddenError();
  return user;
}

/** Ensures the resource's owner ID matches the current session user (or the user is an admin). */
export async function requireOwnerOrAdmin(resourceUserId: string) {
  const user = await requireUser();
  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
  if (!isAdmin && user.id !== resourceUserId) throw new ForbiddenError();
  return user;
}
