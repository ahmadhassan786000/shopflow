"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Ticket,
  Star,
  LogOut,
  Images,
} from "lucide-react";

const links = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: FolderTree,
  },
  {
  href: "/admin/sliders",
  label: "Sliders",
  icon: Images,
},
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/admin/coupons",
    label: "Coupons",
    icon: Ticket,
  },
  {
    href: "/admin/reviews",
    label: "Reviews",
    icon: Star,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await signOut({
      redirectTo: "/",
    });
  }

  return (
    <nav
      className="bg-dark text-light p-3 h-100 d-flex flex-column"
      style={{ minWidth: 220 }}
    >
      <p className="fw-bold fs-5 mb-4 px-2">
        ShopFlow Admin
      </p>

      <ul className="nav nav-pills flex-column gap-1">
        {links.map(
          ({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/admin" &&
                pathname.startsWith(href));

            return (
              <li
                className="nav-item"
                key={href}
              >
                <Link
                  href={href}
                  className={`nav-link d-flex align-items-center gap-2 ${
                    active
                      ? "active"
                      : "text-light"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </li>
            );
          },
        )}
      </ul>

      {/* LOGOUT */}
      <div className="mt-3 pt-3 border-top border-secondary">
        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-link nav-link text-light d-flex align-items-center gap-2 w-100 text-start px-3"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
}