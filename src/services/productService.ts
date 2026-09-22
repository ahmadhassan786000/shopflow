import { prisma } from "@/lib/prisma";
import { Prisma, ProductStatus } from "@prisma/client";

export interface ProductQueryParams {
  search?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  stock?: "in";
  brand?: string;
  sort?:
    | "newest"
    | "price_asc"
    | "price_desc"
    | "rating";
  page?: number;
  pageSize?: number;
}

export async function getProducts(
  params: ProductQueryParams,
) {
  const {
    search,
    categorySlug,
    minPrice,
    maxPrice,
    stock,
    brand,
    sort = "newest",
    page = 1,
    pageSize = 12,
  } = params;

  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.PUBLISHED,

    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          brand: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),

    ...(categorySlug && {
      category: {
        slug: categorySlug,
      },
    }),

    ...((minPrice !== undefined ||
      maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && {
          gte: minPrice,
        }),

        ...(maxPrice !== undefined && {
          lte: maxPrice,
        }),
      },
    }),

    ...(stock === "in" && {
      stock: {
        gt: 0,
      },
    }),

    ...(brand && {
      brand: {
        equals: brand,
        mode: "insensitive",
      },
    }),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
        ? { price: "desc" }
        : sort === "rating"
          ? {
              reviews: {
                _count: "desc",
              },
            }
          : {
              createdAt: "desc",
            };

  const safePage = Math.max(
    1,
    page,
  );

  const [items, total] =
    await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip:
          (safePage - 1) *
          pageSize,
        take: pageSize,

        include: {
          images: {
            orderBy: {
              position: "asc",
            },
            take: 1,
          },

          category: true,

          reviews: {
            where: {
              status: "APPROVED",
            },

            select: {
              rating: true,
            },
          },
        },
      }),

      prisma.product.count({
        where,
      }),
    ]);

  return {
    items: items.map(
      withAverageRating,
    ),

    total,

    totalPages: Math.ceil(
      total / pageSize,
    ),

    page: safePage,
  };
}

export async function getAvailableBrands(
  categorySlug?: string,
) {
  const rows = await prisma.product.findMany({
    where: {
      status: ProductStatus.PUBLISHED,
      brand: {
        not: null,
      },
      ...(categorySlug && {
        category: {
          slug: categorySlug,
        },
      }),
    },
    select: {
      brand: true,
    },
    distinct: ["brand"],
    orderBy: {
      brand: "asc",
    },
  });

  return rows
    .map((row) => row.brand)
    .filter((brand): brand is string => Boolean(brand));
}

export async function getProductBySlug(
  slug: string,
) {
  const product =
    await prisma.product.findUnique({
      where: {
        slug,
        status:
          ProductStatus.PUBLISHED,
      },

      include: {
        images: {
          orderBy: {
            position: "asc",
          },
        },

        variants: true,

        category: true,

        reviews: {
          where: {
            status: "APPROVED",
          },

          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

  return product
    ? withAverageRating(product)
    : null;
}

export async function getFeaturedProducts(
  take = 8,
) {
  const products =
    await prisma.product.findMany({
      where: {
        status:
          ProductStatus.PUBLISHED,
        isFeatured: true,
      },

      take,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        images: {
          orderBy: {
            position: "asc",
          },
          take: 1,
        },

        reviews: {
          where: {
            status: "APPROVED",
          },

          select: {
            rating: true,
          },
        },
      },
    });

  return products.map(
    withAverageRating,
  );
}

function withAverageRating<
  T extends {
    reviews: {
      rating: number;
    }[];
    price: Prisma.Decimal | number;
    salePrice?: Prisma.Decimal | number | null;
  },
>(product: T) {
  const ratings = product.reviews.map(
    (review) => review.rating,
  );

  const avgRating =
    ratings.length > 0
      ? ratings.reduce(
          (total, rating) =>
            total + rating,
          0,
        ) / ratings.length
      : 0;

  return {
    ...product,

    // Convert Prisma Decimal values into
    // plain JavaScript numbers so they can
    // safely cross from Server Components
    // to Client Components.
    price:
      typeof product.price === "number"
        ? product.price
        : product.price.toNumber(),

    salePrice:
      product.salePrice === null ||
      product.salePrice === undefined
        ? null
        : typeof product.salePrice === "number"
          ? product.salePrice
          : product.salePrice.toNumber(),

    avgRating,

    reviewCount:
      ratings.length,
  };
}

export async function createProduct(
  data: Prisma.ProductUncheckedCreateInput,
) {
  return prisma.product.create({
    data,
  });
}

export async function updateProduct(
  id: string,
  data: Prisma.ProductUncheckedUpdateInput,
) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(
  id: string,
) {
  return prisma.product.delete({
    where: { id },
  });
}

export async function getProductById(
  id: string,
) {
  return prisma.product.findUnique({
    where: { id },

    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },

      variants: true,
    },
  });
}

export async function getAllProductsForAdmin({
  search = "",
  categoryId,
  status,
  stock,
  sort = "newest",
  page = 1,
  pageSize = 20,
}: {
  search?: string;
  categoryId?: string;
  status?: string;
  stock?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}) {
  const safePage = Math.max(
    1,
    page,
  );

  const skip =
    (safePage - 1) *
    pageSize;

  const where: Prisma.ProductWhereInput = {
    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          sku: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          brand: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),

    ...(categoryId && {
      categoryId,
    }),

    ...(status && {
      status:
        status as ProductStatus,
    }),

    ...(stock === "out" && {
      stock: 0,
    }),

    ...(stock === "low" && {
      stock: {
        gt: 0,
        lte: 5,
      },
    }),

    ...(stock === "in" && {
      stock: {
        gt: 5,
      },
    }),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "oldest"
      ? { createdAt: "asc" }
      : sort === "name_asc"
        ? { name: "asc" }
        : sort === "price_asc"
          ? { price: "asc" }
          : sort === "price_desc"
            ? { price: "desc" }
            : { createdAt: "desc" };

  const [items, total] =
    await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,

        include: {
          category: true,

          images: {
            orderBy: {
              position: "asc",
            },
            take: 1,
          },
        },
      }),

      prisma.product.count({
        where,
      }),
    ]);

  return {
    items,
    total,
    totalPages: Math.ceil(
      total / pageSize,
    ),
    page: safePage,
    pageSize,
  };
}

export async function getProductCategoriesForAdmin() {
  const categories =
    await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },

      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

  return categories.map(
    (category) => ({
      id: category.id,
      name: category.name,
      productCount:
        category._count.products,
    }),
  );
}
