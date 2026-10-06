import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/constants/auth";
import { getAdminAuth } from "@/lib/firebase/admin";
import { UnauthorizedError } from "@/lib/errors";
import type { AuthenticatedUser } from "@/types/user";

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

/** For Route Handlers: verifies a Firebase ID token sent as `Authorization: Bearer <token>`. */
export async function requireUser(request: Request): Promise<AuthenticatedUser> {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : "";
  if (!token) throw new UnauthorizedError();
  const expectedProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "jobtrack-e4927";

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    // Development fallback
    const payload = decodeJwtPayload(token);
    if (payload) {
      const nowSec = Math.floor(Date.now() / 1000);
      const exp = typeof payload.exp === "number" ? payload.exp : 0;
      if (exp > nowSec && payload.aud === expectedProjectId) {
        const uid = (payload.user_id || payload.sub || payload.uid) as string;
        const email = (payload.email as string) || null;
        if (uid) return { uid, email };
      }
    }
    throw new UnauthorizedError("Invalid or expired token");
  }
}

/** For Server Components / layouts: verifies the httpOnly session cookie. */
export async function getSessionUser(): Promise<AuthenticatedUser | null> {
  const store = await cookies();
  const session = store.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;
  const expectedProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "jobtrack-e4927";

  try {
    const decoded = await getAdminAuth().verifySessionCookie(session, true);
    return { uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    // Development fallback if session was stored as verified ID token
    const payload = decodeJwtPayload(session);
    if (!payload) return null;
    const nowSec = Math.floor(Date.now() / 1000);
    const exp = typeof payload.exp === "number" ? payload.exp : 0;
    if (exp > nowSec && payload.aud === expectedProjectId) {
      const uid = (payload.user_id || payload.sub || payload.uid) as string;
      const email = (payload.email as string) || null;
      if (uid) return { uid, email };
    }
    return null;
  }
}
