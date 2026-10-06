/** Private Storage path. Must match firebase/storage.rules and the Firestore resume rule. */
export function buildResumeStoragePath(userId: string, resumeId: string): string {
  return `resumes/${userId}/${resumeId}.pdf`;
}
