import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateCartTotals } from "@/services/cartService";
import { CheckoutForm } from "./CheckoutForm";

export const metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [addresses, { subtotal, items }] =
    await Promise.all([
      prisma.address.findMany({
        where: {
          userId: session.user.id,
          type: "SHIPPING",
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      calculateCartTotals(session.user.id),
    ]);

  if (items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="shop-checkout-page">

      <div className="shop-checkout-heading">
        <div>
          <span>SHOPFLOW CHECKOUT</span>

          <h1>Complete your order</h1>

          <p>
            Review your delivery details and place your
            order with Cash on Delivery.
          </p>
        </div>
      </div>

      <CheckoutForm
        addresses={addresses}
        subtotal={subtotal}
      />

    </div>
  );
}
