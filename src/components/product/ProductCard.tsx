import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  avgRating?: number;
  reviewCount?: number;
  images?: {
    id: string;
    url: string;
    position: number;
  }[];
}

export function ProductPrice({
  price,
  salePrice,
}: {
  price: number;
  salePrice?: number | null;
}) {
  const hasSale =
    salePrice !== null &&
    salePrice !== undefined &&
    salePrice < price;

  const discount = hasSale
    ? Math.round(
        ((price - salePrice!) / price) * 100,
      )
    : 0;

  return (
    <div className="shop-product-price-area">
      <div className="shop-product-price-row">
        <span className="shop-product-price">
          Rs{" "}
          {(
            hasSale ? salePrice : price
          )?.toLocaleString()}
        </span>

        {hasSale && (
          <span className="shop-product-old-price">
            Rs {price.toLocaleString()}
          </span>
        )}
      </div>

      {hasSale && (
        <span className="shop-product-discount">
          {discount}% OFF
        </span>
      )}
    </div>
  );
}

export function ProductCard({
  product,
}: {
  product: ProductCardData;
}) {
  const image = product.images?.[0]?.url;

  const isOutOfStock = product.stock <= 0;

  const hasSale =
    product.salePrice !== null &&
    product.salePrice !== undefined &&
    product.salePrice < product.price;

  return (
    <article className="shop-product-card">

      {/* IMAGE */}
      <Link
        href={`/products/${product.slug}`}
        className="shop-product-image-link"
      >
        <div className="shop-product-image-wrapper">

          {image ? (
            <img
              src={image}
              alt={product.name}
              className="shop-product-image"
            />
          ) : (
            <div className="shop-product-no-image">
              <span>No Image</span>
            </div>
          )}

          {/* SALE */}
          {hasSale && !isOutOfStock && (
            <span className="shop-product-sale-badge">
              SALE
            </span>
          )}

          {/* STOCK */}
          {isOutOfStock && (
            <span className="shop-product-stock-badge">
              Out of Stock
            </span>
          )}

          {/* QUICK VIEW */}
          <span className="shop-product-view">
            <Eye size={15} />
          </span>
        </div>
      </Link>

      {/* CONTENT */}
      <div className="shop-product-content">

        <Link
          href={`/products/${product.slug}`}
          className="shop-product-name"
          title={product.name}
        >
          {product.name}
        </Link>

        <ProductPrice
          price={product.price}
          salePrice={product.salePrice}
        />

        <div className="shop-product-bottom">

          <span
            className={
              isOutOfStock
                ? "shop-stock-text out"
                : "shop-stock-text"
            }
          >
            {isOutOfStock
              ? "Currently unavailable"
              : "In Stock"}
          </span>

          <Link
            href={`/products/${product.slug}`}
            className="shop-view-button"
            aria-label={`View ${product.name}`}
          >
            <ShoppingCart size={15} />
            <span>View</span>
          </Link>

        </div>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
}: {
  products: ProductCardData[];
}) {
  return (
    <div className="shop-product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}


