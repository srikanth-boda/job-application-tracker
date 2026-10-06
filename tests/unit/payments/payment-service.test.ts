import { describe, expect, it } from "vitest";
import { InvalidSignatureError, NotFoundError, ValidationError } from "@/lib/errors";
import type { PaymentProvider } from "@/services/payments/payment-provider";
import type { PaymentRepository } from "@/services/payments/payment-repository";
import { PaymentService } from "@/services/payments/payment-service";
import type { Payment, PaymentOrder } from "@/types/payment";

function setup(signatureValid = true) {
  const orders: PaymentOrder[] = [];
  const payments = new Map<string, Payment>();
  const requestedAmounts: number[] = [];

  const provider: PaymentProvider = {
    name: "razorpay",
    createOrder: async (input) => {
      requestedAmounts.push(input.amount);
      return { providerOrderId: "order_1", amount: input.amount, currency: input.currency };
    },
    verifyPaymentSignature: () => signatureValid,
    parseWebhook: () => ({ type: "ignored" }),
  };

  const repository: PaymentRepository = {
    saveOrder: async (order) => {
      const saved = { ...order, id: `id_${orders.length + 1}`, createdAt: "t", updatedAt: "t" };
      orders.push(saved);
      return saved;
    },
    findOrderByProviderOrderId: async (_p, id) =>
      orders.find((o) => o.providerOrderId === id) ?? null,
    recordVerifiedPayment: async ({ order, providerPaymentId, providerSignature }) => {
      const id = `${order.provider}_${providerPaymentId}`;
      const existing = payments.get(id);
      if (existing) return existing;
      const payment: Payment = {
        id,
        userId: order.userId,
        orderId: order.id,
        planId: order.planId,
        provider: order.provider,
        providerOrderId: order.providerOrderId,
        providerPaymentId,
        providerSignature,
        amount: order.amount,
        currency: order.currency,
        status: "verified",
        paidAt: "t",
        verifiedAt: "t",
        metadata: {},
        createdAt: "t",
        updatedAt: "t",
      };
      payments.set(id, payment);
      return payment;
    },
    markOrderFailed: async () => undefined,
  };

  return { service: new PaymentService(provider, repository), orders, payments, requestedAmounts };
}

describe("PaymentService", () => {
  it("creates an order using the SERVER-side plan price", async () => {
    const { service, requestedAmounts, orders } = setup();
    const checkout = await service.createOrder({ userId: "u1", planId: "premium" });
    expect(requestedAmounts[0]).toBe(99900);
    expect(orders).toHaveLength(1);
    expect(checkout.providerOrderId).toBe("order_1");
  });

  it("refuses to sell the free plan", async () => {
    const { service } = setup();
    await expect(service.createOrder({ userId: "u1", planId: "free" })).rejects.toBeInstanceOf(
      ValidationError,
    );
  });

  it("verifies and records a payment exactly once (idempotent)", async () => {
    const { service, payments } = setup();
    await service.createOrder({ userId: "u1", planId: "premium" });
    const input = {
      userId: "u1",
      providerOrderId: "order_1",
      providerPaymentId: "pay_1",
      signature: "sig",
    };
    await service.verifyPayment(input);
    await service.verifyPayment(input);
    expect(payments.size).toBe(1);
  });

  it("rejects an invalid signature and records nothing", async () => {
    const { service, payments } = setup(false);
    await service.createOrder({ userId: "u1", planId: "premium" });
    await expect(
      service.verifyPayment({
        userId: "u1",
        providerOrderId: "order_1",
        providerPaymentId: "pay_1",
        signature: "bad",
      }),
    ).rejects.toBeInstanceOf(InvalidSignatureError);
    expect(payments.size).toBe(0);
  });

  it("does not let another user verify someone else's order", async () => {
    const { service } = setup();
    await service.createOrder({ userId: "u1", planId: "premium" });
    await expect(
      service.verifyPayment({
        userId: "u2",
        providerOrderId: "order_1",
        providerPaymentId: "pay_1",
        signature: "sig",
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
