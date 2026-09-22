"use server";

import { requireUser } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validations/address";
import { placeOrder } from "@/services/orderService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const updateAddressSchema = addressSchema.extend({
  id: z.string().min(1, "Address ID is required"),
});

export async function saveAddressAction(formData: FormData) {
  const user = await requireUser();

  const parsed = addressSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    isDefault: formData.get("isDefault") === "on",
  });

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.errors[0]?.message ??
        "Invalid address.",
    };
  }

  const address = await prisma.$transaction(async (tx) => {
    if (parsed.data.isDefault) {
      await tx.address.updateMany({
        where: {
          userId: user.id,
        },
        data: {
          isDefault: false,
        },
      });
    }

    return tx.address.create({
      data: {
        ...parsed.data,
        userId: user.id,
      },
    });
  });

  revalidatePath("/checkout");
  revalidatePath("/account");

  return {
    success: true,
    message: "Address saved.",
    address: {
      id: address.id,
      type: address.type,
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    },
  };
}

export async function updateCheckoutAddressAction(
  formData: FormData,
) {
  const user = await requireUser();

  const parsed = updateAddressSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    isDefault: formData.get("isDefault") === "true",
  });

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.errors[0]?.message ??
        "Invalid address.",
    };
  }

  const address = await prisma.address.findFirst({
    where: {
      id: parsed.data.id,
      userId: user.id,
      type: "SHIPPING",
    },
  });

  if (!address) {
    return {
      success: false,
      message: "Address not found.",
    };
  }

  const {
    id,
    isDefault,
    ...addressData
  } = parsed.data;

  const updatedAddress = await prisma.$transaction(
    async (tx) => {
      if (isDefault) {
        await tx.address.updateMany({
          where: {
            userId: user.id,
            id: {
              not: id,
            },
          },
          data: {
            isDefault: false,
          },
        });
      }

      return tx.address.update({
        where: {
          id,
        },
        data: {
          ...addressData,
          isDefault,
        },
      });
    },
  );

  revalidatePath("/checkout");
  revalidatePath("/account");

  return {
    success: true,
    message: "Address updated successfully.",
    address: {
      id: updatedAddress.id,
      type: updatedAddress.type,
      fullName: updatedAddress.fullName,
      phone: updatedAddress.phone,
      line1: updatedAddress.line1,
      line2: updatedAddress.line2,
      city: updatedAddress.city,
      state: updatedAddress.state,
      postalCode: updatedAddress.postalCode,
      country: updatedAddress.country,
      isDefault: updatedAddress.isDefault,
    },
  };
}

export async function deleteCheckoutAddressAction(
  addressId: string,
) {
  const user = await requireUser();

  if (!addressId) {
    return {
      success: false,
      message: "Address ID is required.",
    };
  }

  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId: user.id,
      type: "SHIPPING",
    },
    include: {
      _count: {
        select: {
          shippingOrders: true,
          billingOrders: true,
        },
      },
    },
  });

  if (!address) {
    return {
      success: false,
      message: "Address not found.",
    };
  }

  const orderCount =
    address._count.shippingOrders +
    address._count.billingOrders;

  if (orderCount > 0) {
    return {
      success: false,
      message:
        "This address is linked to an existing order and cannot be removed.",
    };
  }

  await prisma.address.delete({
    where: {
      id: addressId,
    },
  });

  revalidatePath("/checkout");
  revalidatePath("/account");

  return {
    success: true,
    message: "Address removed successfully.",
  };
}

export async function placeOrderAction(formData: FormData) {
  const user = await requireUser();

  const shippingAddressId = String(
    formData.get("shippingAddressId") ?? "",
  );

  const billingAddressId = String(
    formData.get("billingAddressId") ?? "",
  );

  if (!shippingAddressId || !billingAddressId) {
    return {
      success: false,
      message: "Please select a shipping address.",
    };
  }

  try {
    const order = await placeOrder({
      userId: user.id,
      shippingAddressId,
      billingAddressId,
    });

    revalidatePath("/orders");

    redirect(`/orders/${order.id}?placed=true`);
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.includes("NEXT_REDIRECT")
    ) {
      throw err;
    }

    return {
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "Could not place order.",
    };
  }
}