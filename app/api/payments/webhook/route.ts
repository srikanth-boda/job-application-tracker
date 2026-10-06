import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api/route-handler";
import { getPaymentService } from "@/services/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Provider webhook. No user auth - authenticity comes from the provider's signature,
 * verified against the RAW body inside the provider implementation.
 */
export const POST = withErrorHandling(async (request) => {
  const rawBody = await request.text();
  const result = await getPaymentService().handleWebhook({ rawBody, headers: request.headers });
  return NextResponse.json({ received: true, handled: result.handled });
});
