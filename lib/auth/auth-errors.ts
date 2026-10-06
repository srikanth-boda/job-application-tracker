/**
 * Translates Firebase Auth error codes into human-readable messages.
 */
export function getAuthErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "An unexpected error occurred. Please try again.";
  }

  const err = error as { code?: string; message?: string };
  const code = err.code ?? "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password. Please check your credentials.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists. Please sign in instead.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 8 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Please wait a few minutes before trying again.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled. Please enable it in Firebase Console.";
    case "auth/popup-closed-by-user":
      return "Sign-in cancelled. The Google popup was closed.";
    case "auth/popup-blocked":
      return "The popup was blocked by your browser. Please allow popups for this site.";
    case "auth/cancelled-popup-request":
      return "Another authentication request is already in progress.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with the same email address using a different sign-in method.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      if (err.message && !err.message.includes("Firebase:")) {
        return err.message;
      }
      return "Authentication failed. Please verify your details and try again.";
  }
}
