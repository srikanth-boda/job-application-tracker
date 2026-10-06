"use client";

import { notImplemented } from "@/lib/errors";
import type { CheckoutOrder } from "@/types/payment";

/**
 * PLACEHOLDER - browser side of Razorpay Checkout.
 * Intended flow: load https://checkout.razorpay.com/v1/checkout.js, open the modal with
 * NEXT_PUBLIC_RAZORPAY_KEY_ID + order.providerOrderId, and resolve with the values Razorpay
 * returns (order id, payment id, signature) mapped onto VerifyPaymentRequest.
 * The result is NEVER trusted by the UI - it is sent to /api/payments/verify.
 */
export async function openRazorpayCheckout(
  _order: CheckoutOrder,
): Promise<{ providerOrderId: string; providerPaymentId: string; signature: string }> {
  return notImplemented("openRazorpayCheckout");
}
