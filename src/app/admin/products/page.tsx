import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Package,
  ChevronRight,
  Pencil,
  FolderOpen,
} from "lucide-react";

import {
  getAllProductsForAdmin,
  getProductCategoriesForAdmin,
} from "@/services/productService";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Products",
};

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    stock?: string;
    sort?: string;
    page?: string;
  }>;
}

function getStockInfo(stock: number) {
  if (stock <= 0) {
    return {
      label: "Out of Stock",
      className: "text-bg-danger",
    };
  }

  if (stock <= 5) {
    return {
      label: "Low Stock",
      className: "text-bg-warning",
    };
  }

  return {
    label: "In Stock",
    className: "text-bg-success",
  };
}

function getStatusInfo(status: string) {
  switch (status) {
    case "PUBLISHED":
      return {
        label: "PUBLISHED",
        className: "text-bg-success",
      };

    case "DRAFT":
      return {
        label: "DRAFT",
        className: "text-bg-secondary",
      };

    case "ARCHIVED":
      return {
        label: "ARCHIVED",
        className: "text-bg-dark",
      };

    default:
      return {
        label: status,
        className: "text-bg-secondary",
      };
  }
}

function buildProductsUrl(
  current: {
    search?: string;
    category?: string;
    status?: string;
    stock?: string;
    sort?: string;
  },
  updates: Record<string, string | undefined>,
) {
  const values = {
    ...current,
    ...updates,
  };

  const params = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  params.delete("page");

  const query = params.toString();

  return query
    ? `/admin/products?${query}`
    : "/admin/products";
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const search = params.search ?? "";
  const category = params.category ?? "";
  const status = params.status ?? "";
  const stock = params.stock ?? "";
  const sort = params.sort ?? "newest";

  const parsedPage = Number(params.page ?? "1");

  const page =
    Number.isNaN(parsedPage) || parsedPage < 1
      ? 1
      : parsedPage;

  const [result, categories] = await Promise.all([
    getAllProductsForAdmin({
      search,
      categoryId: category || undefined,
      status: status || undefined,
      stock: stock || undefined,
      sort,
      page,
      pageSize: 20,
    }),

    getProductCategoriesForAdmin(),
  ]);

  const selectedCategory = categories.find(
    (item) => item.id === category,
  );

  const totalCategoryProducts = categories.reduce(
    (total, item) => total + item.productCount,
    0,
  );

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1">
            Products
          </h1>

          <p className="text-muted small mb-0">
            Manage your complete product catalog.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="btn btn-primary"
        >
          <Plus
            size={17}
            className="me-2"
          />

          Add Product
        </Link>
      </div>

      {/* MAIN LAYOUT */}
      <div className="row g-4">
        {/* PRODUCTS AREA */}
        <div className="col-lg-9">
          {/* PRODUCT HEADING */}
          <div className="bg-white border rounded-3 shadow-sm p-4 mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <h2 className="h5 fw-bold mb-1">
                  {selectedCategory?.name ??
                    "All Products"}
                </h2>

                <p className="text-muted small mb-0">
                  {result.total}{" "}
                  {result.total === 1
                    ? "product"
                    : "products"}{" "}
                  found
                </p>
              </div>

              <div className="d-flex align-items-center gap-2 text-muted small">
                <Package size={17} />

                Page {result.page} of{" "}
                {result.totalPages || 1}
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="bg-white border rounded-3 shadow-sm p-4 mb-4">
            <form method="GET">
              {category && (
                <input
                  type="hidden"
                  name="category"
                  value={category}
                />
              )}

              <div className="row g-3 align-items-end">
                {/* SEARCH */}
                <div className="col-lg-5">
                  <label
                    htmlFor="product-search"
                    className="form-label small fw-semibold"
                  >
                    Search products
                  </label>

                  <div className="position-relative">
                    <Search
                      size={17}
                      className="position-absolute text-muted"
                      style={{
                        left: 12,
                        top: "50%",
                        transform:
                          "translateY(-50%)",
                        pointerEvents: "none",
                      }}
                    />

                    <input
                      id="product-search"
                      name="search"
                      type="text"
                      defaultValue={search}
                      placeholder="Search by name, SKU or brand..."
                      className="form-control ps-5"
                    />
                  </div>
                </div>

                {/* STATUS */}
                <div className="col-md-4 col-lg-2">
                  <label
                    htmlFor="product-status"
                    className="form-label small fw-semibold"
                  >
                    Status
                  </label>

                  <select
                    id="product-status"
                    name="status"
                    defaultValue={status}
                    className="form-select"
                  >
                    <option value="">
                      All Status
                    </option>

                    <option value="PUBLISHED">
                      Published
                    </option>

                    <option value="DRAFT">
                      Draft
                    </option>

                    <option value="ARCHIVED">
                      Archived
                    </option>
                  </select>
                </div>

                {/* STOCK */}
                <div className="col-md-4 col-lg-2">
                  <label
                    htmlFor="product-stock"
                    className="form-label small fw-semibold"
                  >
                    Stock
                  </label>

                  <select
                    id="product-stock"
                    name="stock"
                    defaultValue={stock}
                    className="form-select"
                  >
                    <option value="">
                      All Stock
                    </option>

                    <option value="in">
                      In Stock
                    </option>

                    <option value="low">
                      Low Stock
                    </option>

                    <option value="out">
                      Out of Stock
                    </option>
                  </select>
                </div>

                {/* SORT */}
                <div className="col-md-4 col-lg-3">
                  <label
                    htmlFor="product-sort"
                    className="form-label small fw-semibold"
                  >
                    Sort
                  </label>

                  <select
                    id="product-sort"
                    name="sort"
                    defaultValue={sort}
                    className="form-select"
                  >
                    <option value="newest">
                      Newest
                    </option>

                    <option value="oldest">
                      Oldest
                    </option>

                    <option value="name_asc">
                      Name A-Z
                    </option>

                    <option value="price_asc">
                      Price Low-High
                    </option>

                    <option value="price_desc">
                      Price High-Low
                    </option>
                  </select>
                </div>

                {/* FILTER BUTTONS */}
                <div className="col-12">
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Apply Filters
                    </button>

                    <Link
                      href="/admin/products"
                      className="btn btn-outline-secondary"
                    >
                      Clear
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* PRODUCT TABLE CARD */}
          <div className="bg-white border rounded-3 shadow-sm overflow-hidden">
            {result.items.length === 0 ? (
              /* EMPTY STATE */
              <div className="text-center py-5 px-3">
                <Package
                  size={42}
                  className="text-muted mb-3"
                />

                <h2 className="h6 fw-bold">
                  No products found
                </h2>

                <p className="text-muted small mb-3">
                  Try changing your search or
                  filter settings.
                </p>

                <Link
                  href="/admin/products"
                  className="btn btn-outline-primary btn-sm"
                >
                  View all products
                </Link>
              </div>
            ) : (
              <>
                {/* SCROLLABLE TABLE AREA */}
                <div
                  className="table-responsive"
                  style={{
                    maxHeight: "550px",
                    overflowY: "auto",
                    overflowX: "auto",
                  }}
                >
                  <table className="table table-hover align-middle mb-0">
                    {/* STICKY TABLE HEADER */}
                    <thead
                      className="table-light"
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                      }}
                    >
                      <tr>
                        <th className="ps-4">
                          Product
                        </th>

                        <th>
                          SKU
                        </th>

                        <th>
                          Category
                        </th>

                        <th>
                          Price
                        </th>

                        <th>
                          Stock
                        </th>

                        <th>
                          Status
                        </th>

                        <th className="text-end pe-4">
                          Action
                        </th>
                      </tr>
                    </thead>

                    {/* TABLE BODY */}
                    <tbody>
                      {result.items.map(
                        (product) => {
                          const stockInfo =
                            getStockInfo(
                              product.stock,
                            );

                          const statusInfo =
                            getStatusInfo(
                              product.status,
                            );

                          const image =
                            product.images[0];

                          return (
                            <tr
                              key={
                                product.id
                              }
                            >
                              {/* PRODUCT */}
                              <td className="ps-4">
                                <div className="d-flex align-items-center gap-3">
                                  <div
                                    className="rounded border bg-light overflow-hidden position-relative flex-shrink-0"
                                    style={{
                                      width: 52,
                                      height: 52,
                                    }}
                                  >
                                    {image ? (
                                      <Image
                                        src={
                                          image.url
                                        }
                                        alt={
                                          product.name
                                        }
                                        fill
                                        sizes="52px"
                                        style={{
                                          objectFit:
                                            "cover",
                                        }}
                                      />
                                    ) : (
                                      <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                                        <Package
                                          size={
                                            20
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <div>
                                    <Link
                                      href={`/admin/products/${product.id}/edit`}
                                      className="fw-semibold text-decoration-none text-dark"
                                    >
                                      {
                                        product.name
                                      }
                                    </Link>

                                    {product.brand && (
                                      <div className="text-muted small">
                                        {
                                          product.brand
                                        }
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* SKU */}
                              <td>
                                <span className="small text-muted">
                                  {
                                    product.sku
                                  }
                                </span>
                              </td>

                              {/* CATEGORY */}
                              <td>
                                <span className="small fw-medium">
                                  {
                                    product
                                      .category
                                      .name
                                  }
                                </span>
                              </td>

                              {/* PRICE */}
                              <td>
                                <div className="fw-semibold">
                                  {formatCurrency(
                                    product.price.toString(),
                                  )}
                                </div>

                                {product.salePrice && (
                                  <div className="text-success small">
                                    Sale: {formatCurrency(
                                      product.salePrice.toString(),
                                    )}
                                  </div>
                                )}
                              </td>

                              {/* STOCK */}
                              <td>
                                <div className="fw-semibold small mb-1">
                                  {
                                    product.stock
                                  }
                                </div>

                                <span
                                  className={`badge ${stockInfo.className}`}
                                >
                                  {
                                    stockInfo.label
                                  }
                                </span>
                              </td>

                              {/* STATUS */}
                              <td>
                                <span
                                  className={`badge ${statusInfo.className}`}
                                >
                                  {
                                    statusInfo.label
                                  }
                                </span>
                              </td>

                              {/* ACTION */}
                              <td className="text-end pe-4">
                                <Link
                                  href={`/admin/products/${product.id}/edit`}
                                  className="btn btn-sm btn-outline-secondary"
                                  title="Edit product"
                                >
                                  <Pencil
                                    size={
                                      15
                                    }
                                  />
                                </Link>
                              </td>
                            </tr>
                          );
                        },
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION - OUTSIDE SCROLL AREA */}
                {result.totalPages > 1 && (
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 p-3 border-top bg-white">
                    <span className="small text-muted">
                      Showing{" "}
                      {(result.page - 1) *
                        result.pageSize +
                        1}{" "}
                      -{" "}
                      {Math.min(
                        result.page *
                          result.pageSize,
                        result.total,
                      )}{" "}
                      of{" "}
                      {result.total}
                    </span>

                    <div className="d-flex gap-2">
                      {/* PREVIOUS */}
                      {result.page > 1 && (
                        <Link
                          href={buildProductsUrl(
                            {
                              search,
                              category,
                              status,
                              stock,
                              sort,
                            },
                            {
                              page: String(
                                result.page -
                                  1,
                              ),
                            },
                          )}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          Previous
                        </Link>
                      )}

                      {/* NEXT */}
                      {result.page <
                        result.totalPages && (
                        <Link
                          href={buildProductsUrl(
                            {
                              search,
                              category,
                              status,
                              stock,
                              sort,
                            },
                            {
                              page: String(
                                result.page +
                                  1,
                              ),
                            },
                          )}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Next

                          <ChevronRight
                            size={15}
                            className="ms-1"
                          />
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* RIGHT CATEGORY SIDEBAR */}
        <div className="col-lg-3">
          <div
            className="bg-white border rounded-3 shadow-sm position-sticky"
            style={{
              top: 20,
            }}
          >
            <div className="p-3">
              {/* CATEGORY HEADER */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <FolderOpen size={18} />

                <h2 className="h6 fw-bold mb-0">
                  Categories
                </h2>
              </div>

              {/* CATEGORY LIST */}
              <div className="d-flex flex-column gap-1">
                {/* ALL PRODUCTS */}
                <Link
                  href="/admin/products"
                  className={`d-flex justify-content-between align-items-center text-decoration-none rounded px-3 py-2 ${
                    !category
                      ? "bg-primary text-white"
                      : "text-dark"
                  }`}
                >
                  <span className="small fw-medium">
                    All Products
                  </span>

                  <span
                    className={`small ${
                      !category
                        ? "text-white"
                        : "text-muted"
                    }`}
                  >
                    {
                      totalCategoryProducts
                    }
                  </span>
                </Link>

                {/* CATEGORIES */}
                {categories.map(
                  (item) => {
                    const isActive =
                      category ===
                      item.id;

                    return (
                      <Link
                        key={item.id}
                        href={buildProductsUrl(
                          {
                            search: "",
                            status: "",
                            stock: "",
                            sort: "newest",
                          },
                          {
                            category:
                              item.id,
                          },
                        )}
                        className={`d-flex justify-content-between align-items-center text-decoration-none rounded px-3 py-2 ${
                          isActive
                            ? "bg-primary text-white"
                            : "text-dark"
                        }`}
                      >
                        <span className="small fw-medium">
                          {
                            item.name
                          }
                        </span>

                        <span
                          className={`small ${
                            isActive
                              ? "text-white"
                              : "text-muted"
                          }`}
                        >
                          {
                            item.productCount
                          }
                        </span>
                      </Link>
                    );
                  },
                )}
              </div>

              {/* MANAGE CATEGORIES */}
              <div className="border-top mt-3 pt-3">
                <Link
                  href="/admin/categories"
                  className="small text-decoration-none"
                >
                  Manage Categories

                  <ChevronRight
                    size={14}
                    className="ms-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
