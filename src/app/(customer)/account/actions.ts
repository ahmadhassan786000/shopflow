"use server";

import { requireUser } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { addressSchema } from "@/lib/validations/address";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[a-z]/, "Must include a lowercase letter")
      .regex(/[0-9]/, "Must include a number"),
    confirmNewPassword: z.string(),
  })
  .refine(
    (d) => d.newPassword === d.confirmNewPassword,
    {
      message: "Passwords do not match",
      path: ["confirmNewPassword"],
    },
  );

const updateAddressSchema = addressSchema.extend({
  id: z.string().min(1, "Address ID is required"),
});

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();

  const parsed = profileSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.errors[0]?.message ??
        "Invalid input.",
    };
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: parsed.data.name,
    },
  });

  revalidatePath("/account");

  return {
    success: true,
    message: "Profile updated.",
  };
}

export async function changePasswordAction(formData: FormData) {
  const user = await requireUser();

  const parsed = changePasswordSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.errors[0]?.message ??
        "Invalid input.",
    };
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser?.passwordHash) {
    return {
      success: false,
      message:
        "This account signs in via a social provider and has no password to change.",
    };
  }

  const valid = await bcrypt.compare(
    parsed.data.currentPassword,
    dbUser.passwordHash,
  );

  if (!valid) {
    return {
      success: false,
      message: "Current password is incorrect.",
    };
  }

  const passwordHash = await bcrypt.hash(
    parsed.data.newPassword,
    12,
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordHash,
    },
  });

  return {
    success: true,
    message: "Password changed successfully.",
  };
}

export async function updateAddressAction(
  formData: FormData,
) {
  const user = await requireUser();

  const rawData = Object.fromEntries(formData.entries());

  const parsed = updateAddressSchema.safeParse({
    ...rawData,
    isDefault: rawData.isDefault === "true",
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

  await prisma.$transaction(async (tx) => {
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

    await tx.address.update({
      where: {
        id,
      },
      data: {
        ...addressData,
        isDefault,
      },
    });
  });

  revalidatePath("/account");
  revalidatePath("/checkout");

  return {
    success: true,
    message: "Address updated successfully.",
  };
}

export async function deleteAddressAction(
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

  revalidatePath("/account");
  revalidatePath("/checkout");

  return {
    success: true,
    message: "Address removed successfully.",
  };
}