import { prisma } from "@/lib/prisma";

async function getOrCreateCart(userId: string) {
  const existing = await prisma.cart.findUnique({ where: { userId } });
  if (existing) return existing;

  return prisma.cart.create({
    data: { userId },
  });
}

export async function getCartWithItems(userId: string) {
  const cart = await getOrCreateCart(userId);

  return prisma.cart.findUnique({
    where: { id: cart.id },
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
          variant: true,
        },
      },
    },
  });
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity: number,
  variantId?: string,
) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || product.status !== "PUBLISHED") {
    throw new Error("Product is not available.");
  }

  const variant = variantId
    ? await prisma.productVariant.findUnique({
        where: { id: variantId },
      })
    : null;

  if (variantId && !variant) {
    throw new Error("Selected variant is not available.");
  }

  const availableStock = variant ? variant.stock : product.stock;

  if (availableStock < quantity) {
    throw new Error("Not enough stock available.");
  }

  const cart = await getOrCreateCart(userId);

  if (!variantId) {
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: null,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > availableStock) {
        throw new Error("Not enough stock available.");
      }

      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: null,
        quantity,
      },
    });
  }

  return prisma.cartItem.upsert({
    where: {
      cartId_productId_variantId: {
        cartId: cart.id,
        productId,
        variantId,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      cartId: cart.id,
      productId,
      variantId,
      quantity,
    },
  });
}

export async function updateCartItemQuantity(
  userId: string,
  cartItemId: string,
  quantity: number,
) {
  const item = await prisma.cartItem.findUnique({
    include: { cart: true },
    where: { id: cartItemId },
  });

  if (!item || item.cart.userId !== userId) {
    throw new Error("Cart item not found.");
  }

  if (quantity <= 0) {
    return prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
}

export async function removeCartItem(
  userId: string,
  cartItemId: string,
) {
  const item = await prisma.cartItem.findUnique({
    include: { cart: true },
    where: { id: cartItemId },
  });

  if (!item || item.cart.userId !== userId) {
    throw new Error("Cart item not found.");
  }

  return prisma.cartItem.delete({
    where: { id: cartItemId },
  });
}

/**
 * Recomputes cart totals server-side from live product prices.
 * Browser-supplied prices are never trusted for checkout calculations.
 */
export async function calculateCartTotals(userId: string) {
  const cart = await getCartWithItems(userId);

  if (!cart || cart.items.length === 0) {
    return {
      subtotal: 0,
      items: [] as const,
    };
  }

  const items = cart.items.map((item) => {
    const unitPrice = item.variant
      ? Number(item.product.price) + Number(item.variant.priceDelta)
      : Number(item.product.salePrice ?? item.product.price);

    const imageUrl = item.product.images[0]?.url ?? null;

    const variantLabel = item.variant
      ? Object.entries(item.variant.attributes as Record<string, unknown>)
          .map(([key, value]) => `${key}: ${String(value)}`)
          .join(" • ")
      : null;

    return {
      cartItemId: item.id,
      productId: item.productId,
      variantId: item.variantId,
      name: item.product.name,
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
      imageUrl,
      variantLabel,
    };
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.lineTotal,
    0,
  );

  return {
    subtotal,
    items,
  };
}

export async function clearCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) return;

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
}
