import { prisma } from "@/lib/prisma";

export async function submitReview(userId: string, productId: string, rating: number, title?: string, comment?: string) {
  // One review per user per product - enforced at DB level too via @@unique
  return prisma.review.upsert({
    where: { productId_userId: { productId, userId } },
    update: { rating, title, comment, status: "PENDING" },
    create: { productId, userId, rating, title, comment, status: "PENDING" },
  });
}

export async function getReviewsForAdmin(status?: "PENDING" | "APPROVED" | "REJECTED") {
  return prisma.review.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } }, product: { select: { name: true, slug: true } } },
  });
}

export async function moderateReview(reviewId: string, status: "APPROVED" | "REJECTED") {
  return prisma.review.update({ where: { id: reviewId }, data: { status } });
}

export async function deleteReview(reviewId: string) {
  return prisma.review.delete({ where: { id: reviewId } });
}
