import { notImplemented } from "@/lib/errors";
import type { CreateContactInput, UpdateContactInput } from "@/schemas/contact.schema";
import type { Contact } from "@/types/contact";

/** PLACEHOLDER data-access layer for contacts/{id}. */
export const contactService = {
  listByApplication: async (_applicationId: string): Promise<Contact[]> =>
    notImplemented("contactService.listByApplication"),
  create: async (_userId: string, _input: CreateContactInput): Promise<Contact> =>
    notImplemented("contactService.create"),
  update: async (_id: string, _input: UpdateContactInput): Promise<void> =>
    notImplemented("contactService.update"),
  remove: async (_id: string): Promise<void> => notImplemented("contactService.remove"),
};
