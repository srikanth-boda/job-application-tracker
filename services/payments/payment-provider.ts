import type { PaymentProviderName } from "@/constants/payments";

export interface CreateProviderOrderInput {
  /** Smallest currency unit. */
  amount: number;
  currency: string;
  receipt: string;
  metadata: Record<string, string>;
}

export interface ProviderOrder {
  providerOrderId: string;
  amount: number;
  currency: string;
}

export interface VerifyProviderPaymentInput {
  providerOrderId: string;
  providerPaymentId: string;
  signature: string;
}

export type ProviderWebhookEvent =
  | {
      type: "payment.captured";
      providerOrderId: string;
      providerPaymentId: string;
      amount: number;
      currency: string;
    }
  | { type: "payment.failed"; providerOrderId: string; providerPaymentId: string | null }
  | { type: "ignored" };

/**
 * Contract every payment provider implements. Nothing outside services/payments/<provider>/
 * may know which provider is in use. Adding Stripe = a new folder implementing this interface
 * plus one `case` in services/payments/index.ts.
 */
export interface PaymentProvider {
  readonly name: PaymentProviderName;
  createOrder(input: CreateProviderOrderInput): Promise<ProviderOrder>;
  /** Verifies the checkout-return signature. Must be a server-side check. */
  verifyPaymentSignature(input: VerifyProviderPaymentInput): boolean;
  /** Verifies the webhook signature against the RAW body and normalises the event. Throws InvalidSignatureError. */
  parseWebhook(input: { rawBody: string; headers: Headers }): ProviderWebhookEvent;
}
