"use server";

import { requireRole } from "@/lib/authorize";
import { categorySchema } from "@/lib/validations/product";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/categoryService";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import path from "path";


function validateImageUrl(
  imageUrl: string,
) {
  try {
    const parsedUrl = new URL(imageUrl);

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

async function deleteCategoryImageFile(
  imageUrl: string | null,
) {
  if (!imageUrl) {
    return;
  }

  if (!imageUrl.startsWith("/uploads/categories/")) {
    return;
  }

  const filename = path.basename(imageUrl);

  const filePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    "categories",
    filename,
  );

  try {
    await unlink(filePath);
  } catch {
    // File may already be missing.
  }
}

// ============================================================
// CREATE CATEGORY
// ============================================================

export async function createCategoryAction(
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

  const parsed = categorySchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.errors[0]?.message ??
        "Invalid category.",
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
    const category = await createCategory({
      ...parsed.data,
      parentId: parsed.data.parentId || null,
    });

    if (imageUrl) {
      await prisma.category.update({
        where: {
          id: category.id,
        },
        data: {
          image: imageUrl,
        },
      });
    }

    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Category created.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Could not create category.",
    };
  }
}

// ============================================================
// UPDATE CATEGORY
// ============================================================

export async function updateCategoryAction(
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

  const parsed = categorySchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.errors[0]?.message ??
        "Invalid category.",
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
    const existingCategory =
      await prisma.category.findUnique({
        where: {
          id,
        },
      });

    if (!existingCategory) {
      return {
        success: false,
        message: "Category not found.",
      };
    }

    const newImageUrl =
      imageUrl || existingCategory.image;

    await updateCategory(id, {
      ...parsed.data,
      parentId:
        parsed.data.parentId || null,
      image: newImageUrl,
    });

    if (
      imageUrl &&
      existingCategory.image &&
      existingCategory.image !== imageUrl
    ) {
      await deleteCategoryImageFile(
        existingCategory.image,
      );
    }

    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Category updated.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Could not update category.",
    };
  }
}

// ============================================================
// REMOVE CATEGORY IMAGE
// ============================================================

export async function removeCategoryImageAction(
  id: string,
) {
  await requireRole(
    "ADMIN",
    "SUPER_ADMIN",
    "STAFF",
  );

  try {
    const category =
      await prisma.category.findUnique({
        where: {
          id,
        },
      });

    if (!category) {
      return {
        success: false,
        message: "Category not found.",
      };
    }

    if (!category.image) {
      return {
        success: true,
        message: "Category has no image.",
      };
    }

    const oldImage =
      category.image;

    await prisma.category.update({
      where: {
        id,
      },
      data: {
        image: null,
      },
    });

    await deleteCategoryImageFile(
      oldImage,
    );

    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Category image removed.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Could not remove category image.",
    };
  }
}

// ============================================================
// DELETE CATEGORY
// ============================================================

export async function deleteCategoryAction(
  id: string,
) {
  await requireRole(
    "ADMIN",
    "SUPER_ADMIN",
  );

  try {
    const category =
      await prisma.category.findUnique({
        where: {
          id,
        },
      });

    if (!category) {
      return {
        success: false,
        message: "Category not found.",
      };
    }

    await deleteCategory(id);

    if (category.image) {
      await deleteCategoryImageFile(
        category.image,
      );
    }

    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Category deleted.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Could not delete category.",
    };
  }
}