"use client";

import Link from "next/link";
import { Pagination as BsPagination } from "react-bootstrap";
import { useSearchParams, usePathname } from "next/navigation";
import { PackageOpen } from "lucide-react";

export function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function hrefFor(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
  );

  return (
    <BsPagination className="justify-content-center mt-4">
      <BsPagination.Prev as={Link as never} href={hrefFor(Math.max(1, currentPage - 1))} disabled={currentPage === 1} />
      {pages.map((p, i) => (
        <>
          {i > 0 && pages[i - 1] !== p - 1 && <BsPagination.Ellipsis key={`e-${p}`} disabled />}
          <BsPagination.Item key={p} active={p === currentPage} as={Link as never} href={hrefFor(p)}>
            {p}
          </BsPagination.Item>
        </>
      ))}
      <BsPagination.Next as={Link as never} href={hrefFor(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} />
    </BsPagination>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="text-center py-5 text-muted">
      <PackageOpen size={48} className="mb-3 opacity-50" />
      <h5>{title}</h5>
      {description && <p className="small">{description}</p>}
    </div>
  );
}
