import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  CreditCard,
  Package,
  CalendarDays,
  Hash,
  CheckCircle2,
  Clock3,
  CircleDot,
  Truck,
  Ban,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { Card, CardBody } from "react-bootstrap";
import { getOrderById } from "@/services/orderService";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";

export const metadata = {
  title: "Order Details",
};

const STATUS_STEPS = [
  {
    key: "PENDING",
    label: "Pending",
    icon: Clock3,
  },
  {
    key: "CONFIRMED",
    label: "Confirmed",
    icon: CheckCircle2,
  },
  {
    key: "PROCESSING",
    label: "Processing",
    icon: Package,
  },
  {
    key: "SHIPPED",
    label: "Shipped",
    icon: Truck,
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    icon: CheckCircle2,
  },
];

const FINAL_STATUSES = {
  CANCELLED: {
    label: "Cancelled",
    icon: Ban,
  },
  REFUNDED: {
    label: "Refunded",
    icon: RotateCcw,
  },
} as const;

function getStatusClass(status: string) {
  return status.toLowerCase();
}

function getStatusLabel(status: string) {
  if (status === "CANCELLED") return "Cancelled";
  if (status === "REFUNDED") return "Refunded";

  const step = STATUS_STEPS.find(
    (item) => item.key === status,
  );

  return step?.label ?? status;
}

