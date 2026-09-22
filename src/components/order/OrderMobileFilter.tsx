"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import {
  Check,
  CheckCircle2,
  Clock3,
  ListFilter,
  Package,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";

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

interface OrderMobileFilterProps {
  activeStatus: string;
  allOrdersCount: number;
  statusCounts: Record<string, number>;
}

export default function OrderMobileFilter({
  activeStatus,
  allOrdersCount,
  statusCounts,
}: OrderMobileFilterProps) {
  const [showMobile, setShowMobile] = useState(false);

  return (
    <div className="shop-mobile-filter shop-orders-mobile-filter">
      <Button
        type="button"
        className="shop-mobile-filter-button shop-orders-mobile-filter-button"
        onClick={() => setShowMobile(true)}
      >
        <ListFilter size={17} />
        <span>Filters</span>

        {activeStatus !== "ALL" && (
          <span className="shop-mobile-filter-count">
            1
          </span>
        )}
      </Button>

      <Offcanvas
        show={showMobile}
        onHide={() => setShowMobile(false)}
        placement="start"
        className="shop-mobile-filter-offcanvas shop-orders-mobile-offcanvas"
      >
        <div className="shop-orders-offcanvas-header">
          <div className="shop-orders-offcanvas-brand">
            <div className="shop-orders-offcanvas-logo">
              <ShoppingBag size={18} />
            </div>

            <div>
              <span>SHOPFLOW</span>
              <strong>Order Filters</strong>
            </div>
          </div>

          <button
            type="button"
            className="shop-orders-offcanvas-close"
            aria-label="Close order filters"
            title="Close"
            onClick={() => setShowMobile(false)}
          >
            <X size={17} />
          </button>
        </div>

        <Offcanvas.Body className="p-0">
          <div className="shop-orders-mobile-filter-card">
            <div className="shop-orders-mobile-filter-card-header">
              <div className="shop-orders-mobile-filter-title">
                <div className="shop-orders-mobile-filter-icon">
                  <ListFilter size={19} />
                </div>

                <div>
                  <span>REFINE ORDERS</span>
                  <h3>Order Status</h3>
                </div>
              </div>

              {activeStatus !== "ALL" && (
                <div className="shop-active-filter-badge">
                  1 filter active
                </div>
              )}
            </div>

            <div className="shop-orders-mobile-status-list">
              <Link
                href="/orders"
                className={
                  activeStatus === "ALL" ? "active" : ""
                }
                onClick={() => setShowMobile(false)}
              >
                <span>
                  <ShoppingBag size={15} />
                  All Orders
                </span>

                <span className="shop-orders-mobile-status-right">
                  <strong>{allOrdersCount}</strong>

                  {activeStatus === "ALL" && (
                    <Check size={15} />
                  )}
                </span>
              </Link>

              {ORDER_STATUSES.map((status) => (
                <Link
                  key={status}
                  href={`/orders?status=${status}`}
                  className={
                    activeStatus === status ? "active" : ""
                  }
                  onClick={() => setShowMobile(false)}
                >
                  <span>
                    {getStatusIcon(status)}
                    {STATUS_LABEL[status]}
                  </span>

                  <span className="shop-orders-mobile-status-right">
                    <strong>
                      {statusCounts[status] ?? 0}
                    </strong>

                    {activeStatus === status && (
                      <Check size={15} />
                    )}
                  </span>
                </Link>
              ))}
            </div>

            <div className="shop-orders-mobile-filter-footer">
              Select a status to view matching orders
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}