"use client";

import { useState } from "react";
import type { PlanId } from "@/constants/plans";
import { notImplemented } from "@/lib/errors";

export type CheckoutState = "idle" | "creating-order" | "awaiting-payment" | "verifying" | "error";

/**
 * PLACEHOLDER hook the UI uses to start a purchase. Intended flow:
 *  1. createPaymentOrder (services/payments/payment-client.ts)  -> server creates + stores the order
 *  2. open the provider checkout (services/payments/razorpay/checkout.client.ts)
 *  3. verifyPayment -> server verifies the signature and only then activates the plan
 * UI components depend on this hook, never on Razorpay.
 */
export function useCheckout() {
  const [state, setState] = useState<CheckoutState>("idle");

  async function startCheckout(_planId: PlanId): Promise<void> {
    setState("error");
    notImplemented("useCheckout.startCheckout");
  }

  return { state, startCheckout };
}
