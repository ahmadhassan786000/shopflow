"use server";

import { requireRole } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";
import { sliderSchema } from "@/lib/validations/slider";
import {
  createSlider,
  updateSlider,
  deleteSlider,
} from "@/services/sliderService";
import { revalidatePath } from "next/cache";

function validateImageUrl(imageUrl: string) {
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

// ============================================================
// CREATE SLIDER
// ============================================================

export async function createSliderAction(
  formData: FormData,
) {
  await requireRole(
    "ADMIN",
    "SUPER_ADMIN",
    "STAFF",
  );

  const imageUrl = String(
    formData.get("imageUrl") ?? "",
  ).trim();

  if (!imageUrl) {
    return {
      success: false,
      message: "Slider image URL is required.",
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

  const parsed =
    sliderSchema.safeParse({
      title: String(
        formData.get("title") ?? "",
      ),

      description:
        String(
          formData.get(
            "description",
          ) ?? "",
        ) || undefined,

      buttonText:
        String(
          formData.get(
            "buttonText",
          ) ?? "",
        ) || undefined,

      buttonUrl:
        String(
          formData.get(
            "buttonUrl",
          ) ?? "",
        ) || undefined,

      isActive:
        formData.get("isActive") ===
        "on",

      sortOrder:
        formData.get(
          "sortOrder",
        ) ?? 0,
    });

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]
          ?.message ??
        "Invalid slider data.",
    };
  }

  try {
    await createSlider({
      title: parsed.data.title,
      description:
        parsed.data.description,
      image: imageUrl,
      buttonText:
        parsed.data.buttonText,
      buttonUrl:
        parsed.data.buttonUrl,
      isActive:
        parsed.data.isActive,
      sortOrder:
        parsed.data.sortOrder,
    });

    revalidatePath(
      "/admin/sliders",
    );

    revalidatePath("/");

    return {
      success: true,
      message:
        "Slider created successfully.",
    };
  } catch (error) {
    throw error;
  }
}

// ============================================================
// UPDATE SLIDER
// ============================================================

export async function updateSliderAction(
  id: string,
  formData: FormData,
) {
  await requireRole(
    "ADMIN",
    "SUPER_ADMIN",
    "STAFF",
  );

  const existing =
    await prisma.slider.findUnique({
      where: {
        id,
      },
    });

  if (!existing) {
    return {
      success: false,
      message: "Slider not found.",
    };
  }

  const imageUrl = String(
    formData.get("imageUrl") ?? "",
  ).trim();

  if (!imageUrl) {
    return {
      success: false,
      message: "Slider image URL is required.",
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

  const parsed =
    sliderSchema.safeParse({
      title: String(
        formData.get("title") ?? "",
      ),

      description:
        String(
          formData.get(
            "description",
          ) ?? "",
        ) || undefined,

      buttonText:
        String(
          formData.get(
            "buttonText",
          ) ?? "",
        ) || undefined,

      buttonUrl:
        String(
          formData.get(
            "buttonUrl",
          ) ?? "",
        ) || undefined,

      isActive:
        formData.get("isActive") ===
        "on",

      sortOrder:
        formData.get(
          "sortOrder",
        ) ?? 0,
    });

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]
          ?.message ??
        "Invalid slider data.",
    };
  }

  if (
    parsed.data.isActive &&
    !imageUrl
  ) {
    return {
      success: false,
      message:
        "An image URL is required before a slider can be active.",
    };
  }

  try {
    await updateSlider(id, {
      title: parsed.data.title,
      description:
        parsed.data.description,
      buttonText:
        parsed.data.buttonText,
      buttonUrl:
        parsed.data.buttonUrl,
      isActive:
        parsed.data.isActive,
      sortOrder:
        parsed.data.sortOrder,
      image: imageUrl,
    });

    revalidatePath(
      "/admin/sliders",
    );

    revalidatePath("/");

    return {
      success: true,
      message:
        "Slider updated successfully.",
    };
  } catch (error) {
    throw error;
  }
}

// ============================================================
// REMOVE SLIDER IMAGE
// ============================================================

export async function removeSliderImageAction(
  id: string,
) {
  await requireRole(
    "ADMIN",
    "SUPER_ADMIN",
    "STAFF",
  );

  const slider =
    await prisma.slider.findUnique({
      where: {
        id,
      },
    });

  if (!slider) {
    return {
      success: false,
      message: "Slider not found.",
    };
  }

  await prisma.slider.update({
    where: {
      id,
    },
    data: {
      image: "",
      isActive: false,
    },
  });

  revalidatePath(
    "/admin/sliders",
  );

  revalidatePath("/");

  return {
    success: true,
    message:
      "Slider image removed and slider deactivated.",
  };
}

// ============================================================
// DELETE SLIDER
// ============================================================

export async function deleteSliderAction(
  id: string,
) {
  await requireRole(
    "ADMIN",
    "SUPER_ADMIN",
  );

  const slider =
    await prisma.slider.findUnique({
      where: {
        id,
      },
    });

  if (!slider) {
    return {
      success: false,
      message: "Slider not found.",
    };
  }

  await deleteSlider(id);

  revalidatePath(
    "/admin/sliders",
  );

  revalidatePath("/");

  return {
    success: true,
    message:
      "Slider deleted successfully.",
  };
}