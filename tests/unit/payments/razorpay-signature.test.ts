import { describe, expect, it } from "vitest";
import {
  __sign,
  verifyCheckoutSignature,
  verifyWebhookSignature,
} from "@/services/payments/razorpay/signature";

const secret = "test_secret_not_real";

describe("verifyCheckoutSignature", () => {
  const orderId = "order_123";
  const paymentId = "pay_456";
  const signature = __sign(secret, `${orderId}|${paymentId}`);

  it("accepts a correct signature", () => {
    expect(verifyCheckoutSignature({ orderId, paymentId, signature, keySecret: secret })).toBe(
      true,
    );
  });
  it("rejects a tampered payment id, wrong secret and garbage", () => {
    expect(
      verifyCheckoutSignature({ orderId, paymentId: "pay_999", signature, keySecret: secret }),
    ).toBe(false);
    expect(verifyCheckoutSignature({ orderId, paymentId, signature, keySecret: "other" })).toBe(
      false,
    );
    expect(
      verifyCheckoutSignature({ orderId, paymentId, signature: "abc", keySecret: secret }),
    ).toBe(false);
  });
});

describe("verifyWebhookSignature", () => {
  const rawBody = JSON.stringify({ event: "payment.captured" });
  const signature = __sign(secret, rawBody);

  it("verifies against the raw body", () => {
    expect(verifyWebhookSignature({ rawBody, signature, webhookSecret: secret })).toBe(true);
    expect(
      verifyWebhookSignature({ rawBody: rawBody + " ", signature, webhookSecret: secret }),
    ).toBe(false);
  });
});
