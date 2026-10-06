import "server-only";
import type { PaymentProviderName } from "@/constants/payments";
import { getServerEnv, requireEnv } from "@/lib/env/server";
import { FirestorePaymentRepository } from "./firestore-payment-repository";
import type { PaymentProvider } from "./payment-provider";
import { PaymentService } from "./payment-service";
import { RazorpayPaymentProvider } from "./razorpay";

function createPaymentProvider(name: PaymentProviderName): PaymentProvider {
  const env = getServerEnv();
  switch (name) {
    case "razorpay":
      return new RazorpayPaymentProvider({
        keyId: requireEnv(env.NEXT_PUBLIC_RAZORPAY_KEY_ID, "NEXT_PUBLIC_RAZORPAY_KEY_ID"),
        keySecret: requireEnv(env.RAZORPAY_KEY_SECRET, "RAZORPAY_KEY_SECRET"),
        webhookSecret: requireEnv(env.RAZORPAY_WEBHOOK_SECRET, "RAZORPAY_WEBHOOK_SECRET"),
      });
  }
}

let instance: PaymentService | undefined;

/** The single entry point Route Handlers use. Provider chosen by PAYMENT_PROVIDER. */
export function getPaymentService(): PaymentService {
  if (!instance) {
    instance = new PaymentService(
      createPaymentProvider(getServerEnv().PAYMENT_PROVIDER),
      new FirestorePaymentRepository(),
    );
  }
  return instance;
}

export { PaymentService } from "./payment-service";
export type { PaymentProvider } from "./payment-provider";
export type { PaymentRepository } from "./payment-repository";
