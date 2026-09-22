import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getCategoryTree() {
  return prisma.category.findMany({
    where: {
      parentId: null,
    },

    include: {
      children: true,
    },

    orderBy: {
      name: "asc",
    },
  });
}

export async function getCategoryBySlug(
  slug: string,
) {
  return prisma.category.findUnique({
    where: {
      slug,
    },

    include: {
      children: true,
      parent: true,
    },
  });
}

export async function getAllCategoriesFlat() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function createCategory(
  data: Prisma.CategoryUncheckedCreateInput,
) {
  return prisma.category.create({
    data,
  });
}

export async function updateCategory(
  id: string,
  data: Prisma.CategoryUncheckedUpdateInput,
) {
  return prisma.category.update({
    where: {
      id,
    },

    data,
  });
}

export async function deleteCategory(
  id: string,
) {
  const productCount =
    await prisma.product.count({
      where: {
        categoryId: id,
      },
    });

  if (productCount > 0) {
    throw new Error(
      `Cannot delete category with ${productCount} product(s) still assigned to it.`,
    );
  }

  return prisma.category.delete({
    where: {
      id,
    },
  });
}