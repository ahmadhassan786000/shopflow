import Link from "next/link";
import { Badge } from "react-bootstrap";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Package,
  ShoppingBag,
  Truck,
  ListFilter,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { getOrdersForUser } from "@/services/orderService";
import { formatCurrency } from "@/lib/utils";
import OrderMobileFilter from "@/components/order/OrderMobileFilter";

const STATUS_LABEL: Record<string, string> = {
  ALL: "All Orders",
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

const STATUS_VARIANT: Record<string, string> = {
  PENDING: "secondary",
  CONFIRMED: "info",
  PROCESSING: "primary",
  SHIPPED: "warning",
  DELIVERED: "success",
  CANCELLED: "danger",
  REFUNDED: "dark",
};

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

function getStatusIcon(status: string) {
  switch (status) {
    case "CONFIRMED":
    case "DELIVERED":
      return <CheckCircle2 size={16} />;

    case "PROCESSING":
      return <Package size={16} />;

    case "SHIPPED":
      return <Truck size={16} />;

    default:
      return <Clock3 size={16} />;
  }
}

export const metadata = {
  title: "My Orders",
};

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function OrdersPage({
  searchParams,
}: OrdersPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const params = await searchParams;

  const requestedStatus =
    params.status?.toUpperCase() ?? "ALL";

  const activeStatus =
    requestedStatus === "ALL" ||
    ORDER_STATUSES.includes(
      requestedStatus as (typeof ORDER_STATUSES)[number],
    )
      ? requestedStatus
      : "ALL";

  const allOrders = await getOrdersForUser(
    session.user.id,
  );

  const statusCounts = ORDER_STATUSES.reduce(
    (counts, status) => {
      counts[status] = allOrders.filter(
        (order) => order.status === status,
      ).length;

      return counts;
    },
    {} as Record<string, number>,
  );

  const orders =
    activeStatus === "ALL"
      ? allOrders
      : allOrders.filter(
          (order) => order.status === activeStatus,
        );

  const activeLabel =
    STATUS_LABEL[activeStatus] ?? "All Orders";

  return (
    <div className="shop-orders-page">
      <div className="shop-orders-header">
        <div>
          <div className="shop-orders-eyebrow">
            <ShoppingBag size={15} />
            <span>ACCOUNT</span>
          </div>

          <h1>My Orders</h1>

          <p>
            Track all your orders and check their current status.
          </p>
        </div>

        <div className="shop-orders-count">
          <strong>{orders.length}</strong>
          <span>
            {orders.length === 1 ? "Order" : "Orders"}
          </span>
        </div>
      </div>

      <OrderMobileFilter
        activeStatus={activeStatus}
        allOrdersCount={allOrders.length}
        statusCounts={statusCounts}
      />

      <div className="shop-orders-layout">
        <aside className="shop-orders-sidebar">
          <div className="shop-orders-filter-card">
            <div className="shop-orders-filter-header">
              <div className="shop-orders-filter-icon">
                <ListFilter size={17} />
              </div>

              <div>
                <span>FILTER BY</span>
                <h3>Order Status</h3>
              </div>
            </div>

            <nav className="shop-orders-filter-list">
              <Link
                href="/orders"
                className={
                  activeStatus === "ALL" ? "active" : ""
                }
              >
                <span>
                  <ShoppingBag size={15} />
                  All Orders
                </span>

                <strong>{allOrders.length}</strong>
              </Link>

              {ORDER_STATUSES.map((status) => (
                <Link
                  key={status}
                  href={`/orders?status=${status}`}
                  className={
                    activeStatus === status ? "active" : ""
                  }
                >
                  <span>
                    {getStatusIcon(status)}
                    {STATUS_LABEL[status]}
                  </span>

                  <strong>
                    {statusCounts[status]}
                  </strong>
                </Link>
              ))}
            </nav>

            <div className="shop-orders-filter-footer">
              {allOrders.length}{" "}
              {allOrders.length === 1
                ? "order"
                : "orders"}{" "}
              in total
            </div>
          </div>
        </aside>

        <section className="shop-orders-results">
          <div className="shop-orders-results-header">
            <div>
              <span className="shop-orders-results-label">
                YOUR ORDERS
              </span>

              <h2>{activeLabel}</h2>

              <p>
                Showing {orders.length} of{" "}
                {allOrders.length} orders
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <section className="shop-orders-empty">
              <div className="shop-orders-empty-icon">
                <ShoppingBag size={28} />
              </div>

              <h2>
                {activeStatus === "ALL"
                  ? "No orders yet"
                  : `No ${activeLabel.toLowerCase()} orders`}
              </h2>

              <p>
                {activeStatus === "ALL"
                  ? "You have not placed any orders yet."
                  : "There are no orders with this status."}
              </p>

              <Link
                href="/products"
                className="shop-orders-shop-button"
              >
                Start Shopping
              </Link>
            </section>
          ) : (
            <div className="shop-orders-list">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="shop-orders-card"
                >
                  <div className="shop-orders-card-top">
                    <div>
                      <span className="shop-orders-card-label">
                        ORDER NUMBER
                      </span>

                      <h2>#{order.orderNumber}</h2>

                      <p>
                        {new Date(
                          order.createdAt,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <Badge
                      bg={
                        STATUS_VARIANT[order.status] ??
                        "secondary"
                      }
                      className="shop-orders-status"
                    >
                      {getStatusIcon(order.status)}

                      {STATUS_LABEL[order.status] ??
                        order.status}
                    </Badge>
                  </div>

                  <div className="shop-orders-divider" />

                  <div className="shop-orders-card-bottom">
                    <div className="shop-orders-meta">
                      <div>
                        <span>Items</span>

                        <strong>
                          {order.items.length}{" "}
                          {order.items.length === 1
                            ? "item"
                            : "items"}
                        </strong>
                      </div>

                      <div>
                        <span>Total</span>

                        <strong>
                          {formatCurrency(
                            order.grandTotal.toString(),
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Payment</span>

                        <strong>
                          Cash on Delivery
                        </strong>
                      </div>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="shop-orders-view-button"
                    >
                      <span>View Order</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}