function getStatusProgress(status: string) {
  return STATUS_STEPS.findIndex(
    (step) => step.key === status,
  );
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const shippingAddress = order.shippingAddress;
  const billingAddress = order.billingAddress;

  const currentProgress = getStatusProgress(
    order.status,
  );

  const isFinalStatus =
    order.status === "CANCELLED" ||
    order.status === "REFUNDED";

  const finalStatus =
    FINAL_STATUSES[
      order.status as keyof typeof FINAL_STATUSES
    ];

  return (
    <div className="shop-admin-order-detail">
      {/* Back */}
      <Link
        href="/admin/orders"
        className="shop-admin-order-back"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="shop-admin-order-detail-header">
        <div>
          <div className="shop-admin-page-eyebrow">
            ORDER MANAGEMENT
          </div>

          <div className="shop-admin-order-title-row">
            <h1>
              Order {order.orderNumber}
            </h1>

            <span
              className={`shop-admin-order-main-status ${getStatusClass(
                order.status,
              )}`}
            >
              <CircleDot size={13} />
              {getStatusLabel(order.status)}
            </span>
          </div>

          <div className="shop-admin-order-meta">
            <span>
              <CalendarDays size={14} />
              {new Date(
                order.createdAt,
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>

            <span className="shop-admin-order-meta-divider">
              •
            </span>

            <span>
              <Hash size={14} />
              {order.orderNumber}
            </span>
          </div>
        </div>

        <div className="shop-admin-order-action">
          <OrderStatusUpdater
            orderId={order.id}
            currentStatus={order.status}
          />
        </div>
      </div>

      {/* Status Timeline */}
      <Card className="shop-admin-order-status-card border-0">
        <CardBody>
          <div className="shop-admin-section-heading">
            <div>
              <h2>Order Status</h2>
              <p>
                Track the current stage of this order.
              </p>
            </div>
          </div>

          {isFinalStatus && finalStatus ? (
            <div
              className={`shop-admin-final-status ${getStatusClass(
                order.status,
              )}`}
            >
              <div className="shop-admin-final-status-icon">
                {(() => {
                  const Icon = finalStatus.icon;
                  return <Icon size={24} />;
                })()}
              </div>

              <div>
                <strong>
                  Order {finalStatus.label}
                </strong>

                <span>
                  This order is currently marked as{" "}
                  {finalStatus.label.toLowerCase()}.
                </span>
              </div>
            </div>
          ) : (
            <div className="shop-admin-order-stepper">
              {STATUS_STEPS.map(
                (step, index) => {
                  const Icon = step.icon;

                  const isCompleted =
                    index < currentProgress;

                  const isCurrent =
                    index === currentProgress;

                  return (
                    <div
                      key={step.key}
                      className={`shop-admin-order-step ${
                        isCompleted
                          ? "completed"
                          : ""
                      } ${
                        isCurrent
                          ? "current"
                          : ""
                      }`}
                    >
                      <div className="shop-admin-order-step-top">
                        <div className="shop-admin-order-step-icon">
                          <Icon size={17} />
                        </div>

                        {index <
                          STATUS_STEPS.length -
                            1 && (
                          <div
                            className={`shop-admin-order-step-line ${
                              isCompleted
                                ? "completed"
                                : ""
                            }`}
                          />
                        )}
                      </div>

                      <div className="shop-admin-order-step-label">
                        <strong>
                          {step.label}
                        </strong>

                        <span>
                          {isCurrent
                            ? "Current status"
                            : isCompleted
                              ? "Completed"
                              : "Upcoming"}
                        </span>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Main Content */}
      <div className="shop-admin-order-layout">
        {/* Left */}
        <div className="shop-admin-order-main">
          {/* Customer */}
          <Card className="shop-admin-order-card border-0">
            <CardBody>
              <div className="shop-admin-card-heading">
                <div className="shop-admin-card-heading-icon">
                  <User size={18} />
                </div>

                <div>
                  <h2>Customer</h2>
                  <p>Customer information</p>
                </div>
              </div>

              <div className="shop-admin-customer-box">
                <div className="shop-admin-customer-avatar">
                  {order.user.name
                    ?.charAt(0)
                    .toUpperCase() ?? "U"}
                </div>

                <div>
                  <strong>
                    {order.user.name}
                  </strong>

                  <span>
                    {order.user.email}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Addresses */}
          <div className="shop-admin-address-grid">
            {/* Shipping */}
            <Card className="shop-admin-order-card border-0">
              <CardBody>
                <div className="shop-admin-card-heading">
                  <div className="shop-admin-card-heading-icon shipping">
                    <MapPin size={18} />
                  </div>

                  <div>
                    <h2>Shipping Address</h2>
                    <p>Delivery destination</p>
                  </div>
                </div>

                <div className="shop-admin-address-content">
                  <strong>
                    {shippingAddress.fullName}
                  </strong>

                  <span className="shop-admin-address-phone">
                    <Phone size={13} />
                    {shippingAddress.phone}
                  </span>

                  <div className="shop-admin-address-text">
                    {shippingAddress.line1}

                    {shippingAddress.line2 && (
                      <>
                        <br />
                        {shippingAddress.line2}
                      </>
                    )}

                    <br />

                    {shippingAddress.city},{" "}
                    {shippingAddress.state}{" "}
                    {shippingAddress.postalCode}

                    <br />

                    {shippingAddress.country}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Billing */}
            <Card className="shop-admin-order-card border-0">
              <CardBody>
                <div className="shop-admin-card-heading">
                  <div className="shop-admin-card-heading-icon billing">
                    <CreditCard size={18} />
                  </div>

                  <div>
                    <h2>Billing Address</h2>
                    <p>Payment billing information</p>
                  </div>
                </div>

                <div className="shop-admin-address-content">
                  <strong>
                    {billingAddress.fullName}
                  </strong>

                  <span className="shop-admin-address-phone">
                    <Phone size={13} />
                    {billingAddress.phone}
                  </span>

                  <div className="shop-admin-address-text">
                    {billingAddress.line1}

                    {billingAddress.line2 && (
                      <>
                        <br />
                        {billingAddress.line2}
                      </>
                    )}

                    <br />

                    {billingAddress.city},{" "}
                    {billingAddress.state}{" "}
                    {billingAddress.postalCode}

                    <br />

                    {billingAddress.country}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Items */}
          <Card className="shop-admin-order-card border-0">
            <CardBody className="p-0">
              <div className="shop-admin-card-heading shop-admin-card-heading-padding">
                <div className="shop-admin-card-heading-icon items">
                  <Package size={18} />
                </div>

                <div>
                  <h2>Order Items</h2>
                  <p>
                    {order.items.length}{" "}
                    {order.items.length === 1
                      ? "product"
                      : "products"}{" "}
                    in this order
                  </p>
                </div>
              </div>

              <div className="shop-admin-items-list">
                {order.items.map(
                  (item, index) => (
                    <div
                      key={item.id}
                      className="shop-admin-item"
                    >
                      <div className="shop-admin-item-number">
                        {String(index + 1).padStart(
                          2,
                          "0",
                        )}
                      </div>

                      <div className="shop-admin-item-info">
                        <strong>
                          {item.productName}
                        </strong>

                        <span>
                          Unit price:{" "}
                          {formatCurrency(
                            item.unitPrice.toString(),
                          )}
                        </span>
                      </div>

                      <div className="shop-admin-item-quantity">
                        × {item.quantity}
                      </div>

                      <div className="shop-admin-item-price">
                        {formatCurrency(
                          (
                            Number(
                              item.unitPrice,
                            ) *
                            item.quantity
                          ).toString(),
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right */}
        <aside className="shop-admin-order-sidebar">
          <Card className="shop-admin-summary-card border-0">
            <CardBody>
              <div className="shop-admin-summary-header">
                <div>
                  <h2>Order Summary</h2>
                  <p>Payment breakdown</p>
                </div>

                <div className="shop-admin-summary-icon">
                  <CreditCard size={18} />
                </div>
              </div>

              <div className="shop-admin-summary-lines">
                <div>
                  <span>Subtotal</span>
                  <strong>
                    {formatCurrency(
                      order.subtotal.toString(),
                    )}
                  </strong>
                </div>

                <div>
                  <span>Discount</span>
                  <strong className="discount">
                    -{" "}
                    {formatCurrency(
                      order.discountTotal.toString(),
                    )}
                  </strong>
                </div>

                <div>
                  <span>Shipping</span>
                  <strong>
                    {formatCurrency(
                      order.shippingTotal.toString(),
                    )}
                  </strong>
                </div>
              </div>

              <div className="shop-admin-summary-divider" />

              <div className="shop-admin-summary-total">
                <div>
                  <span>Total</span>
                  <small>Order Grand Total</small>
                </div>

                <strong>
                  {formatCurrency(
                    order.grandTotal.toString(),
                  )}
                </strong>
              </div>
            </CardBody>
          </Card>

          <Card className="shop-admin-info-card border-0">
            <CardBody>
              <div className="shop-admin-info-row">
                <div>
                  <span>Order Number</span>
                  <strong>
                    {order.orderNumber}
                  </strong>
                </div>

                <Hash size={16} />
              </div>

              <div className="shop-admin-info-row">
                <div>
                  <span>Order Date</span>
                  <strong>
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
                  </strong>
                </div>

                <CalendarDays size={16} />
              </div>

              <div className="shop-admin-info-row">
                <div>
                  <span>Customer</span>
                  <strong>
                    {order.user.name}
                  </strong>
                </div>

                <User size={16} />
              </div>

              <Link
                href="/admin/orders"
                className="shop-admin-back-orders"
              >
                View all orders
                <ChevronRight size={15} />
              </Link>
            </CardBody>
          </Card>
        </aside>
      </div>
    </div>
  );
}