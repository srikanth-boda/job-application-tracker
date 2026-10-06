import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server-auth";
import { readJson, withErrorHandling } from "@/lib/api/route-handler";
import { verifyPaymentRequestSchema } from "@/schemas/payment.schema";
import { getPaymentService } from "@/services/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Verifies the provider signature server-side, then records the payment. Never trusts a client "success" flag. */
export const POST = withErrorHandling(async (request) => {
  const user = await requireUser(request);
  const body = verifyPaymentRequestSchema.parse(await readJson(request));
  const result = await getPaymentService().verifyPayment({ userId: user.uid, ...body });
  return NextResponse.json(result);
});
