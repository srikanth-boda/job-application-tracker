import type { VerifyPaymentRequest } from "@/schemas/payment.schema";
import type { PlanId } from "@/constants/plans";
import type { CheckoutOrder } from "@/types/payment";

/** Browser-side calls to our own payment API. Provider-agnostic. */
async function post<T>(url: string, idToken: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error?.message ?? "Payment request failed");
  return data as T;
}

export const createPaymentOrder = (idToken: string, planId: PlanId) =>
  post<CheckoutOrder>("/api/payments/create-order", idToken, { planId });

export const verifyPayment = (idToken: string, payload: VerifyPaymentRequest) =>
  post<{ paymentId: string; status: string }>("/api/payments/verify", idToken, payload);
