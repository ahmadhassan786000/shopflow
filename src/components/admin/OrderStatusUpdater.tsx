"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { updateOrderStatusAction } from "@/app/admin/orders/actions";

const STATUSES = [
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
  },
  {
    value: "PROCESSING",
    label: "Processing",
  },
  {
    value: "SHIPPED",
    label: "Shipped",
  },
  {
    value: "DELIVERED",
    label: "Delivered",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
  {
    value: "REFUNDED",
    label: "Refunded",
  },
];

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusUpdater({
  orderId,
  currentStatus,
}: OrderStatusUpdaterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(
    e: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const status = e.target.value;

    startTransition(async () => {
      const result = await updateOrderStatusAction(
        orderId,
        status,
      );

      if (result.success) {
        toast.success("Order status updated");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form.Select
      size="sm"
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      style={{ minWidth: "160px" }}
      aria-label={`Update order ${orderId} status`}
    >
      {STATUSES.map((status) => (
        <option
          key={status.value}
          value={status.value}
        >
          {status.label}
        </option>
      ))}
    </Form.Select>
  );
}