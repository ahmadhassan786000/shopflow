import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { calculateCartTotals } from "./cartService";
import { generateOrderNumber } from "@/lib/utils";

const SHIPPING_CHARGE = 180;
const TAX_RATE = 0.0;

interface PlaceOrderParams {
  userId: string;
  shippingAddressId: string;
  billingAddressId: string;
}

export async function placeOrder(
  params: PlaceOrderParams,
) {
  const {
    userId,
    shippingAddressId,
    billingAddressId,
  } = params;

  const { subtotal, items } =
    await calculateCartTotals(userId);

  if (items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const [shippingAddress, billingAddress] =
    await Promise.all([
      prisma.address.findFirst({
        where: {
          id: shippingAddressId,
          userId,
        },
      }),

      prisma.address.findFirst({
        where: {
          id: billingAddressId,
          userId,
        },
      }),
    ]);

  if (!shippingAddress || !billingAddress) {
    throw new Error("Invalid address selection.");
  }

  const discountTotal = 0;
  const shippingTotal = SHIPPING_CHARGE;
  const taxTotal =
    (subtotal - discountTotal) * TAX_RATE;

  const grandTotal =
    subtotal -
    discountTotal +
    shippingTotal +
    taxTotal;

  const order = await prisma.$transaction(
    async (tx) => {

      for (const item of items) {

        if (item.variantId) {
          const variant =
            await tx.productVariant.findUnique({
              where: {
                id: item.variantId,
              },
            });

          if (
            !variant ||
            variant.stock < item.quantity
          ) {
            throw new Error(
              `"${item.name}" no longer has enough stock.`,
            );
          }

          await tx.productVariant.update({
            where: {
              id: item.variantId,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

        } else {

          const product =
            await tx.product.findUnique({
              where: {
                id: item.productId,
              },
            });

          if (
            !product ||
            product.stock < item.quantity
          ) {
            throw new Error(
              `"${item.name}" no longer has enough stock.`,
            );
          }

          await tx.product.update({
            where: {
              id: item.productId,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      const createdOrder =
        await tx.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            userId,
            shippingAddressId,
            billingAddressId,
            subtotal,
            discountTotal,
            shippingTotal,
            taxTotal,
            grandTotal,
            status: "PENDING",

            items: {
              create: items.map((item) => ({
                productId: item.productId,
                variantId:
                  item.variantId ?? undefined,
                productName: item.name,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
              })),
            },

            payment: {
              create: {
                provider: "cod",
                status: "PENDING",
                amount: grandTotal,
              },
            },
          },

          include: {
            items: true,
            payment: true,
          },
        });

      await tx.cartItem.deleteMany({
        where: {
          cart: {
            userId,
          },
        },
      });

      return createdOrder;
    },
  );

  return order;
}

export async function getOrdersForUser(
  userId: string,
) {
  return prisma.order.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: true,
    },
  });
}

export async function getOrderById(
  orderId: string,
  userId?: string,
) {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      ...(userId ? { userId } : {}),
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                take: 1,
              },
            },
          },
        },
      },
      shippingAddress: true,
      billingAddress: true,
      payment: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getAllOrdersForAdmin(
  page = 1,
  pageSize = 20,
  status?: Prisma.OrderWhereInput["status"],
) {
  const where = status ? { status } : {};

  const [items, total, statusGroups] =
    await Promise.all([
      prisma.order.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),

      prisma.order.count({
        where,
      }),

      prisma.order.groupBy({
        by: ["status"],
        _count: {
          _all: true,
        },
      }),
    ]);

  const statusCounts = {
    PENDING: 0,
    CONFIRMED: 0,
    PROCESSING: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
    REFUNDED: 0,
  };

  for (const group of statusGroups) {
    statusCounts[group.status] = group._count._all;
  }

  return {
    items,
    total,
    totalPages: Math.ceil(total / pageSize),
    page,
    statusCounts,
  };
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
) {
  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: status as never,
    },
  });
}
