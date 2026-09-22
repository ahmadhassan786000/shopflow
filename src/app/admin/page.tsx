import Link from "next/link";
import { Row, Col } from "react-bootstrap";
import {
  ArrowUpRight,
  ChevronRight,
  Package,
  ShoppingBag,
  Users,
  Star,
  ShoppingCart,
  Plus,
  Layers3,
  Tag,
  MessageSquare,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const [
    productCount,
    orderCount,
    userCount,
    pendingReviewCount,
    revenueAgg,
  ] = await Promise.all([
    prisma.product.count(),

    prisma.order.count(),

    prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    }),

    prisma.review.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.order.aggregate({
      _sum: {
        grandTotal: true,
      },
      where: {
        status: {
          in: [
            "CONFIRMED",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
          ],
        },
      },
    }),
  ]);

  const revenue = formatCurrency(
    revenueAgg._sum.grandTotal?.toString() ?? "0"
  );

  const stats = [
    {
      label: "Total Revenue",
      value: revenue,
      description: "From confirmed orders",
      icon: ShoppingBag,
      href: "/admin/orders",
      accent: "revenue",
    },
    {
      label: "Products",
      value: productCount,
      description: "Products in catalog",
      icon: Package,
      href: "/admin/products",
      accent: "products",
    },
    {
      label: "Customers",
      value: userCount,
      description: "Registered customers",
      icon: Users,
      href: "/admin/users",
      accent: "customers",
    },
    {
      label: "Pending Reviews",
      value: pendingReviewCount,
      description: "Awaiting moderation",
      icon: Star,
      href: "/admin/reviews",
      accent: "reviews",
    },
  ];

  const quickActions = [
    {
      title: "Add Product",
      description: "Create a new product",
      href: "/admin/products/new",
      icon: Plus,
    },
    {
      title: "Manage Orders",
      description: `${orderCount} total orders`,
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Categories",
      description: "Manage product categories",
      href: "/admin/categories",
      icon: Layers3,
    },
    {
      title: "Coupons",
      description: "Manage discount codes",
      href: "/admin/coupons",
      icon: Tag,
    },
  ];

  return (
    <div className="shop-dashboard">
      {/* Header */}
      <div className="shop-dashboard-header">
        <div>
          <div className="shop-dashboard-eyebrow">
            SHOPFLOW ADMIN
          </div>

          <h1 className="shop-dashboard-title">
            Dashboard
          </h1>

          <p className="shop-dashboard-subtitle">
            Welcome back. Here&apos;s what&apos;s happening with
            your store today.
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="shop-dashboard-view-orders"
        >
          View Orders
          <ArrowUpRight size={17} />
        </Link>
      </div>

      {/* KPI Cards */}
      <Row className="g-3 g-xl-4 mb-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Col
              key={stat.label}
              xs={12}
              sm={6}
              xl={3}
            >
              <Link
                href={stat.href}
                className="shop-dashboard-stat-link"
              >
                <div
                  className={`shop-dashboard-stat-card shop-dashboard-stat-${stat.accent}`}
                >
                  <div className="shop-dashboard-stat-top">
                    <div className="shop-dashboard-stat-icon">
                      <Icon size={21} strokeWidth={2} />
                    </div>

                    <div className="shop-dashboard-stat-arrow">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  <div className="shop-dashboard-stat-label">
                    {stat.label}
                  </div>

                  <div className="shop-dashboard-stat-value">
                    {stat.value}
                  </div>

                  <div className="shop-dashboard-stat-description">
                    {stat.description}
                  </div>
                </div>
              </Link>
            </Col>
          );
        })}
      </Row>

      {/* Overview */}
      <Row className="g-3 g-xl-4 mb-4">
        <Col lg={8}>
          <div className="shop-dashboard-panel h-100">
            <div className="shop-dashboard-panel-header">
              <div>
                <div className="shop-dashboard-panel-eyebrow">
                  STORE OVERVIEW
                </div>

                <h2 className="shop-dashboard-panel-title">
                  Store Performance
                </h2>
              </div>

              <div className="shop-dashboard-panel-icon">
                <ShoppingBag size={19} />
              </div>
            </div>

            <div className="shop-dashboard-overview-grid">
              <div className="shop-dashboard-overview-item">
                <div className="shop-dashboard-overview-icon">
                  <ShoppingCart size={19} />
                </div>

                <div>
                  <span className="shop-dashboard-overview-label">
                    Total Orders
                  </span>

                  <strong className="shop-dashboard-overview-value">
                    {orderCount}
                  </strong>
                </div>
              </div>

              <div className="shop-dashboard-overview-item">
                <div className="shop-dashboard-overview-icon">
                  <Users size={19} />
                </div>

                <div>
                  <span className="shop-dashboard-overview-label">
                    Customers
                  </span>

                  <strong className="shop-dashboard-overview-value">
                    {userCount}
                  </strong>
                </div>
              </div>

              <div className="shop-dashboard-overview-item">
                <div className="shop-dashboard-overview-icon">
                  <Package size={19} />
                </div>

                <div>
                  <span className="shop-dashboard-overview-label">
                    Products
                  </span>

                  <strong className="shop-dashboard-overview-value">
                    {productCount}
                  </strong>
                </div>
              </div>

              <div className="shop-dashboard-overview-item">
                <div className="shop-dashboard-overview-icon">
                  <Star size={19} />
                </div>

                <div>
                  <span className="shop-dashboard-overview-label">
                    Reviews Pending
                  </span>

                  <strong className="shop-dashboard-overview-value">
                    {pendingReviewCount}
                  </strong>
                </div>
              </div>
            </div>

            <div className="shop-dashboard-panel-footer">
              <span>
                Total orders placed across your store
              </span>

              <Link href="/admin/orders">
                Manage orders
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="shop-dashboard-panel h-100">
            <div className="shop-dashboard-panel-header">
              <div>
                <div className="shop-dashboard-panel-eyebrow">
                  QUICK ACTIONS
                </div>

                <h2 className="shop-dashboard-panel-title">
                  Manage Store
                </h2>
              </div>

              <div className="shop-dashboard-panel-icon">
                <Layers3 size={19} />
              </div>
            </div>

            <div className="shop-dashboard-actions">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="shop-dashboard-action"
                  >
                    <div className="shop-dashboard-action-icon">
                      <Icon size={18} />
                    </div>

                    <div className="shop-dashboard-action-content">
                      <strong>{action.title}</strong>
                      <span>{action.description}</span>
                    </div>

                    <ChevronRight
                      size={17}
                      className="shop-dashboard-action-arrow"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>

      {/* Bottom section */}
      <Row className="g-3 g-xl-4">
        <Col lg={8}>
          <div className="shop-dashboard-info-banner">
            <div className="shop-dashboard-info-icon">
              <MessageSquare size={21} />
            </div>

            <div className="shop-dashboard-info-content">
              <h3>Customer Reviews</h3>

              <p>
                {pendingReviewCount > 0
                  ? `You have ${pendingReviewCount} review${
                      pendingReviewCount === 1 ? "" : "s"
                    } waiting for moderation.`
                  : "There are currently no reviews waiting for moderation."}
              </p>
            </div>

            <Link
              href="/admin/reviews"
              className="shop-dashboard-info-link"
            >
              Review
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </Col>

        <Col lg={4}>
          <div className="shop-dashboard-total-card">
            <div className="shop-dashboard-total-icon">
              <ShoppingCart size={21} />
            </div>

            <div>
              <span>Total Orders Placed</span>
              <strong>{orderCount}</strong>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}