import { auth } from "@/lib/auth";
import { calculateCartTotals } from "@/services/cartService";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummaryWrapper } from "./CartSummaryWrapper";
import { EmptyState } from "@/components/ui/Pagination";
import { Container } from "react-bootstrap";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "Your Cart",
};

export default async function CartPage() {
  const session = await auth();
  const { subtotal, items } = await calculateCartTotals(session!.user.id);

  if (items.length === 0) {
    return (
      <Container className="shop-cart-page">
        <EmptyState
          title="Your cart is empty"
          description="Browse our products and add something you love."
        />
      </Container>
    );
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="shop-cart-page">
      <Container>
        <div className="shop-cart-header">
          <div>
            <div className="shop-cart-breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Cart</span>
            </div>

            <div className="shop-cart-title-row">
              <div className="shop-cart-title-icon">
                <ShoppingBag size={25} />
              </div>

              <div>
                <h1>Your Cart</h1>
                <p>
                  {totalItems} {totalItems === 1 ? "item" : "items"} in your
                  shopping cart
                </p>
              </div>
            </div>
          </div>

          <div className="shop-cart-secure-badge">
            <ShieldCheck size={18} />
            <span>Secure Shopping</span>
          </div>
        </div>

        <div className="shop-cart-layout">
          <section className="shop-cart-items-section">
            <div className="shop-cart-section-header">
              <div>
                <h2>Shopping Cart</h2>
                <p>Review your items before checkout</p>
              </div>

              <span className="shop-cart-count">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </span>
            </div>

            <div className="shop-cart-items">
              {items.map((item) => (
                <CartItemRow
                  key={item.cartItemId}
                  item={{
                    id: item.cartItemId,
                    productName: item.name,
                    imageUrl: item.imageUrl ?? undefined,
                    unitPrice: item.unitPrice,
                    quantity: item.quantity,
                    variantLabel: item.variantLabel ?? undefined,
                  }}
                />
              ))}
            </div>

            <Link href="/products" className="shop-continue-shopping">
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </section>

          <aside className="shop-cart-summary-section">
            <CartSummaryWrapper subtotal={subtotal} />
          </aside>
        </div>
      </Container>
    </main>
  );
}
