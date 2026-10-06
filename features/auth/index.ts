// Authentication: Firebase Auth (email/password/Google) + httpOnly session cookie for server rendering.
export { AuthProvider } from "./auth-provider";
export { AuthContext, useAuth, type AuthState } from "./auth-context";
export * from "./auth.service";
