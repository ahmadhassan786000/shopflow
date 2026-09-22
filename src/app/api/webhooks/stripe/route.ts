import { NextRequest, NextResponse } from "next/server";
import { markPaymentStatus } from "@/services/paymentService";

/**
 * Stripe webhook endpoint. Activate once `stripe` is installed and
 * STRIPE_WEBHOOK_SECRET is set. Verifying the signature is mandatory -
 * without it, anyone could POST fake "payment succeeded" events here.
 */
export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const payload = await req.text();

  // Example real implementation once `stripe` package + env vars are added:
  //
  // const stripe = new Stripe(process.env.PAYMENT_SECRET_KEY!, { apiVersion: "2024-06-20" });
  // let event: Stripe.Event;
  // try {
  //   event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  // } catch (err) {
  //   return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  // }
  //
  // if (event.type === "payment_intent.succeeded") {
  //   const orderId = event.data.object.metadata.orderId;
  //   await markPaymentStatus(orderId, "SUCCEEDED", event.data.object.id);
  // } else if (event.type === "payment_intent.payment_failed") {
  //   const orderId = event.data.object.metadata.orderId;
  //   await markPaymentStatus(orderId, "FAILED");
  // }

  console.warn("Stripe webhook received but STRIPE integration is not configured yet.", { payloadLength: payload.length });
  return NextResponse.json({ received: true });
}
