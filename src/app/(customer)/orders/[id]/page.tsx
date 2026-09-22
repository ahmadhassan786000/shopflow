import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge, Row, Col } from "react-bootstrap";
import { auth } from "@/lib/auth";
import { getOrderById } from "@/services/orderService";
import { formatCurrency } from "@/lib/utils";
import {
  Package,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock3,
  Truck,
  ShoppingBag,
} from "lucide-react";

const STATUS_STEPS = [
  {
    key: "PENDING",
    label: "Order placed",
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

const STATUS_VARIANT: Record<string, string> = {
  PENDING: "secondary",
  PAID: "info",
  PROCESSING: "primary",
  SHIPPED: "warning",
  DELIVERED: "success",
  CANCELLED: "danger",
  REFUNDED: "dark",
};

export const metadata = {
  title: "Order Details",
};

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ placed?: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  const { placed } = await searchParams;

  const order = await getOrderById(
    id,
    session!.user.id,
  );

  if (!order) {
    notFound();
  }

  const currentStepIndex = STATUS_STEPS.findIndex(
    (step) => step.key === order.status,
  );

  const isCancelled =
    order.status === "CANCELLED" ||
    order.status === "REFUNDED";

  return (
    <div className="shop-order-detail-page">

      {placed === "true" && (
        <div className="shop-order-success">
          <div className="shop-order-success-icon">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <strong>Order placed successfully!</strong>
            <p>
              Thank you for shopping with ShopFlow.
            </p>
          </div>
        </div>
      )}

      <div className="shop-order-header">

        <div>
          <div className="shop-order-breadcrumb">
            <ShoppingBag size={15} />
            <span>My Orders</span>
            <span>/</span>
            <span>Order Details</span>
          </div>

          <h1>
            Order #{order.orderNumber}
          </h1>

          <p>
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
          </p>
        </div>

        <Badge
          bg={STATUS_VARIANT[order.status] ?? "secondary"}
          className="shop-order-status"
        >
          {order.status}
        </Badge>

      </div>

      {!isCancelled && (
        <section className="shop-order-progress">

          <div className="shop-order-progress-line" />

          {STATUS_STEPS.map((step, index) => {
            const Icon = step.icon;

            const completed =
              index <= currentStepIndex;

            return (
              <div
                key={step.key}
                className={`shop-order-progress-step ${
                  completed ? "completed" : ""
                }`}
              >
                <div className="shop-order-progress-icon">
                  <Icon size={17} />
                </div>

                <span>
                  {step.label}
                </span>
              </div>
            );
          })}

        </section>
      )}

      <Row className="g-4">

        <Col lg={7}>

          <section className="shop-order-card">

            <div className="shop-order-card-header">
              <div className="shop-order-card-icon">
                <Package size={19} />
              </div>

              <div>
                <h2>Order Items</h2>
                <p>
                  {order.items.length}{" "}
                  {order.items.length === 1
                    ? "item"
                    : "items"}{" "}
                  in this order
                </p>
              </div>
            </div>

            <div className="shop-order-items">

              {order.items.map((item) => (

                <div
                  key={item.id}
                  className="shop-order-item"
                >

                  <div className="shop-order-product-image">

                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.productName}
                        fill
                        sizes="80px"
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Package size={24} />
                    )}

                  </div>

                  <div className="shop-order-product-info">

                    <h3>
                      {item.productName}
                    </h3>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                    <span>
                      {formatCurrency(
                        item.unitPrice.toString(),
                      )}{" "}
                      each
                    </span>

                  </div>

                  <div className="shop-order-item-total">
                    {formatCurrency(
                      (
                        Number(item.unitPrice) *
                        item.quantity
                      ).toString(),
                    )}
                  </div>

                </div>

              ))}

            </div>

          </section>

          <section className="shop-order-card">

            <div className="shop-order-card-header">
              <div className="shop-order-card-icon address">
                <MapPin size={19} />
              </div>

              <div>
                <h2>Shipping Address</h2>
                <p>
                  Your order will be delivered here
                </p>
              </div>
            </div>

            <div className="shop-order-address">

              <strong>
                {order.shippingAddress.fullName}
              </strong>

              <p>
                {order.shippingAddress.line1}

                {order.shippingAddress.line2 && (
                  <>
                    <br />
                    {order.shippingAddress.line2}
                  </>
                )}

                <br />

                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}

                <br />

                {order.shippingAddress.country}
              </p>

            </div>

          </section>

        </Col>

        <Col lg={5}>

          <section className="shop-order-card shop-order-summary">

            <div className="shop-order-card-header">

              <div className="shop-order-card-icon payment">
                <CreditCard size={19} />
              </div>

              <div>
                <h2>Order Summary</h2>
                <p>
                  Payment & order total
                </p>
              </div>

            </div>

            <div className="shop-order-summary-lines">

              <div>
                <span>Subtotal</span>
                <strong>
                  {formatCurrency(
                    order.subtotal.toString(),
                  )}
                </strong>
              </div>

              {Number(order.discountTotal) > 0 && (
                <div className="discount">
                  <span>Discount</span>
                  <strong>
                    -
                    {formatCurrency(
                      order.discountTotal.toString(),
                    )}
                  </strong>
                </div>
              )}

              <div>
                <span>Shipping</span>
                <strong>
                  {formatCurrency(
                    order.shippingTotal.toString(),
                  )}
                </strong>
              </div>

              {Number(order.taxTotal) > 0 && (
                <div>
                  <span>Tax</span>
                  <strong>
                    {formatCurrency(
                      order.taxTotal.toString(),
                    )}
                  </strong>
                </div>
              )}

            </div>

            <div className="shop-order-total">

              <span>Total</span>

              <strong>
                {formatCurrency(
                  order.grandTotal.toString(),
                )}
              </strong>

            </div>

            <div className="shop-order-payment">

              <div className="shop-order-payment-icon">
                <CreditCard size={17} />
              </div>

              <div>
                <span>Payment method</span>
                <strong>Cash on Delivery</strong>
              </div>

            </div>

          </section>

        </Col>

      </Row>

    </div>
  );
}







