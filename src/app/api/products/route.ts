import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/services/productService";

// Serializes a fetched product page into plain JSON-safe data (Prisma
// Decimal fields need to become numbers before they can cross the wire).
function serialize(items: Awaited<ReturnType<typeof getProducts>>["items"]) {
  return items.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: Number(product.price),
    salePrice:
      product.salePrice !== null && product.salePrice !== undefined
        ? Number(product.salePrice)
        : null,
    stock: product.stock,
    avgRating: product.avgRating,
    reviewCount: product.reviewCount,
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      position: image.position,
    })),
  }));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 12);

  const sortParam = searchParams.get("sort");
  const allowedSorts = ["newest", "price_asc", "price_desc", "rating"] as const;
  const sort = allowedSorts.includes(sortParam as (typeof allowedSorts)[number])
    ? (sortParam as (typeof allowedSorts)[number])
    : "newest";

  const stockParam = searchParams.get("stock");

  const result = await getProducts({
    search: searchParams.get("search") ?? undefined,
    categorySlug: searchParams.get("category") ?? undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    brand: searchParams.get("brand") ?? undefined,
    stock: stockParam === "in" ? "in" : undefined,
    sort,
    page,
    pageSize,
  });

  return NextResponse.json({
    items: serialize(result.items),
    total: result.total,
    totalPages: result.totalPages,
    page: result.page,
  });
}
