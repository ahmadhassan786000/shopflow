import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function getAllUsersForAdmin(page = 1, pageSize = 20) {
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, isDisabled: true, createdAt: true, image: true },
    }),
    prisma.user.count(),
  ]);
  return { items, total, totalPages: Math.ceil(total / pageSize), page };
}

export async function getUserDetailForAdmin(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: { orderBy: { createdAt: "desc" }, take: 10 },
      addresses: true,
    },
  });
}

export async function setUserRole(userId: string, role: Role) {
  return prisma.user.update({ where: { id: userId }, data: { role } });
}

export async function setUserDisabled(userId: string, isDisabled: boolean) {
  return prisma.user.update({ where: { id: userId }, data: { isDisabled } });
}
