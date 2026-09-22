import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "react-bootstrap";
import {
  ChevronRight,
  LayoutGrid,
} from "lucide-react";

import {
  getCategoryBySlug,
  getCategoryTree,
} from "@/services/categoryService";

import { getProducts, getAvailableBrands } from "@/services/productService";

import { InfiniteProductGrid } from "@/components/product/InfiniteProductGrid";
import { CategoryFilters } from "@/components/product/CategoryFilters";
import {
  EmptyState,
} from "@/components/ui/Pagination";

interface PageProps {
  params: {
    slug: string;
  };

  searchParams: {
    page?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    stock?: string;
    brand?: string;
  };
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  children?: CategoryItem[];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: "Category not found | ShopFlow",
    };
  }

  return {
    title: `${category.name} | ShopFlow`,
    description:
      category.description ??
      `Shop ${category.name} products at ShopFlow.`,
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
  };
}

function CategoryNavigation({
  categories,
  currentSlug,
  level = 0,
}: {
  categories: CategoryItem[];
  currentSlug: string;
  level?: number;
}) {
  return (
    <div className={level > 0 ? "category-sub-list" : ""}>
      {categories.map((item) => {
        const active = item.slug === currentSlug;

        return (
          <div key={item.id}>
            <Link
              href={`/categories/${item.slug}`}
              className={`shop-category-link ${
                active ? "active" : ""
              }`}
            >
              <span className="shop-category-link-content">
                <span className="shop-category-name">
                  {item.name}
                </span>

                {item.children &&
                  item.children.length > 0 && (
                    <span className="shop-category-count">
                      {item.children.length}
                    </span>
                  )}
              </span>

              <ChevronRight
                size={16}
                strokeWidth={1.8}
                className="shop-category-arrow"
              />
            </Link>

            {item.children &&
              item.children.length > 0 && (
                <CategoryNavigation
                  categories={item.children}
                  currentSlug={currentSlug}
                  level={level + 1}
                />
              )}
          </div>
        );
      })}
    </div>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const categories =
    (await getCategoryTree()) as CategoryItem[];

  const page = Math.max(
    1,
    Number(searchParams.page ?? 1),
  );

  const sort =
    (searchParams.sort as
      | "newest"
      | "price_asc"
      | "price_desc"
      | "rating") ?? "newest";

  const PAGE_SIZE = 12;

  const { items, total, totalPages } =
    await getProducts({
      categorySlug: category.slug,
      sort,

      minPrice: searchParams.minPrice
        ? Number(searchParams.minPrice)
        : undefined,

      maxPrice: searchParams.maxPrice
        ? Number(searchParams.maxPrice)
        : undefined,

      stock:
        searchParams.stock === "in"
          ? "in"
          : undefined,

      brand: searchParams.brand,

      page,
      pageSize: PAGE_SIZE,
    });

  const brands = await getAvailableBrands(category.slug);

  return (
    <main className="shop-category-page">
      <Container className="py-4 py-lg-5">

        {/* HERO */}
        <section
          className={`shop-category-hero ${
            category.image
              ? "shop-category-hero-with-image"
              : ""
          }`}
          style={
            category.image
              ? {
                  backgroundImage: `url("${category.image}")`,
                }
              : undefined
          }
        >
          {category.image && (
            <div
              className="shop-category-hero-overlay"
              aria-hidden="true"
            />
          )}

          <div className="shop-category-hero-content">
            <div className="shop-category-badge">
              <LayoutGrid size={15} />
              <span>SHOPFLOW COLLECTION</span>
            </div>

            <h1>{category.name}</h1>

            {category.description && (
              <p>{category.description}</p>
            )}

            <div className="shop-category-meta">
              <span className="shop-category-total">
                {total}
              </span>

              <span>
                {total === 1
                  ? "product"
                  : "products"}{" "}
                available
              </span>
            </div>
          </div>

          <div className="shop-category-hero-shape shape-one" />
          <div className="shop-category-hero-shape shape-two" />
          <div className="shop-category-hero-shape shape-three" />
        </section>

        {/* MOBILE FILTER */}
        <div className="shop-mobile-filter">
          <CategoryFilters
            mobile
            minPrice={searchParams.minPrice ?? ""}
            maxPrice={searchParams.maxPrice ?? ""}
            sort={searchParams.sort ?? "newest"}
            stock={searchParams.stock === "in"}
            brand={searchParams.brand ?? ""}
            brands={brands}
          />
        </div>

        {/* THREE COLUMN SHOP LAYOUT */}
        <div className="shop-category-layout">

          {/* LEFT SIDEBAR */}
          <aside className="shop-filter-sidebar">

            {/* FILTERS */}
            <CategoryFilters
              mobile={false}
              minPrice={searchParams.minPrice ?? ""}
              maxPrice={searchParams.maxPrice ?? ""}
              sort={searchParams.sort ?? "newest"}
              stock={searchParams.stock === "in"}
              brand={searchParams.brand ?? ""}
              brands={brands}
            />

            {/* ALL CATEGORIES */}
            <div className="shop-categories-card mt-4">

              <div className="shop-categories-header">
                <div className="shop-categories-title">
                  <div className="shop-categories-icon">
                    <LayoutGrid size={19} />
                  </div>

                  <div>
                    <span>SHOP BY</span>
                    <h3>All Categories</h3>
                  </div>
                </div>
              </div>

              <div className="shop-categories-body">
                <CategoryNavigation
                  categories={categories}
                  currentSlug={category.slug}
                />
              </div>

              <div className="shop-categories-footer">
                Explore all ShopFlow collections
              </div>

            </div>

          </aside>

          {/* CENTER PRODUCTS */}
          <section className="shop-products-section">

            <div className="shop-products-header">
              <div>
                <span className="shop-section-label">
                  EXPLORE PRODUCTS
                </span>

                <h2>{category.name}</h2>

                <p>
                  Showing {items.length} of {total} products
                </p>
              </div>
            </div>

            {items.length > 0 ? (
              <InfiniteProductGrid
                key={JSON.stringify(searchParams)}
                initialItems={items as never}
                initialTotal={total}
                initialTotalPages={totalPages}
                pageSize={PAGE_SIZE}
                query={{
                  category: category.slug,
                  minPrice: searchParams.minPrice,
                  maxPrice: searchParams.maxPrice,
                  stock: searchParams.stock,
                  brand: searchParams.brand,
                  sort: searchParams.sort,
                }}
              />
            ) : (
              <div className="shop-empty-wrapper">
                <EmptyState
                  title="No products found"
                  description="Try changing your filters or explore another category."
                />
              </div>
            )}
          </section>

        </div>

        {/* SHOP BY CATEGORY */}
        <section className="shop-category-discovery">
          <div className="shop-category-discovery-header">
            <div>
              <span className="shop-section-label">
                SHOPFLOW COLLECTION
              </span>

              <h2>Shop by Category</h2>

              <p>
                Explore our collections and discover products
                across every category.
              </p>
            </div>

            <Link
              href="/products"
              className="shop-category-discovery-link"
            >
              View All Products
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="shop-category-discovery-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="shop-category-discovery-card"
                style={
                  cat.image
                    ? {
                        backgroundImage: `url("${cat.image}")`,
                      }
                    : undefined
                }
              >
                <div className="shop-category-discovery-overlay" />

                <div className="shop-category-discovery-content">
                  <span className="shop-category-discovery-label">
                    SHOPFLOW
                  </span>

                  <h3>{cat.name}</h3>

                  <span className="shop-category-discovery-explore">
                    Explore Category
                    <ChevronRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </Container>
    </main>
  );
}