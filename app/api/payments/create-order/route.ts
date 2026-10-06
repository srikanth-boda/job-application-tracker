import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server-auth";
import { readJson, withErrorHandling } from "@/lib/api/route-handler";
import { createOrderRequestSchema } from "@/schemas/payment.schema";
import { getPaymentService } from "@/services/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Creates a payment order server-side. Amount comes from constants/plans.ts, never the client. */
export const POST = withErrorHandling(async (request) => {
  const user = await requireUser(request);
  const { planId } = createOrderRequestSchema.parse(await readJson(request));
  const order = await getPaymentService().createOrder({ userId: user.uid, planId });
  return NextResponse.json(order);
});
