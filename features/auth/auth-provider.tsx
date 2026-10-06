"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { AuthContext } from "./auth-context";
import { signOutUser } from "./auth.service";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, (next) => {
        setUser(next);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch {
      // Firebase not configured yet (missing NEXT_PUBLIC_FIREBASE_* values).
      setLoading(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOutUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}
