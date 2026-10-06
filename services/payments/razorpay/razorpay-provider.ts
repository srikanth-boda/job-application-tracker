import type { PaymentProvider, ProviderWebhookEvent } from "../payment-provider";
import { InvalidSignatureError, ValidationError } from "@/lib/errors";
import { createRazorpayClient } from "./razorpay-client";
import { verifyCheckoutSignature, verifyWebhookSignature } from "./signature";

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
}

interface RazorpayPaymentEntity {
  id?: string;
  order_id?: string;
  amount?: number;
  currency?: string;
}

/** The ONLY place that knows about Razorpay's SDK, signatures and webhook payloads. */
export class RazorpayPaymentProvider implements PaymentProvider {
  readonly name = "razorpay" as const;

  constructor(private readonly config: RazorpayConfig) {}

  async createOrder(input: Parameters<PaymentProvider["createOrder"]>[0]) {
    const client = createRazorpayClient(this.config.keyId, this.config.keySecret);
    const order = await client.orders.create({
      amount: input.amount,
      currency: input.currency,
      receipt: input.receipt,
      notes: input.metadata,
    });
    return { providerOrderId: order.id, amount: Number(order.amount), currency: order.currency };
  }

  verifyPaymentSignature(input: Parameters<PaymentProvider["verifyPaymentSignature"]>[0]): boolean {
    return verifyCheckoutSignature({
      orderId: input.providerOrderId,
      paymentId: input.providerPaymentId,
      signature: input.signature,
      keySecret: this.config.keySecret,
    });
  }

  parseWebhook(input: { rawBody: string; headers: Headers }): ProviderWebhookEvent {
    const signature = input.headers.get("x-razorpay-signature");
    if (
      !signature ||
      !verifyWebhookSignature({
        rawBody: input.rawBody,
        signature,
        webhookSecret: this.config.webhookSecret,
      })
    ) {
      throw new InvalidSignatureError("Invalid webhook signature");
    }

    let body: { event?: string; payload?: { payment?: { entity?: RazorpayPaymentEntity } } };
    try {
      body = JSON.parse(input.rawBody);
    } catch {
      throw new ValidationError("Webhook body must be valid JSON");
    }

    const payment = body.payload?.payment?.entity;
    if (!payment?.id || !payment.order_id) return { type: "ignored" };

    if (body.event === "payment.captured") {
      return {
        type: "payment.captured",
        providerOrderId: payment.order_id,
        providerPaymentId: payment.id,
        amount: payment.amount ?? 0,
        currency: payment.currency ?? "",
      };
    }
    if (body.event === "payment.failed") {
      return {
        type: "payment.failed",
        providerOrderId: payment.order_id,
        providerPaymentId: payment.id,
      };
    }
    return { type: "ignored" };
  }
}
