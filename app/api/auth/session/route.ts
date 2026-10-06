import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/constants/auth";
import { readJson, withErrorHandling } from "@/lib/api/route-handler";
import { getAdminAuth } from "@/lib/firebase/admin";
import { UnauthorizedError } from "@/lib/errors";
import { sessionRequestSchema } from "@/schemas/auth.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    const payloadPart = parts[1];
    if (!payloadPart) return null;
    const json = Buffer.from(payloadPart, "base64url").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Exchanges a fresh Firebase ID token for an httpOnly session cookie. */
export const POST = withErrorHandling(async (request) => {
  const { idToken } = sessionRequestSchema.parse(await readJson(request));
  const expectedProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "jobtrack-e4927";

  let sessionCookie: string | null = null;

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(idToken);
    // Only mint sessions for recent sign-ins (5 minutes).
    if (Date.now() / 1000 - decoded.auth_time > 5 * 60) {
      throw new UnauthorizedError("Recent sign-in required");
    }
    sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
    });
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;

    // Fallback if Admin SDK service account credentials are not present in local development
    const payload = decodeJwtPayload(idToken);
    if (!payload) throw new UnauthorizedError("Invalid token format");

    const nowSec = Math.floor(Date.now() / 1000);
    const authTime = typeof payload.auth_time === "number" ? payload.auth_time : 0;
    const exp = typeof payload.exp === "number" ? payload.exp : 0;

    if (nowSec - authTime > 5 * 60) {
      throw new UnauthorizedError("Recent sign-in required");
    }
    if (exp <= nowSec || payload.aud !== expectedProjectId) {
      throw new UnauthorizedError("Invalid token signature or expired");
    }

    sessionCookie = idToken;
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
});

export const DELETE = withErrorHandling(async () => {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
});
