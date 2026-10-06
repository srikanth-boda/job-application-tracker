"use client";

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { COLLECTIONS } from "@/constants/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import type { UserProfile } from "@/types/user";

/**
 * Service to manage UserProfile documents in Firestore under `users/{uid}`.
 * Strictly honors security rules in `firebase/firestore.rules`.
 */
export const userService = {
  /**
   * Retrieves the user profile document by ID.
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    const userRef = doc(getFirebaseDb(), COLLECTIONS.users, userId);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  },

  /**
   * Creates or overwrites a user profile document in Firestore.
   */
  async createProfile(user: User, displayName?: string | null): Promise<UserProfile> {
    const userRef = doc(getFirebaseDb(), COLLECTIONS.users, user.uid);
    const now = new Date().toISOString();
    const profile: UserProfile = {
      id: user.uid,
      email: user.email || "",
      displayName: displayName ?? user.displayName ?? null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(userRef, profile);
    return profile;
  },

  /**
   * Ensures a user profile exists in Firestore (for Google sign-in or returning users).
   * If it doesn't exist, it creates it; if it does, it updates the `updatedAt` timestamp.
   */
  async syncProfile(user: User): Promise<UserProfile> {
    const userRef = doc(getFirebaseDb(), COLLECTIONS.users, user.uid);
    const snap = await getDoc(userRef);
    const now = new Date().toISOString();

    if (!snap.exists()) {
      const profile: UserProfile = {
        id: user.uid,
        email: user.email || "",
        displayName: user.displayName || null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(userRef, profile);
      return profile;
    }

    const existing = snap.data() as UserProfile;
    const updates: Partial<UserProfile> = {
      updatedAt: now,
    };
    if (!existing.displayName && user.displayName) {
      updates.displayName = user.displayName;
    }

    await updateDoc(userRef, updates);
    return { ...existing, ...updates };
  },
};
