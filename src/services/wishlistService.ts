import { prisma } from "@/lib/prisma";

async function getOrCreateWishlist(userId: string) {
  const existing = await prisma.wishlist.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.wishlist.create({ data: { userId } });
}

export async function getWishlist(userId: string) {
  const wishlist = await getOrCreateWishlist(userId);
  return prisma.wishlist.findUnique({
    where: { id: wishlist.id },
    include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
  });
}

export async function toggleWishlistItem(userId: string, productId: string) {
  const wishlist = await getOrCreateWishlist(userId);
  const existing = await prisma.wishlistItem.findUnique({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return { added: false };
  }

  await prisma.wishlistItem.create({ data: { wishlistId: wishlist.id, productId } });
  return { added: true };
}
