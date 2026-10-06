/**
 * Public (browser-safe) configuration. Each NEXT_PUBLIC_* variable must be referenced
 * literally so Next.js can inline it at build time. NEVER add secrets here.
 */
export const clientEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  useEmulators: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true",
  appCheckSiteKey: process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY ?? "",
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyAgEztLYw1e78g-cCQGIIHv3zTQzoqK5XY",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "jobtrack-e4927.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "jobtrack-e4927",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "jobtrack-e4927.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "299515107666",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:299515107666:web:83c4d2ee9e9ebfd225c28b",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-1SC6YGQQBN",
  },
} as const;
