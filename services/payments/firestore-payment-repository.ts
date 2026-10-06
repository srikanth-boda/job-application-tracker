import "server-only";
import type { PaymentProviderName } from "@/constants/payments";
import { COLLECTIONS } from "@/constants/firestore";
import { getPlanById } from "@/constants/plans";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type { Payment, PaymentOrder, Subscription } from "@/types/payment";
import type { NewPaymentOrder, PaymentRepository } from "./payment-repository";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Firestore (Admin SDK) implementation. Writes to paymentOrders / payments / subscriptions,
 * which Firestore rules make read-only for clients.
 */
export class FirestorePaymentRepository implements PaymentRepository {
  async saveOrder(order: NewPaymentOrder): Promise<PaymentOrder> {
    const ref = getAdminFirestore().collection(COLLECTIONS.paymentOrders).doc();
    const now = new Date().toISOString();
    const saved: PaymentOrder = { ...order, id: ref.id, createdAt: now, updatedAt: now };
    await ref.set(saved);
    return saved;
  }

  async findOrderByProviderOrderId(
    provider: PaymentProviderName,
    providerOrderId: string,
  ): Promise<PaymentOrder | null> {
    const snapshot = await getAdminFirestore()
      .collection(COLLECTIONS.paymentOrders)
      .where("provider", "==", provider)
      .where("providerOrderId", "==", providerOrderId)
      .limit(1)
      .get();
    const doc = snapshot.docs[0];
    return doc ? (doc.data() as PaymentOrder) : null;
  }

  async recordVerifiedPayment(params: {
    order: PaymentOrder;
    providerPaymentId: string;
    providerSignature: string | null;
  }): Promise<Payment> {
    const { order, providerPaymentId, providerSignature } = params;
    const db = getAdminFirestore();
    const paymentId = `${order.provider}_${providerPaymentId}`; // deterministic => idempotent
    const paymentRef = db.collection(COLLECTIONS.payments).doc(paymentId);
    const orderRef = db.collection(COLLECTIONS.paymentOrders).doc(order.id);
    const subscriptionRef = db.collection(COLLECTIONS.subscriptions).doc(order.userId);

    return db.runTransaction(async (tx) => {
      const existing = await tx.get(paymentRef);
      if (existing.exists) return existing.data() as Payment;

      const now = new Date();
      const nowIso = now.toISOString();
      const plan = getPlanById(order.planId);
      const expiresAt = plan?.accessDurationDays
        ? new Date(now.getTime() + plan.accessDurationDays * DAY_MS).toISOString()
        : null;

      const payment: Payment = {
        id: paymentId,
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
        paidAt: nowIso,
        verifiedAt: nowIso,
        metadata: {},
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      // TODO: when renewing, extend from the current expiry instead of "now".
      const subscription: Subscription = {
        userId: order.userId,
        planId: order.planId,
        status: "active",
        startedAt: nowIso,
        expiresAt,
        lastPaymentId: paymentId,
        updatedAt: nowIso,
      };

      tx.set(paymentRef, payment);
      tx.update(orderRef, { status: "paid", updatedAt: nowIso });
      tx.set(subscriptionRef, subscription);
      return payment;
    });
  }

  async markOrderFailed(orderId: string): Promise<void> {
    await getAdminFirestore()
      .collection(COLLECTIONS.paymentOrders)
      .doc(orderId)
      .update({ status: "failed", updatedAt: new Date().toISOString() });
  }
}
