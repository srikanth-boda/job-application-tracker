import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/constants/auth";
import { ROUTES } from "@/constants/routes";
import { isProtectedPath } from "@/lib/auth/route-guard";

/**
 * Cheap optimistic redirect based on cookie PRESENCE only (Edge runtime cannot use firebase-admin).
 * Real verification happens in app/(dashboard)/layout.tsx and in each Route Handler.
 * Signed-in users visiting /login are redirected by app/(auth)/layout.tsx (verified server-side,
 * which avoids redirect loops caused by expired cookies).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  if (isProtectedPath(pathname) && !hasSession) {
    const url = new URL(ROUTES.login, request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
