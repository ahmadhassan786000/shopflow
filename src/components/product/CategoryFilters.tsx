"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  RotateCcw,
  SlidersHorizontal,
  Tag,
  WalletCards,
} from "lucide-react";
import { Button, Form, Offcanvas } from "react-bootstrap";

interface CategoryFiltersProps {
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  stock?: boolean;
  brand?: string;
  brands?: string[];
  mobile?: boolean;
}

export function CategoryFilters({
  minPrice = "",
  maxPrice = "",
  sort = "newest",
  stock = false,
  brand = "",
  brands = [],
  mobile = false,
}: CategoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showMobile, setShowMobile] = useState(false);
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);
  const [selectedSort, setSelectedSort] = useState(sort);
  const [inStock, setInStock] = useState(stock);
  const [selectedBrand, setSelectedBrand] = useState(brand);

  useEffect(() => {
    setMin(minPrice);
    setMax(maxPrice);
    setSelectedSort(sort);
    setInStock(stock);
    setSelectedBrand(brand);
  }, [minPrice, maxPrice, sort, stock, brand]);

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    if (min) {
      params.set("minPrice", min);
    } else {
      params.delete("minPrice");
    }

    if (max) {
      params.set("maxPrice", max);
    } else {
      params.delete("maxPrice");
    }

    if (selectedSort && selectedSort !== "newest") {
      params.set("sort", selectedSort);
    } else {
      params.delete("sort");
    }

    if (inStock) {
      params.set("stock", "in");
    } else {
      params.delete("stock");
    }

    if (selectedBrand) {
      params.set("brand", selectedBrand);
    } else {
      params.delete("brand");
    }

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
    setShowMobile(false);
  }

  function resetFilters() {
    const params = new URLSearchParams();

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);

    setMin("");
    setMax("");
    setSelectedSort("newest");
    setInStock(false);
    setSelectedBrand("");
    setShowMobile(false);
  }

  function FilterContent() {
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
                value={min}
                onChange={(e) => setMin(e.target.value)}
                placeholder="Min"
              />

              <span>—</span>

              <Form.Control
                type="number"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                placeholder="Max"
              />
            </div>

            <div className="shop-price-labels">
              <span>Rs 0</span>
              <span>Any price</span>
            </div>
          </div>

          {/* BRAND */}
          {brands.length > 0 && (
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
                    selectedBrand === "" ? "active" : ""
                  }`}
                  onClick={() => setSelectedBrand("")}
                >
                  All Brands
                </button>

                {brands.map((b) => (
                  <button
                    type="button"
                    key={b}
                    className={`shop-brand-chip ${
                      selectedBrand === b ? "active" : ""
                    }`}
                    onClick={() => setSelectedBrand(b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AVAILABILITY */}
          <div className="shop-filter-section">
            <div className="shop-filter-section-title">
              <div className="shop-filter-section-icon">
                <Tag size={15} />
              </div>

              <span>Availability</span>
            </div>

            <button
              type="button"
              className={`shop-filter-option ${
                inStock ? "active" : ""
              }`}
              onClick={() => setInStock(!inStock)}
            >
              <span className="shop-filter-option-left">
                <span
                  className={`shop-custom-checkbox ${
                    inStock ? "checked" : ""
                  }`}
                >
                  {inStock && <Check size={12} />}
                </span>

                <span>In Stock</span>
              </span>

              <span className="shop-filter-option-count">
                ✓
              </span>
            </button>
          </div>

          {/* SORT */}
          <div className="shop-filter-section">
            <div className="shop-filter-section-title">
              <div className="shop-filter-section-icon">
                <SlidersHorizontal size={15} />
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
                    selectedSort === option.value
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedSort(option.value)
                  }
                >
                  <span>{option.label}</span>

                  {selectedSort === option.value && (
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
            onClick={resetFilters}
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className="shop-filter-card-footer">
          <span>Refine your shopping experience</span>
        </div>
      </div>
    );
  }

  if (mobile) {
    return (
      <>
        <Button
          type="button"
          className="shop-mobile-filter-button"
          onClick={() => setShowMobile(true)}
        >
          <SlidersHorizontal size={17} />
          Filters
        </Button>

        <Offcanvas
          show={showMobile}
          onHide={() => setShowMobile(false)}
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="fw-bold">
              ShopFlow Filters
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body className="p-0">
            <FilterContent />
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }

  return <FilterContent />;
}
