import "server-only";
import {
  applicationDefault,
  cert,
  getApp,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getServerEnv } from "@/lib/env/server";

/** Server-only Firebase Admin SDK. Never import from client components. */
export function getAdminApp(): App {
  if (getApps().length > 0) return getApp();
  const env = getServerEnv();
  const projectId = env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const hasExplicitCredentials = env.FIREBASE_ADMIN_CLIENT_EMAIL && env.FIREBASE_ADMIN_PRIVATE_KEY;

  return initializeApp({
    projectId,
    credential: hasExplicitCredentials
      ? cert({
          projectId,
          clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        })
      : applicationDefault(),
  });
}

export const getAdminAuth = () => getAuth(getAdminApp());
export const getAdminFirestore = () => getFirestore(getAdminApp());
