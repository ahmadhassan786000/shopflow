"use client";

import { useEffect, useState } from "react";
import {
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import {
  SlidersHorizontal,
  RotateCcw,
  WalletCards,
  ArrowUpDown,
  Tag,
  Check,
} from "lucide-react";
import {
  Button,
  Form,
  Offcanvas,
} from "react-bootstrap";

interface ProductFilterBarProps {
  brands?: string[];
}

export function ProductFilterBar({ brands = [] }: ProductFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentMinPrice =
    searchParams.get("minPrice") ?? "";

  const currentMaxPrice =
    searchParams.get("maxPrice") ?? "";

  const currentSort =
    searchParams.get("sort") ?? "newest";

  const currentBrand =
    searchParams.get("brand") ?? "";

  const [minPrice, setMinPrice] =
    useState(currentMinPrice);

  const [maxPrice, setMaxPrice] =
    useState(currentMaxPrice);

  const [sort, setSort] =
    useState(currentSort);

  const [brand, setBrand] =
    useState(currentBrand);

  const [showMobile, setShowMobile] =
    useState(false);

  useEffect(() => {
    setMinPrice(currentMinPrice);
    setMaxPrice(currentMaxPrice);
    setSort(currentSort);
    setBrand(currentBrand);
  }, [
    currentMinPrice,
    currentMaxPrice,
    currentSort,
    currentBrand,
  ]);

  const activeFilterCount =
    (currentMinPrice ? 1 : 0) +
    (currentMaxPrice ? 1 : 0) +
    (currentBrand ? 1 : 0) +
    (currentSort !== "newest" ? 1 : 0);

  function applyFilters() {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }

    if (brand) {
      params.set("brand", brand);
    } else {
      params.delete("brand");
    }

    if (sort && sort !== "newest") {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }

    params.set("page", "1");

    router.push(
      `${pathname}?${params.toString()}`,
    );

    setShowMobile(false);
  }

  function clearFilters() {
    const params = new URLSearchParams();

    const search = searchParams.get("search");
    const category = searchParams.get("category");

    if (search) {
      params.set("search", search);
    }

    if (category) {
      params.set("category", category);
    }

    params.set("page", "1");

    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setBrand("");
    setShowMobile(false);

    router.push(
      `${pathname}?${params.toString()}`,
    );
  }

  function BrandOptions() {
    if (brands.length === 0) {
      return null;
    }

    return (
      <div className="shop-filter-section">
        <div className="shop-filter-section-title">
          <div className="shop-filter-section-icon">
            <Tag size={15} />
          </div>

          <span>Brand</span>
        </div>

        <div className="shop-brand-options">
          <button
            type="button"
            className={`shop-brand-chip ${
              brand === "" ? "active" : ""
            }`}
            onClick={() => setBrand("")}
          >
            All Brands
          </button>

          {brands.map((b) => (
            <button
              type="button"
              key={b}
              className={`shop-brand-chip ${
                brand === b ? "active" : ""
              }`}
              onClick={() => setBrand(b)}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function MobileFilterContent() {
    return (
      <div className="shop-filter-card">
        <div className="shop-filter-card-header">
          <div className="shop-filter-title">
            <div className="shop-filter-icon">
              <SlidersHorizontal size={19} />
            </div>

            <div>
              <span>REFINE</span>
              <h3>Filters</h3>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="shop-active-filter-badge">
              {activeFilterCount}{" "}
              {activeFilterCount === 1
                ? "filter"
                : "filters"}{" "}
              active
            </div>
          )}
        </div>

        <div className="shop-filter-card-body">
          {/* PRICE */}
          <div className="shop-filter-section">
            <div className="shop-filter-section-title">
              <div className="shop-filter-section-icon">
                <WalletCards size={15} />
              </div>

              <span>Price Range</span>
            </div>

            <div className="shop-price-inputs">
              <Form.Control
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(e.target.value)
                }
                placeholder="Min"
              />

              <span>—</span>

              <Form.Control
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(e.target.value)
                }
                placeholder="Max"
              />
            </div>

            <div className="shop-price-labels">
              <span>Rs 0</span>
              <span>Any price</span>
            </div>
          </div>

          {/* BRAND */}
          <BrandOptions />

          {/* SORT */}
          <div className="shop-filter-section">
            <div className="shop-filter-section-title">
              <div className="shop-filter-section-icon">
                <ArrowUpDown size={15} />
              </div>

              <span>Sort Products</span>
            </div>

            <div className="shop-sort-options">
              {[
                {
                  value: "newest",
                  label: "Newest",
                },
                {
                  value: "price_asc",
                  label: "Price: Low to High",
                },
                {
                  value: "price_desc",
                  label: "Price: High to Low",
                },
                {
                  value: "rating",
                  label: "Top Rated",
                },
              ].map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={`shop-sort-option ${
                    sort === option.value
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setSort(option.value)
                  }
                >
                  <span>{option.label}</span>

                  {sort === option.value && (
                    <Check size={15} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="shop-filter-actions">
          <Button
            type="button"
            className="shop-apply-button"
            onClick={applyFilters}
          >
            Apply Filters
          </Button>

          <button
            type="button"
            className="shop-reset-button"
            onClick={clearFilters}
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className="shop-filter-card-footer">
          <span>
            Refine your shopping experience
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* =================================================
          DESKTOP FILTER
      ================================================= */}
      <div className="shop-products-filter shop-products-filter-desktop">
        <div className="shop-products-filter-top">
          <div className="shop-products-filter-title">
            <div className="shop-products-filter-icon">
              <SlidersHorizontal size={17} />
            </div>

            <div>
              <span className="shop-products-filter-eyebrow">
                REFINE RESULTS
              </span>

              <h2>Filter & Sort</h2>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="shop-active-filter-badge">
              {activeFilterCount}{" "}
              {activeFilterCount === 1
                ? "filter"
                : "filters"}{" "}
              active
            </div>
          )}
        </div>

        {brands.length > 0 && (
          <div className="shop-products-brand-row">
            <span className="shop-products-brand-label">
              <Tag size={14} />
              Brand
            </span>

            <div className="shop-brand-options shop-brand-options-inline">
              <button
                type="button"
                className={`shop-brand-chip ${
                  brand === "" ? "active" : ""
                }`}
                onClick={() => setBrand("")}
              >
                All Brands
              </button>

              {brands.map((b) => (
                <button
                  type="button"
                  key={b}
                  className={`shop-brand-chip ${
                    brand === b ? "active" : ""
                  }`}
                  onClick={() => setBrand(b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="shop-products-filter-grid">
          {/* PRICE RANGE */}
          <div className="shop-products-filter-group">
            <div className="shop-products-filter-label">
              <WalletCards size={15} />
              <span>Price Range</span>
            </div>

            <div className="shop-products-price-row">
              <div className="shop-products-price-input">
                <span>MIN</span>

                <Form.Control
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(e.target.value)
                  }
                  placeholder="Rs 0"
                />
              </div>

              <span className="shop-products-price-divider">
                —
              </span>

              <div className="shop-products-price-input">
                <span>MAX</span>

                <Form.Control
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(e.target.value)
                  }
                  placeholder="Any"
                />
              </div>
            </div>
          </div>

          {/* SORT */}
          <div className="shop-products-filter-group shop-products-sort-group">
            <div className="shop-products-filter-label">
              <ArrowUpDown size={15} />
              <span>Sort Products</span>
            </div>

            <Form.Select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="shop-products-sort-select"
              aria-label="Sort products"
            >
              <option value="newest">
                Newest
              </option>

              <option value="price_asc">
                Price: Low to High
              </option>

              <option value="price_desc">
                Price: High to Low
              </option>

              <option value="rating">
                Top Rated
              </option>
            </Form.Select>
          </div>

          {/* ACTIONS */}
          <div className="shop-products-filter-action">
            <button
              type="button"
              className="shop-products-apply-button"
              onClick={applyFilters}
            >
              <Check size={15} />
              <span>Apply Filters</span>
            </button>

            <button
              type="button"
              className="shop-products-clear-button"
              onClick={clearFilters}
              disabled={
                activeFilterCount === 0 &&
                !minPrice &&
                !maxPrice &&
                !brand &&
                sort === "newest"
              }
            >
              <RotateCcw size={14} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          MOBILE FILTER
      ================================================= */}
      <div className="shop-mobile-filter shop-products-mobile-filter">
        <Button
          type="button"
          className="shop-mobile-filter-button"
          onClick={() => setShowMobile(true)}
        >
          <SlidersHorizontal size={17} />
          Filters

          {activeFilterCount > 0 && (
            <span className="shop-mobile-filter-count">
              {activeFilterCount}
            </span>
          )}
        </Button>

        <Offcanvas
          show={showMobile}
          onHide={() => setShowMobile(false)}
          placement="start"
          className="shop-mobile-filter-offcanvas"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="fw-bold">
              ShopFlow Filters
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body className="p-0">
            <MobileFilterContent />
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
}
