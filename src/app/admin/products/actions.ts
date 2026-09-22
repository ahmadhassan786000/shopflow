"use server";

import { requireRole } from "@/lib/authorize";
import { productSchema } from "@/lib/validations/product";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productService";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";




function validateImageUrl(
  imageUrl: string,
) {
  try {
    const parsedUrl =
      new URL(imageUrl);

    if (
      parsedUrl.protocol !== "http:" &&
      parsedUrl.protocol !== "https:"
    ) {
      throw new Error(
        "Image URL must use HTTP or HTTPS.",
      );
    }
  } catch {
    throw new Error(
      "Please provide a valid image URL.",
    );
  }
}

// ============================================================
// CREATE PRODUCT
// ============================================================

export async function createProductAction(
  formData: FormData,
) {
  await requireRole(
    "ADMIN",
    "SUPER_ADMIN",
    "STAFF",
  );

  const raw = Object.fromEntries(
    formData.entries(),
  );

  const parsed = productSchema.safeParse({
    ...raw,
    isFeatured:
      formData.get("isFeatured") === "on",
  });

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.errors[0]?.message ??
        "Invalid product data.",
    };
  }

  const imageUrlEntry =
    formData.get("imageUrl");

  const imageUrl =
    typeof imageUrlEntry === "string"
      ? imageUrlEntry.trim()
      : "";

  if (imageUrl) {
    try {
      validateImageUrl(imageUrl);
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Invalid image URL.",
      };
    }
  }

  try {
    const product = await createProduct(
      parsed.data,
    );

    if (imageUrl) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: imageUrl,
          altText: product.name,
          position: 0,
        },
      });
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");

    redirect(
      `/admin/products/${product.id}/edit`,
    );
  } catch (error) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = error.meta?.target;

      if (
        Array.isArray(target) &&
        target.includes("slug")
      ) {
        return {
          success: false,
          message:
            "This slug is already in use. Please choose a different slug.",
        };
      }

      if (
        Array.isArray(target) &&
        target.includes("sku")
      ) {
        return {
          success: false,
          message:
            "This SKU is already in use. Please enter a different SKU.",
        };
      }

      return {
        success: false,
        message:
          "A product with these details already exists.",
      };
    }

    throw error;
  }
}

// ============================================================
// UPDATE PRODUCT
// ============================================================

export async function updateProductAction(
  id: string,
  formData: FormData,
) {
  await requireRole(
    "ADMIN",
    "SUPER_ADMIN",
    "STAFF",
  );

  const raw = Object.fromEntries(
    formData.entries(),
  );

  const parsed = productSchema.safeParse({
    ...raw,
    isFeatured:
      formData.get("isFeatured") === "on",
  });

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.errors[0]?.message ??
        "Invalid product data.",
    };
  }

  try {
    await updateProduct(id, parsed.data);

    revalidatePath("/admin/products");
    revalidatePath(
      `/products/${parsed.data.slug}`,
    );

    return {
      success: true,
      message: "Product updated.",
    };
  } catch (error) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = error.meta?.target;

      if (
        Array.isArray(target) &&
        target.includes("slug")
      ) {
        return {
          success: false,
          message:
            "This slug is already in use. Please choose a different slug.",
        };
      }

      if (
        Array.isArray(target) &&
        target.includes("sku")
      ) {
        return {
          success: false,
          message:
            "This SKU is already in use. Please enter a different SKU.",
        };
      }

      return {
        success: false,
        message:
          "A product with these details already exists.",
      };
    }

    throw error;
  }
}

// ============================================================
// DELETE PRODUCT
// ============================================================

export async function deleteProductAction(
  id: string,
) {
  await requireRole(
    "ADMIN",
    "SUPER_ADMIN",
  );

  await deleteProduct(id);

  revalidatePath("/admin/products");
}

// ============================================================
// UPLOAD PRODUCT IMAGE
// ============================================================

export async function uploadProductImageAction(
  productId: string,
  formData: FormData,
) {
  await requireRole(
    "ADMIN",
    "SUPER_ADMIN",
    "STAFF",
  );

  const imageFile = formData.get("image");

  if (
    !(imageFile instanceof File) ||
    imageFile.size === 0
  ) {
    return {
      success: false,
      message: "Please select an image.",
    };
  }

  try {
    await saveProductImage(
      productId,
      imageFile,
    );

    revalidatePath(
      `/admin/products/${productId}/edit`,
    );

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return {
      success: true,
      message: "Image uploaded successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to upload image.",
    };
  }
}

// ============================================================
// ADD PRODUCT IMAGE BY URL
// ============================================================

export async function addProductImageAction(
  productId: string,
  url: string,
  altText?: string,
) {
  await requireRole(
    "ADMIN",
    "SUPER_ADMIN",
    "STAFF",
  );

  const imageUrl =
    url.trim();

  if (!imageUrl) {
    return {
      success: false,
      message: "Image URL is required.",
    };
  }

  try {
    validateImageUrl(imageUrl);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Invalid image URL.",
    };
  }

  await prisma.productImage.create({
    data: {
      productId,
      url: imageUrl,
      altText,
    },
  });

  revalidatePath(
    `/admin/products/${productId}/edit`,
  );

  revalidatePath("/admin/products");
  revalidatePath("/products");

  return {
    success: true,
    message: "Image added successfully.",
  };
}

// ============================================================
// REMOVE PRODUCT IMAGE
// ============================================================

export async function removeProductImageAction(
  imageId: string,
  productId: string,
) {
  await requireRole(
    "ADMIN",
    "SUPER_ADMIN",
    "STAFF",
  );

  await prisma.productImage.delete({
    where: {
      id: imageId,
    },
  });

  revalidatePath(
    `/admin/products/${productId}/edit`,
  );

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

// ============================================================
// ADD PRODUCT VARIANT
// ============================================================

export async function addProductVariantAction(
  productId: string,
  formData: FormData,
) {
  await requireRole(
    "ADMIN",
    "SUPER_ADMIN",
    "STAFF",
  );

  await prisma.productVariant.create({
    data: {
      productId,
      name: String(
        formData.get("name") ?? "",
      ),
      value: String(
        formData.get("value") ?? "",
      ),
      sku: String(
        formData.get("sku") ?? "",
      ),
      priceDelta: Number(
        formData.get("priceDelta") ?? 0,
      ),
      stock: Number(
        formData.get("stock") ?? 0,
      ),
    },
  });

  revalidatePath(
    `/admin/products/${productId}/edit`,
  );
}