import type { Metadata } from "next";
import { Container } from "react-bootstrap";
import { getProducts, getAvailableBrands } from "@/services/productService";
import { InfiniteProductGrid } from "@/components/product/InfiniteProductGrid";
import { ProductFilterBar } from "@/components/product/ProductFilterBar";
import { EmptyState } from "@/components/ui/Pagination";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our full product catalog.",
};

const PAGE_SIZE = 12;

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    brand?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  const [{ items, total, totalPages }, brands] = await Promise.all([
    getProducts({
      search: resolvedSearchParams.search,
      categorySlug: resolvedSearchParams.category,
      minPrice: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined,
      maxPrice: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined,
      brand: resolvedSearchParams.brand,
      sort: (resolvedSearchParams.sort as never) ?? "newest",
      page: 1,
      pageSize: PAGE_SIZE,
    }),
    getAvailableBrands(),
  ]);

  return (
    <Container className="py-4">
      <Breadcrumbs items={[{ label: "All Products" }]} />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 fw-bold mb-0">
          {resolvedSearchParams.search ? `Search results for "${resolvedSearchParams.search}"` : "All Products"}
        </h1>
        <span className="text-muted small">{total} product{total !== 1 ? "s" : ""}</span>
      </div>

      <ProductFilterBar brands={brands} />

      {items.length > 0 ? (
        <InfiniteProductGrid
          key={JSON.stringify(resolvedSearchParams)}
          initialItems={items as never}
          initialTotal={total}
          initialTotalPages={totalPages}
          pageSize={PAGE_SIZE}
          query={{
            search: resolvedSearchParams.search,
            category: resolvedSearchParams.category,
            minPrice: resolvedSearchParams.minPrice,
            maxPrice: resolvedSearchParams.maxPrice,
            brand: resolvedSearchParams.brand,
            sort: resolvedSearchParams.sort,
          }}
        />
      ) : (
        <EmptyState title="No products found" description="Try adjusting your search or filters." />
      )}
    </Container>
  );
}


