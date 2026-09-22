import Image from "next/image";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { auth } from "@/lib/auth";
import { getWishlist } from "@/services/wishlistService";
import { EmptyState } from "@/components/ui/Pagination";
import { ProductPrice } from "@/components/product/ProductCard";
import { WishlistItemActions } from "./WishlistItemActions";

export const metadata = { title: "Your Wishlist" };

export default async function WishlistPage() {
  const session = await auth();
  const wishlist = await getWishlist(session!.user.id);
  const items = wishlist?.items ?? [];

  if (items.length === 0) {
    return <EmptyState title="Your wishlist is empty" description="Save items you love for later." />;
  }

  return (
    <>
      <h1 className="h4 fw-bold mb-4">Your Wishlist</h1>
      <div className="row row-cols-2 row-cols-md-4 g-3">
        {items.map((item) => (
          <div className="col" key={item.id}>
            <div className="border rounded overflow-hidden h-100">
              <Link href={`/products/${item.product.slug}`}>
                <div className="position-relative" style={{ aspectRatio: "1/1", background: "#f5f5f5" }}>
                  {item.product.images[0] && (
                    <Image src={item.product.images[0].url} alt={item.product.name} fill style={{ objectFit: "cover" }} />
                  )}
                </div>
              </Link>
              <div className="p-2">
                <Link href={`/products/${item.product.slug}`} className="text-dark text-decoration-none">
                  <p className="small text-truncate mb-1">{item.product.name}</p>
                </Link>
                <ProductPrice
                  price={Number(item.product.price)}
                  salePrice={
                    item.product.salePrice === null
                      ? null
                      : Number(item.product.salePrice)
                  }
                />
                <WishlistItemActions productId={item.productId} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
