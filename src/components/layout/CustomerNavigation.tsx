"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Package,
  Heart,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";

const navigationItems = [
  {
    href: "/account",
    label: "Account",
    description: "Manage profile",
    icon: User,
  },
  {
    href: "/orders",
    label: "Orders",
    description: "Track purchases",
    icon: Package,
  },
  {
    href: "/wishlist",
    label: "Wishlist",
    description: "Saved products",
    icon: Heart,
  },
  {
    href: "/cart",
    label: "Cart",
    description: "Shopping cart",
    icon: ShoppingCart,
  },
];

export function CustomerNavigation() {
  const pathname = usePathname();

  return (
    <div className="shop-customer-navigation d-none d-lg-block">
      <div className="container">
        <nav
          className="shop-customer-nav-card"
          aria-label="Customer navigation"
        >
          <div className="shop-customer-nav-items">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shop-customer-nav-item ${
                    isActive ? "active" : ""
                  }`}
                >
                  <span className="shop-customer-nav-icon">
                    <Icon size={19} strokeWidth={2} />
                  </span>

                  <span className="shop-customer-nav-content">
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>

                  <ChevronRight
                    size={16}
                    className="shop-customer-nav-arrow"
                  />
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
