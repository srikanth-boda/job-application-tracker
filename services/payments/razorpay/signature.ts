import { createHmac } from "node:crypto";
import { safeEqual } from "@/lib/security/constant-time";

function hmacSha256Hex(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/** Checkout return: HMAC_SHA256(order_id + "|" + payment_id, key_secret) must equal the signature. */
export function verifyCheckoutSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
  keySecret: string;
}): boolean {
  const expected = hmacSha256Hex(params.keySecret, `${params.orderId}|${params.paymentId}`);
  return safeEqual(expected, params.signature);
}

/** Webhook: HMAC_SHA256(raw request body, webhook_secret). Must use the RAW body, not re-serialised JSON. */
export function verifyWebhookSignature(params: {
  rawBody: string;
  signature: string;
  webhookSecret: string;
}): boolean {
  return safeEqual(hmacSha256Hex(params.webhookSecret, params.rawBody), params.signature);
}

/** Test helper / reference for how the signatures are produced. */
export const __sign = hmacSha256Hex;
