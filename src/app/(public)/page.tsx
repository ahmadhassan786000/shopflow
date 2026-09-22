import Link from "next/link";
import Image from "next/image";
import { Container } from "react-bootstrap";
import type { Metadata } from "next";

import { getFeaturedProducts } from "@/services/productService";
import { getCategoryTree } from "@/services/categoryService";
import { getActiveSliders } from "@/services/sliderService";
import { ProductGrid } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/Pagination";
import { HomepageSlider } from "@/components/home/HomepageSlider";

export const metadata: Metadata = {
  title: "ShopFlow — Shop the latest products",
  description:
    "Discover quality products across electronics, fashion and home — fast shipping, secure checkout.",
};

export const revalidate = 300;

export default async function HomePage() {
  const [featured, categories, sliders] = await Promise.all([
    getFeaturedProducts(8),
    getCategoryTree(),
    getActiveSliders(),
  ]);

  return (
    <>
      {sliders.length > 0 ? (
        <HomepageSlider slides={sliders} />
      ) : (
        <section className="bg-primary bg-gradient text-white py-5">
          <Container className="py-4 text-center">
            <h1 className="display-5 fw-bold mb-3">
              Everything you need, delivered fast
            </h1>

            <p className="lead mb-4 opacity-75">
              Shop thousands of products across every category.
            </p>

            <Link
              href="/products"
              className="btn btn-light btn-lg"
            >
              Shop Now
            </Link>
          </Container>
        </section>
      )}

      <Container className="py-5">
        {/* CATEGORIES */}
        <h2 className="h4 fw-bold mb-3">
          Shop by Category
        </h2>

        <div className="row row-cols-2 row-cols-md-4 g-3 mb-5">
          {categories.map((cat) => (
            <div
              className="col"
              key={cat.id}
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="text-decoration-none"
              >
                <div className="card h-100 border-0 shadow-sm overflow-hidden">
                  {/* CATEGORY IMAGE */}
                  <div
                    className="position-relative bg-light"
                    style={{
                      aspectRatio: "16/10",
                    }}
                  >
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted small">
                        No image
                      </div>
                    )}
                  </div>

                  {/* CATEGORY NAME */}
                  <div className="card-body text-center py-3">
                    <div className="fw-semibold text-dark">
                      {cat.name}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* FEATURED PRODUCTS */}
        <h2 className="h4 fw-bold mb-3">
          Featured Products
        </h2>

        {featured.length > 0 ? (
          <ProductGrid products={featured as never} />
        ) : (
          <EmptyState
            title="No featured products yet"
            description="Check back soon."
          />
        )}
      </Container>
    </>
  );
}
