"use client";

import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { clientEnv } from "@/lib/env/client";
import { initFirebaseAppCheck } from "./app-check";

/**
 * Firebase Web Client configuration.
 * Populated from environment variables with defaults for jobtrack-e4927.
 */
export const firebaseConfig: FirebaseOptions = {
  apiKey: clientEnv.firebase.apiKey,
  authDomain: clientEnv.firebase.authDomain,
  projectId: clientEnv.firebase.projectId,
  storageBucket: clientEnv.firebase.storageBucket,
  messagingSenderId: clientEnv.firebase.messagingSenderId,
  appId: clientEnv.firebase.appId,
  measurementId: clientEnv.firebase.measurementId,
};

let emulatorsConnected = false;
let analyticsInstance: Analytics | null = null;

/**
 * Lazy getters: nothing initialises at import time, so server rendering and
 * `next build` never touch Firebase. Call these from effects / event handlers.
 */
export function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) return getApp();
  const app = initializeApp(firebaseConfig);
  initFirebaseAppCheck(app);
  return app;
}

function connectEmulatorsOnce(): void {
  if (emulatorsConnected || !clientEnv.useEmulators) return;
  const app = getFirebaseApp();
  connectAuthEmulator(getAuth(app), "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(getFirestore(app), "127.0.0.1", 8080);
  connectStorageEmulator(getStorage(app), "127.0.0.1", 9199);
  emulatorsConnected = true;
}

export function getFirebaseAuth(): Auth {
  connectEmulatorsOnce();
  return getAuth(getFirebaseApp());
}

/**
 * Cloud Firestore Database client instance
 */
export function getFirebaseDb(): Firestore {
  connectEmulatorsOnce();
  return getFirestore(getFirebaseApp());
}

export function getFirebaseStorage(): FirebaseStorage {
  connectEmulatorsOnce();
  return getStorage(getFirebaseApp());
}

/**
 * Safe client-side Firebase Analytics getter (SSR / Next.js safe)
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (!analyticsInstance) {
    const supported = await isSupported().catch(() => false);
    if (supported) {
      analyticsInstance = getAnalytics(getFirebaseApp());
    }
  }
  return analyticsInstance;
}

// Proxied direct exports for ergonomics (allows `import { db, auth } from "@/lib/firebase/client"`)
export const app: FirebaseApp = new Proxy({} as FirebaseApp, {
  get(_target, prop, receiver) {
    return Reflect.get(getFirebaseApp(), prop, receiver);
  },
});

export const db: Firestore = new Proxy({} as Firestore, {
  get(_target, prop, receiver) {
    return Reflect.get(getFirebaseDb(), prop, receiver);
  },
});

export const auth: Auth = new Proxy({} as Auth, {
  get(_target, prop, receiver) {
    return Reflect.get(getFirebaseAuth(), prop, receiver);
  },
});

export const storage: FirebaseStorage = new Proxy({} as FirebaseStorage, {
  get(_target, prop, receiver) {
    return Reflect.get(getFirebaseStorage(), prop, receiver);
  },
});

// Re-export common database and SDK helpers
export { getFirestore } from "firebase/firestore";
export { getAuth } from "firebase/auth";
export { getStorage } from "firebase/storage";
