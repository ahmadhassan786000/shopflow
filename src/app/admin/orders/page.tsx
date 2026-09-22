import Link from "next/link";
import {
  ClipboardList,
  Clock3,
  CircleCheck,
  Package,
  Truck,
  CheckCircle2,
  Ban,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { getAllOrdersForAdmin } from "@/services/orderService";
import { Pagination } from "@/components/ui/Pagination";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";

export const metadata = {
  title: "Manage Orders",
};

const ORDER_STATUS_TABS = [
  {
    key: "ALL",
    label: "All Orders",
    icon: ClipboardList,
    color: "all",
  },
  {
    key: "PENDING",
    label: "Pending",
    icon: Clock3,
    color: "pending",
  },
  {
    key: "CONFIRMED",
    label: "Confirmed",
    icon: CircleCheck,
    color: "confirmed",
  },
  {
    key: "PROCESSING",
    label: "Processing",
    icon: Package,
    color: "processing",
  },
  {
    key: "SHIPPED",
    label: "Shipped",
    icon: Truck,
    color: "shipped",
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    icon: CheckCircle2,
    color: "delivered",
  },
  {
    key: "CANCELLED",
    label: "Cancelled",
    icon: Ban,
    color: "cancelled",
  },
  {
    key: "REFUNDED",
    label: "Refunded",
    icon: RotateCcw,
    color: "refunded",
  },
] as const;

function getStatusCount(
  status: string,
  counts: {
    PENDING: number;
    CONFIRMED: number;
    PROCESSING: number;
    SHIPPED: number;
    DELIVERED: number;
    CANCELLED: number;
    REFUNDED: number;
  },
  total: number,
) {
  if (status === "ALL") {
    return total;
  }

  return counts[
    status as keyof typeof counts
  ] ?? 0;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;

  const page = Math.max(
    1,
    Number(params.page ?? 1),
  );

  const requestedStatus =
    params.status?.toUpperCase() ?? "ALL";

  const validStatuses = ORDER_STATUS_TABS.map(
    (tab) => tab.key,
  );

  const activeStatus = validStatuses.includes(
    requestedStatus as (typeof ORDER_STATUS_TABS)[number]["key"],
  )
    ? requestedStatus
    : "ALL";

  const statusFilter =
    activeStatus === "ALL"
      ? undefined
      : (activeStatus as
          | "PENDING"
          | "CONFIRMED"
          | "PROCESSING"
          | "SHIPPED"
          | "DELIVERED"
          | "CANCELLED"
          | "REFUNDED");

  const {
    items,
    total,
    totalPages,
    statusCounts,
  } = await getAllOrdersForAdmin(
    page,
    20,
    statusFilter,
  );

  const activeTab = ORDER_STATUS_TABS.find(
    (tab) => tab.key === activeStatus,
  );

  return (
    <>
      <div className="shop-admin-orders-header">
        <div>
          <div className="shop-admin-page-eyebrow">
            SHOPFLOW ADMIN
          </div>

          <h1>Manage Orders</h1>

          <p>
            Monitor orders, update their status and
            manage the complete order workflow.
          </p>
        </div>

        <div className="shop-admin-orders-total">
          <ClipboardList size={18} />
          <div>
            <strong>{total}</strong>
            <span>
              {activeStatus === "ALL"
                ? "Total Orders"
                : `${activeTab?.label} Orders`}
            </span>
          </div>
        </div>
      </div>

      <section className="shop-order-status-tabs">
        <div className="shop-order-status-tabs-scroll">
          {ORDER_STATUS_TABS.map((tab) => {
            const Icon = tab.icon;
            const count = getStatusCount(
              tab.key,
              statusCounts,
              Object.values(statusCounts).reduce(
                (sum, value) => sum + value,
                0,
              ),
            );

            const isActive =
              activeStatus === tab.key;

            const href =
              tab.key === "ALL"
                ? "/admin/orders"
                : `/admin/orders?status=${tab.key}`;

            return (
              <Link
                key={tab.key}
                href={href}
                className={`shop-order-status-tab ${
                  isActive
                    ? "active"
                    : ""
                } shop-order-status-${tab.color}`}
              >
                <span className="shop-order-status-icon">
                  <Icon size={17} />
                </span>

                <span className="shop-order-status-info">
                  <strong>{tab.label}</strong>
                  <small>
                    {count}{" "}
                    {count === 1
                      ? "order"
                      : "orders"}
                  </small>
                </span>

                <span className="shop-order-status-count">
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="shop-admin-orders-panel">
        <div className="shop-admin-orders-panel-header">
          <div>
            <h2>
              {activeTab?.label}
            </h2>

            <p>
              {total === 0
                ? "No orders found in this section."
                : `Showing ${total} ${
                    total === 1
                      ? "order"
                      : "orders"
                  }`}
            </p>
          </div>

          <div className="shop-admin-orders-panel-icon">
            {activeTab &&
              (() => {
                const Icon = activeTab.icon;
                return <Icon size={20} />;
              })()}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="shop-admin-orders-empty">
            <div className="shop-admin-orders-empty-icon">
              <ClipboardList size={28} />
            </div>

            <h3>No orders here</h3>

            <p>
              There are currently no orders with
              this status.
            </p>

            {activeStatus !== "ALL" && (
              <Link
                href="/admin/orders"
                className="shop-admin-orders-empty-link"
              >
                View all orders
                <ChevronRight size={15} />
              </Link>
            )}
          </div>
        ) : (
          <div className="shop-admin-orders-table-wrap">
            <table className="shop-admin-orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {items.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="shop-admin-order-number"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>

                    <td>
                      <div className="shop-admin-order-customer">
                        <strong>
                          {order.user.name}
                        </strong>

                        <span>
                          {order.user.email}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="shop-admin-order-date">
                        {new Date(
                          order.createdAt,
                        ).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </td>

                    <td>
                      <OrderStatusUpdater
                        orderId={order.id}
                        currentStatus={
                          order.status
                        }
                      />
                    </td>

                    <td>
                      <strong className="shop-admin-order-total">
                        {formatCurrency(
                          order.grandTotal.toString(),
                        )}
                      </strong>
                    </td>

                    <td>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="shop-admin-order-view"
                      >
                        View
                        <ChevronRight
                          size={14}
                        />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <div className="shop-admin-orders-pagination">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
          />
        </div>
      )}
    </>
  );
}