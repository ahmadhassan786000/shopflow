import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container, Row, Col, Badge } from "react-bootstrap";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  PackageCheck,
  Heart,
  CheckCircle2,
} from "lucide-react";

import {
  getProductBySlug,
  getProducts,
} from "@/services/productService";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductPrice, ProductGrid } from "@/components/product/ProductCard";
import { ProductPurchasePanel } from "./ProductPurchasePanel";
import { ProductImageGallery } from "./ProductImageGallery";
import { ReviewForm } from "./ReviewForm";
import { auth } from "@/lib/auth";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product not found | ShopFlow",
    };
  }

  const imageUrl = product.images[0]?.url;

  return {
    title: `${product.name} | ShopFlow`,
    description:
      product.shortDescription ??
      product.description.slice(0, 155),

    alternates: {
      canonical: `/products/${product.slug}`,
    },

    openGraph: {
      title: product.name,
      description:
        product.shortDescription ?? undefined,
      images: imageUrl
        ? [{ url: imageUrl }]
        : undefined,
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: product.name,
      images: imageUrl
        ? [imageUrl]
        : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: PageProps) {
  const [product, session] = await Promise.all([
    getProductBySlug(params.slug),
    auth(),
  ]);

  if (!product) {
    notFound();
  }

  const similarResult = await getProducts({
    categorySlug: product.category.slug,
    page: 1,
    pageSize: 8,
    sort: "newest",
  });

  const similarProducts = similarResult.items
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  const currentPrice =
    product.salePrice ?? product.price;

  const hasSale =
    product.salePrice !== null &&
    product.salePrice !== undefined &&
    product.salePrice < product.price;

  const discount = hasSale
    ? Math.round(
        ((product.price - product.salePrice!) /
          product.price) *
          100,
      )
    : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.shortDescription ??
      product.description,
    sku: product.sku,
    image: product.images.map(
      (image) => image.url,
    ),

    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand,
        }
      : undefined,

    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: currentPrice,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main className="shop-product-detail-page">
      <Container className="py-3 py-lg-4">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        <div className="shop-detail-breadcrumb">
          <Breadcrumbs
            items={[
              {
                label: product.category.name,
                href: `/categories/${product.category.slug}`,
              },
              {
                label: product.name,
              },
            ]}
          />
        </div>

        <section className="shop-detail-main-card">
          <Row className="g-0">
            <Col lg={6}>
              <ProductImageGallery
                images={product.images}
                productName={product.name}
                hasSale={hasSale}
                discount={discount}
              />
            </Col>

            <Col lg={6}>
              <div className="shop-product-info">
                {product.brand && (
                  <div className="shop-product-brand">
                    {product.brand}
                  </div>
                )}

                <h1 className="shop-detail-title">
                  {product.name}
                </h1>

                <div className="shop-detail-meta">
                  <span>
                    SKU: {product.sku}
                  </span>

                  <span className="shop-meta-divider">
                    |
                  </span>

                  <span>
                    {product.category.name}
                  </span>
                </div>

                <div className="shop-detail-price-box">
                  <div className="shop-detail-price">
                    <ProductPrice
                      price={product.price}
                      salePrice={
                        product.salePrice
                      }
                    />
                  </div>

                  {hasSale && (
                    <span className="shop-detail-save">
                      Save Rs{" "}
                      {(
                        product.price -
                        product.salePrice!
                      ).toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="shop-detail-stock-row">
                  {product.stock > 0 ? (
                    <>
                      <Badge
                        bg="success"
                        className="shop-stock-badge"
                      >
                        <CheckCircle2
                          size={13}
                        />
                        In Stock
                      </Badge>

                      <span>
                        {product.stock} units
                        available
                      </span>
                    </>
                  ) : (
                    <Badge
                      bg="secondary"
                      className="shop-stock-badge"
                    >
                      Out of Stock
                    </Badge>
                  )}
                </div>

                {product.shortDescription && (
                  <p className="shop-detail-short-description">
                    {product.shortDescription}
                  </p>
                )}

                <div className="shop-purchase-box">
                  <ProductPurchasePanel
                    productId={product.id}
                    stock={product.stock}
                    variants={product.variants.map(
                      (variant) => ({
                        id: variant.id,
                        name: variant.name,
                        value: variant.value,
                        stock: variant.stock,
                      }),
                    )}
                  />
                </div>

                <div className="shop-service-grid">
                  <div className="shop-service-item">
                    <div className="shop-service-icon">
                      <Truck size={19} />
                    </div>
                    <div>
                      <strong>
                        Fast Delivery
                      </strong>
                      <span>
                        Across Pakistan
                      </span>
                    </div>
                  </div>

                  <div className="shop-service-item">
                    <div className="shop-service-icon">
                      <ShieldCheck size={19} />
                    </div>
                    <div>
                      <strong>
                        Secure Shopping
                      </strong>
                      <span>
                        Safe & secure checkout
                      </span>
                    </div>
                  </div>

                  <div className="shop-service-item">
                    <div className="shop-service-icon">
                      <RotateCcw size={19} />
                    </div>
                    <div>
                      <strong>
                        Easy Returns
                      </strong>
                      <span>
                        Hassle-free returns
                      </span>
                    </div>
                  </div>

                  <div className="shop-service-item">
                    <div className="shop-service-icon">
                      <PackageCheck size={19} />
                    </div>
                    <div>
                      <strong>
                        Quality Product
                      </strong>
                      <span>
                        Carefully packed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </section>

        <section className="shop-detail-content-section">
          <Row className="g-4">
            <Col lg={8}>
              <div className="shop-detail-content-card">
                <div className="shop-detail-section-heading">
                  <span>PRODUCT INFORMATION</span>
                  <h2>Description</h2>
                </div>

                <p className="shop-detail-description">
                  {product.description}
                </p>

                {product.specifications && (
                  <div className="shop-specifications">
                    <div className="shop-detail-section-heading">
                      <span>
                        PRODUCT DETAILS
                      </span>
                      <h2>
                        Specifications
                      </h2>
                    </div>

                    <div className="shop-spec-grid">
                      {Object.entries(
                        product.specifications as Record<
                          string,
                          string
                        >,
                      ).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="shop-spec-item"
                          >
                            <span>
                              {key}
                            </span>
                            <strong>
                              {value}
                            </strong>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Col>

            <Col lg={4}>
              <div className="shop-detail-side-card">
                <div className="shop-side-card-header">
                  <ShieldCheck size={20} />
                  <div>
                    <span>
                      SHOP WITH CONFIDENCE
                    </span>
                    <h3>
                      Why ShopFlow?
                    </h3>
                  </div>
                </div>

                <div className="shop-confidence-list">
                  <div>
                    <CheckCircle2
                      size={17}
                    />
                    <span>
                      Secure checkout
                    </span>
                  </div>

                  <div>
                    <CheckCircle2
                      size={17}
                    />
                    <span>
                      Fast delivery
                    </span>
                  </div>

                  <div>
                    <CheckCircle2
                      size={17}
                    />
                    <span>
                      Quality products
                    </span>
                  </div>

                  <div>
                    <CheckCircle2
                      size={17}
                    />
                    <span>
                      Customer support
                    </span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </section>

        <section className="shop-reviews-section">
          <div className="shop-detail-section-heading">
            <span>WHAT CUSTOMERS SAY</span>
            <h2>
              Reviews 
            </h2>
          </div>

          {session?.user && (
            <div className="shop-review-form-card">
              <ReviewForm
                productId={product.id}
              />
            </div>
          )}

          {product.reviews.length === 0 ? (
            <div className="shop-empty-reviews">
              <Heart size={28} />
              <h3>No reviews yet</h3>
              <p>
                Be the first to share your
                experience with this product.
              </p>
            </div>
          ) : (
            <div className="shop-review-list">
              {product.reviews.map(
                (review) => (
                  <div
                    key={review.id}
                    className="shop-review-item"
                  >
                    <div className="shop-review-user">
                      <div className="shop-review-avatar">
                        {review.user.name
                          ?.charAt(0)
                          .toUpperCase() ??
                          "U"}
                      </div>

                      <div>
                        <strong>
                          {review.user.name}
                        </strong>
                        <span>
                          Verified customer
                        </span>
                      </div>
                    </div>

                    {review.title && (
                      <h4>
                        {review.title}
                      </h4>
                    )}

                    <p>
                      {review.comment}
                    </p>
                  </div>
                ),
              )}
            </div>
          )}
        </section>

        {similarProducts.length > 0 && (
          <section className="shop-similar-section">
            <div className="shop-similar-header">
              <div>
                <span>
                  YOU MAY ALSO LIKE
                </span>
                <h2>
                  Similar Products
                </h2>
                <p>
                  Explore more products from{" "}
                  {product.category.name}.
                </p>
              </div>

              <a
                href={`/categories/${product.category.slug}`}
                className="shop-view-all-link"
              >
                View All
              </a>
            </div>

            <div className="shop-similar-products">
              <ProductGrid
                products={
                  similarProducts as never
                }
              />
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}



