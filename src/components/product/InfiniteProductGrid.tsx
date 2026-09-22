"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, PackageCheck } from "lucide-react";
import { ProductCard, type ProductCardData } from "./ProductCard";

interface InfiniteProductGridProps {
  initialItems: ProductCardData[];
  initialTotal: number;
  initialTotalPages: number;
  pageSize: number;
  // The filter/sort/search query to keep applying as more pages load.
  // Page number is appended automatically — don't include it here.
  query: Record<string, string | undefined>;
}

export function InfiniteProductGrid({
  initialItems,
  initialTotal,
  initialTotalPages,
  pageSize,
  query,
}: InfiniteProductGridProps) {
  const [items, setItems] = useState<ProductCardData[]>(initialItems);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);

  const hasMore = page < totalPages;

  const loadNextPage = useCallback(async () => {
    if (isLoadingRef.current || page >= totalPages) {
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    setHasFailed(false);

    const nextPage = page + 1;

    try {
      const params = new URLSearchParams();

      Object.entries(query).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      params.set("page", String(nextPage));
      params.set("pageSize", String(pageSize));

      const response = await fetch(`/api/products?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      setItems((current) => [...current, ...data.items]);
      setTotalPages(data.totalPages);
      setPage(nextPage);
    } catch {
      setHasFailed(true);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [page, totalPages, pageSize, query]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadNextPage();
        }
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, loadNextPage]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="shop-infinite-grid-wrapper">
      <div className="shop-product-grid">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div ref={sentinelRef} className="shop-infinite-sentinel" aria-hidden="true" />

      {isLoading && (
        <div className="shop-infinite-status">
          <Loader2 size={18} className="shop-infinite-spinner" />
          <span>Loading more products...</span>
        </div>
      )}

      {hasFailed && (
        <div className="shop-infinite-status shop-infinite-status-error">
          <span>Couldn&apos;t load more products.</span>

          <button type="button" onClick={loadNextPage} className="shop-infinite-retry">
            Retry
          </button>
        </div>
      )}

      {!hasMore && !isLoading && items.length > 0 && (
        <div className="shop-infinite-end">
          <PackageCheck size={16} />
          <span>
            You&apos;ve seen all {initialTotal} product
            {initialTotal === 1 ? "" : "s"}
          </span>
        </div>
      )}
    </div>
  );
}
