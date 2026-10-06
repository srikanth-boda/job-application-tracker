import type { OwnedEntity } from "./common";

/**
 * Firestore: resumes/{id}. Each uploaded PDF is an immutable version.
 * Only `name` and `archived` may change after creation (enforced by Firestore rules).
 */
export interface Resume extends OwnedEntity {
  name: string;
  originalFileName: string;
  /** Always `resumes/{userId}/{resumeId}.pdf` in private Firebase Storage. */
  storagePath: string;
  contentType: "application/pdf";
  sizeBytes: number;
  archived: boolean;
}
