import type { IsoDateString } from "./common";

/** Firestore: users/{uid}. Entitlements live in `subscriptions/{uid}`, never here. */
export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  timezone: string | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface AuthenticatedUser {
  uid: string;
  email: string | null;
}
