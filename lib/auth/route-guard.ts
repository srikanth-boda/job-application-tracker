import { AUTH_ROUTES, PROTECTED_ROUTE_PREFIXES } from "@/constants/routes";

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));
}

export function isAuthPath(pathname: string): boolean {
  return AUTH_ROUTES.includes(pathname);
}
