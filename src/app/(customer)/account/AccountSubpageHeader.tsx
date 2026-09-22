import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function AccountSubpageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="shop-account-subpage-header">
      <Link href="/account" className="shop-account-back-link">
        <ChevronLeft size={16} />
        Back to Account
      </Link>

      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
