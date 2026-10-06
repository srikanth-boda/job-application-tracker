import { describe, expect, it } from "vitest";
import { createOrderRequestSchema, verifyPaymentRequestSchema } from "@/schemas/payment.schema";

describe("payment schemas", () => {
  it("only accepts a known plan id", () => {
    expect(createOrderRequestSchema.safeParse({ planId: "premium" }).success).toBe(true);
    expect(createOrderRequestSchema.safeParse({ planId: "enterprise" }).success).toBe(false);
  });

  it("ignores any client-supplied amount", () => {
    const parsed = createOrderRequestSchema.parse({ planId: "premium", amount: 1 });
    expect(parsed).toEqual({ planId: "premium" });
  });

  it("requires order id, payment id and signature", () => {
    expect(
      verifyPaymentRequestSchema.safeParse({ providerOrderId: "o", providerPaymentId: "p" })
        .success,
    ).toBe(false);
    expect(
      verifyPaymentRequestSchema.safeParse({
        providerOrderId: "o",
        providerPaymentId: "p",
        signature: "s",
      }).success,
    ).toBe(true);
  });
});
