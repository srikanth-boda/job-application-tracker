/** ISO-8601 string. Repositories convert to/from Firestore Timestamps at the data boundary. */
export type IsoDateString = string;

export interface OwnedEntity {
  id: string;
  /** Firebase Auth uid of the owner. Every user-owned document carries this. */
  userId: string;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}
