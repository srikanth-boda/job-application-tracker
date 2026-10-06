import type { FirebaseApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { clientEnv } from "@/lib/env/client";

/** Enables Firebase App Check in the browser when a reCAPTCHA v3 site key is configured. */
export function initFirebaseAppCheck(app: FirebaseApp): void {
  if (typeof window === "undefined" || !clientEnv.appCheckSiteKey) return;
  if (process.env.NODE_ENV !== "production") {
    (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN =
      true;
  }
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(clientEnv.appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
}
