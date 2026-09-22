import { prisma } from "@/lib/prisma";

export interface PaymentProvider {
  createPaymentIntent(orderId: string, amount: number, currency: string): Promise<{ clientSecret: string; providerRef: string }>;
  handleWebhookEvent(payload: unknown, signature: string): Promise<{ orderId: string; status: "SUCCEEDED" | "FAILED" }>;
}

/**
 * Stripe adapter. Requires STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET in env.
 * Not wired to a live account here â€” plug in real keys and this becomes functional.
 * The important part is that UI components and server actions never talk to
 * Stripe directly; everything goes through this service.
 */
export class StripePaymentProvider implements PaymentProvider {
  async createPaymentIntent(
    orderId: string,
    amount: number,
    currency = "pkr",
  ): Promise<{ clientSecret: string; providerRef: string }> {
    // Example real implementation (uncomment once `stripe` package + keys are added):
    //
    // const stripe = new Stripe(process.env.PAYMENT_SECRET_KEY!, { apiVersion: "2024-06-20" });
    // const intent = await stripe.paymentIntents.create({
    //   amount: Math.round(amount * 100),
    //   currency,
    //   metadata: { orderId },
    // });
    // return { clientSecret: intent.client_secret!, providerRef: intent.id };

    throw new Error(
      "StripePaymentProvider is not configured. Add PAYMENT_SECRET_KEY and the `stripe` package to activate.",
    );
  }

  async handleWebhookEvent(
    _payload: unknown,
    _signature: string,
  ): Promise<{ orderId: string; status: "SUCCEEDED" | "FAILED" }> {
    throw new Error("Webhook handling not configured â€” see src/app/api/webhooks/stripe/route.ts");
  }
}

export function getPaymentProvider(): PaymentProvider {
  return new StripePaymentProvider();
}

export async function markPaymentStatus(orderId: string, status: "SUCCEEDED" | "FAILED", providerRef?: string) {
  await prisma.payment.update({
    where: { orderId },
    data: { status, providerRef },
  });
  if (status === "SUCCEEDED") {
    await prisma.order.update({ where: { id: orderId }, data: { status: "CONFIRMED" } });
  }
}
