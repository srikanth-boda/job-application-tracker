"use client";

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import type { ForgotPasswordInput, LoginInput, RegisterInput } from "@/schemas/auth.schema";
import { userService } from "@/services/users/user-service";

/** Exchanges the Firebase ID token for an httpOnly session cookie (see app/api/auth/session). */
async function createServerSession(idToken: string): Promise<void> {
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Could not start session");
  }
}

export async function signInWithEmail({ email, password }: LoginInput): Promise<User> {
  const auth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await userService.syncProfile(credential.user).catch((err) => {
    console.warn("Could not sync user profile in Firestore:", err);
  });
  await createServerSession(await credential.user.getIdToken());
  return credential.user;
}

export async function registerWithEmail({
  email,
  password,
  displayName,
}: RegisterInput): Promise<User> {
  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }
  await userService.createProfile(credential.user, displayName).catch((err) => {
    console.warn("Could not create user profile in Firestore:", err);
  });
  await createServerSession(await credential.user.getIdToken(true));
  return credential.user;
}

export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const credential = await signInWithPopup(auth, provider);
  await userService.syncProfile(credential.user).catch((err) => {
    console.warn("Could not sync Google user profile in Firestore:", err);
  });
  await createServerSession(await credential.user.getIdToken());
  return credential.user;
}

export async function sendPasswordReset({ email }: ForgotPasswordInput): Promise<void> {
  await sendPasswordResetEmail(getFirebaseAuth(), email);
}

export async function signOutUser(): Promise<void> {
  try {
    await fetch("/api/auth/session", { method: "DELETE" });
  } catch {
    // Session deletion network failure shouldn't block client sign-out
  }
  await signOut(getFirebaseAuth());
}
