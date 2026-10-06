import type { PaymentProviderName } from "@/constants/payments";
import type { Payment, PaymentOrder } from "@/types/payment";

export type NewPaymentOrder = Omit<PaymentOrder, "id" | "createdAt" | "updatedAt">;

/** Persistence port for PaymentService. Implemented with the Firebase Admin SDK. */
export interface PaymentRepository {
  saveOrder(order: NewPaymentOrder): Promise<PaymentOrder>;
  findOrderByProviderOrderId(
    provider: PaymentProviderName,
    providerOrderId: string,
  ): Promise<PaymentOrder | null>;
  /**
   * Atomically: create the Payment, mark the order paid and activate the user's subscription.
   * MUST be idempotent - verify and webhook can both report the same payment.
   */
  recordVerifiedPayment(params: {
    order: PaymentOrder;
    providerPaymentId: string;
    providerSignature: string | null;
  }): Promise<Payment>;
  markOrderFailed(orderId: string): Promise<void>;
}
