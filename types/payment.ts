import type { PlanId } from "@/constants/plans";
import type { PaymentOrderStatus, PaymentProviderName, PaymentStatus } from "@/constants/payments";
import type { IsoDateString } from "./common";

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  /** Smallest currency unit (paise for INR). */
  amount: number;
  currency: string;
  /** null = no expiry (free plan). */
  accessDurationDays: number | null;
  features: readonly string[];
}

/** Firestore: paymentOrders/{id}. Created server-side before checkout opens. */
export interface PaymentOrder {
  id: string;
  userId: string;
  planId: PlanId;
  provider: PaymentProviderName;
  providerOrderId: string;
  amount: number;
  currency: string;
  status: PaymentOrderStatus;
  receipt: string;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

/**
 * Firestore: payments/{provider}_{providerPaymentId}.
 * The deterministic id makes verification + webhook processing idempotent.
 */
export interface Payment {
  id: string;
  userId: string;
  orderId: string;
  planId: PlanId;
  provider: PaymentProviderName;
  providerOrderId: string;
  providerPaymentId: string;
  providerSignature: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paidAt: IsoDateString | null;
  verifiedAt: IsoDateString | null;
  metadata: Record<string, string>;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

/** Firestore: subscriptions/{userId}. Server-written only; clients may read their own. */
export interface Subscription {
  userId: string;
  planId: PlanId;
  status: "active" | "expired";
  startedAt: IsoDateString;
  expiresAt: IsoDateString | null;
  lastPaymentId: string | null;
  updatedAt: IsoDateString;
}

/** What the browser receives after order creation. Contains no secrets. */
export interface CheckoutOrder {
  orderId: string;
  provider: PaymentProviderName;
  providerOrderId: string;
  amount: number;
  currency: string;
}
