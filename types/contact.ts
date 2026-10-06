import type { OwnedEntity } from "./common";

export interface Contact extends OwnedEntity {
  applicationId: string | null;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  notes: string | null;
}
