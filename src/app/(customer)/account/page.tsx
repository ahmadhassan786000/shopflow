import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  UserRound,
  KeyRound,
  MapPin,
  Package,
  Heart,
  Headphones,
  LogOut,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "Account Settings",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [user, addressCount, orderCount, wishlistCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    }),

    prisma.address.count({ where: { userId } }),
    prisma.order.count({ where: { userId } }),
    prisma.wishlistItem.count({ where: { wishlist: { userId } } }).catch(() => 0),
  ]);

  if (!user) {
    redirect("/login");
  }

  const initial = user.name?.trim()?.[0]?.toUpperCase() ?? "U";

  const menuItems = [
    {
      href: "/account/profile",
      icon: <UserRound size={19} />,
      iconClass: "profile",
      title: "Edit Profile",
      description: "Update your name and personal details",
    },
    {
      href: "/account/password",
      icon: <KeyRound size={19} />,
      iconClass: "password",
      title: "Change Password",
      description: "Keep your account secure",
    },
    {
      href: "/account/addresses",
      icon: <MapPin size={19} />,
      iconClass: "address",
      title: "Saved Addresses",
      description: `${addressCount} address${addressCount === 1 ? "" : "es"} saved`,
    },
    {
      href: "/orders",
      icon: <Package size={19} />,
      iconClass: "orders",
      title: "My Orders",
      description: `${orderCount} order${orderCount === 1 ? "" : "s"} placed`,
    },
    {
      href: "/wishlist",
      icon: <Heart size={19} />,
      iconClass: "wishlist",
      title: "My Wishlist",
      description: `${wishlistCount} item${wishlistCount === 1 ? "" : "s"} saved`,
    },
    {
      href: "/contact",
      icon: <Headphones size={19} />,
      iconClass: "support",
      title: "Contact Support",
      description: "Get help from our team",
    },
  ];

  return (
    <div className="shop-account-page">
      <div className="shop-account-simple-header">
        <h1>Account Settings</h1>
        <p>Manage your profile, orders and account security.</p>
      </div>

      <div className="shop-account-summary-card">
        <div className="shop-account-summary-avatar">{initial}</div>

        <div className="shop-account-summary-info">
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>
      </div>

      <nav className="shop-account-menu">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className="shop-account-menu-item">
            <span className={`shop-account-menu-icon ${item.iconClass}`}>{item.icon}</span>

            <span className="shop-account-menu-content">
              <strong>{item.title}</strong>
              <small>{item.description}</small>
            </span>

            <ChevronRight size={18} className="shop-account-menu-arrow" />
          </Link>
        ))}
      </nav>

      <section className="shop-account-logout">
        <div className="shop-account-logout-content">
          <div className="shop-account-logout-icon">
            <LogOut size={19} />
          </div>

          <div>
            <h2>Sign out</h2>
            <p>End your current ShopFlow session.</p>
          </div>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className="shop-account-logout-button">
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </form>
      </section>
    </div>
  );
}
