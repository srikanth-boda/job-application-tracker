import { z } from "zod";
import { PLAN_IDS } from "@/constants/plans";

/** The client only says WHICH plan. The amount is always taken from constants/plans.ts. */
export const createOrderRequestSchema = z.object({
  planId: z.enum(PLAN_IDS),
});

/** Provider-neutral. The client maps the provider's checkout response onto these fields. */
export const verifyPaymentRequestSchema = z.object({
  providerOrderId: z.string().min(1).max(100),
  providerPaymentId: z.string().min(1).max(100),
  signature: z.string().min(1).max(512),
});

export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;
export type VerifyPaymentRequest = z.infer<typeof verifyPaymentRequestSchema>;
