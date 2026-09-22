import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function getActiveSliders() {
  return prisma.slider.findMany({
    where: {
      isActive: true,
      image: {
        not: "",
      },
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function getAllSliders() {
  return prisma.slider.findMany({
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function getSliderById(
  id: string,
) {
  return prisma.slider.findUnique({
    where: {
      id,
    },
  });
}

export async function createSlider(
  data: Prisma.SliderCreateInput,
) {
  return prisma.slider.create({
    data,
  });
}

export async function updateSlider(
  id: string,
  data: Prisma.SliderUpdateInput,
) {
  return prisma.slider.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteSlider(
  id: string,
) {
  return prisma.slider.delete({
    where: {
      id,
    },
  });
}
