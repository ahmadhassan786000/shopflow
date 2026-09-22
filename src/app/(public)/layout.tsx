import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StorefrontNavbar } from "@/components/layout/StorefrontNavbar";
import { Footer } from "@/components/layout/Footer";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  let cartCount = 0;
  let wishlistCount = 0;

  if (session?.user) {
    const [cart, wishlist] = await Promise.all([
      prisma.cart.findUnique({ where: { userId: session.user.id }, include: { _count: { select: { items: true } } } }),
      prisma.wishlist.findUnique({ where: { userId: session.user.id }, include: { _count: { select: { items: true } } } }),
    ]);
    cartCount = cart?._count.items ?? 0;
    wishlistCount = wishlist?._count.items ?? 0;
  }

  return (
    <>
      <StorefrontNavbar cartCount={cartCount} wishlistCount={wishlistCount} isLoggedIn={!!session?.user} />
      <main className="min-vh-100">{children}</main>
      <Footer />
    </>
  );
}
