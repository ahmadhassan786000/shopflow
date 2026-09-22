"use server";

import { requireRole } from "@/lib/authorize";
import { updateOrderStatus } from "@/services/orderService";
import { revalidatePath } from "next/cache";

const VALID_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

export async function updateOrderStatusAction(
  orderId: string,
  status: string,
) {
  await requireRole("ADMIN", "SUPER_ADMIN", "STAFF");

  if (!VALID_STATUSES.includes(status)) {
    return {
      success: false,
      message: "Invalid status.",
    };
  }

  await updateOrderStatus(orderId, status);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);

  return {
    success: true,
    message: "Order status updated.",
  };
}