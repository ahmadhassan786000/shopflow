import Link from "next/link";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import BreadcrumbItem from "react-bootstrap/BreadcrumbItem";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbItem linkAs={Link} href="/">
        Home
      </BreadcrumbItem>

      {items.map((item, i) =>
        item.href && i < items.length - 1 ? (
          <BreadcrumbItem
            key={item.label}
            linkAs={Link}
            href={item.href}
          >
            {item.label}
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem key={item.label} active>
            {item.label}
          </BreadcrumbItem>
        ),
      )}
    </Breadcrumb>
  );
}