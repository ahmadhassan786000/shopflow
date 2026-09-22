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
  searchParams: {
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    brand?: string;
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const [{ items, total, totalPages }, brands] = await Promise.all([
    getProducts({
      search: searchParams.search,
      categorySlug: searchParams.category,
      minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
      brand: searchParams.brand,
      sort: (searchParams.sort as never) ?? "newest",
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
          {searchParams.search ? `Search results for "${searchParams.search}"` : "All Products"}
        </h1>
        <span className="text-muted small">{total} product{total !== 1 ? "s" : ""}</span>
      </div>

      <ProductFilterBar brands={brands} />

      {items.length > 0 ? (
        <InfiniteProductGrid
          key={JSON.stringify(searchParams)}
          initialItems={items as never}
          initialTotal={total}
          initialTotalPages={totalPages}
          pageSize={PAGE_SIZE}
          query={{
            search: searchParams.search,
            category: searchParams.category,
            minPrice: searchParams.minPrice,
            maxPrice: searchParams.maxPrice,
            brand: searchParams.brand,
            sort: searchParams.sort,
          }}
        />
      ) : (
        <EmptyState title="No products found" description="Try adjusting your search or filters." />
      )}
    </Container>
  );
}
