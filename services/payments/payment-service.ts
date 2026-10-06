import { randomUUID } from "node:crypto";
import { getPlanById } from "@/constants/plans";
import { InvalidSignatureError, NotFoundError, ValidationError } from "@/lib/errors";
import type { CheckoutOrder, PaymentOrder } from "@/types/payment";
import type { PlanId } from "@/constants/plans";
import type { PaymentProvider } from "./payment-provider";
import type { PaymentRepository } from "./payment-repository";

function toCheckoutOrder(order: PaymentOrder): CheckoutOrder {
  return {
    orderId: order.id,
    provider: order.provider,
    providerOrderId: order.providerOrderId,
    amount: order.amount,
    currency: order.currency,
  };
}

/**
 * Provider-agnostic payment orchestration. Server-only (called from Route Handlers).
 * The UI never imports this; it talks to /api/payments/* instead.
 */
export class PaymentService {
  constructor(
    private readonly provider: PaymentProvider,
    private readonly repository: PaymentRepository,
  ) {}

  async createOrder(params: { userId: string; planId: PlanId }): Promise<CheckoutOrder> {
    const plan = getPlanById(params.planId);
    if (!plan || plan.amount <= 0) throw new ValidationError("Plan is not purchasable");

    const receipt = `r_${randomUUID().replace(/-/g, "")}`; // <= 40 chars (Razorpay limit)
    const providerOrder = await this.provider.createOrder({
      amount: plan.amount, // taken from server config, never from the client
      currency: plan.currency,
      receipt,
      metadata: { userId: params.userId, planId: plan.id },
    });

    const order = await this.repository.saveOrder({
      userId: params.userId,
      planId: plan.id,
      provider: this.provider.name,
      providerOrderId: providerOrder.providerOrderId,
      amount: providerOrder.amount,
      currency: providerOrder.currency,
      status: "created",
      receipt,
    });
    return toCheckoutOrder(order);
  }

  async verifyPayment(params: {
    userId: string;
    providerOrderId: string;
    providerPaymentId: string;
    signature: string;
  }): Promise<{ paymentId: string; status: string }> {
    const order = await this.repository.findOrderByProviderOrderId(
      this.provider.name,
      params.providerOrderId,
    );
    // Same error for "missing" and "someone else's" so order ids cannot be probed.
    if (!order || order.userId !== params.userId)
      throw new NotFoundError("Payment order not found");

    const valid = this.provider.verifyPaymentSignature({
      providerOrderId: params.providerOrderId,
      providerPaymentId: params.providerPaymentId,
      signature: params.signature,
    });
    if (!valid) throw new InvalidSignatureError();

    const payment = await this.repository.recordVerifiedPayment({
      order,
      providerPaymentId: params.providerPaymentId,
      providerSignature: params.signature,
    });
    return { paymentId: payment.id, status: payment.status };
  }

  async handleWebhook(input: { rawBody: string; headers: Headers }): Promise<{ handled: boolean }> {
    const event = this.provider.parseWebhook(input); // throws InvalidSignatureError

    if (event.type === "ignored") return { handled: false };

    const order = await this.repository.findOrderByProviderOrderId(
      this.provider.name,
      event.providerOrderId,
    );
    if (!order) return { handled: false };

    if (event.type === "payment.failed") {
      if (order.status === "created") await this.repository.markOrderFailed(order.id);
      return { handled: true };
    }

    if (event.amount !== order.amount || event.currency !== order.currency) {
      throw new ValidationError("Webhook amount does not match the order");
    }
    await this.repository.recordVerifiedPayment({
      order,
      providerPaymentId: event.providerPaymentId,
      providerSignature: null,
    });
    return { handled: true };
  }
}
