import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { COLLECTIONS } from "@/constants/firestore";
import { getFirebaseDb, getFirebaseStorage } from "@/lib/firebase/client";
import type { Application } from "@/types/application";
import type { Resume } from "@/types/resume";
import { buildResumeStoragePath } from "./resume-storage-path";

/**
 * Storage & Firestore data-access layer for resumes.
 * Conforms to `firebase/storage.rules` and `firebase/firestore.rules`.
 */
export const resumeService = {
  /**
   * Lists all non-archived resumes owned by the user.
   */
  list: async (userId: string): Promise<Resume[]> => {
    const q = query(
      collection(getFirebaseDb(), COLLECTIONS.resumes),
      where("userId", "==", userId),
      where("archived", "==", false),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Resume);
  },

  /**
   * Uploads a resume PDF to Firebase Storage and registers it in Firestore.
   * Never stores PDF binaries in Firestore.
   */
  upload: async (userId: string, file: File, name: string): Promise<Resume & { downloadUrl: string }> => {
    if (file.type !== "application/pdf") {
      throw new Error("Only PDF files are supported");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Resume PDF size must not exceed 5MB");
    }

    const db = getFirebaseDb();
    const storage = getFirebaseStorage();
    const resumeRef = doc(collection(db, COLLECTIONS.resumes));
    const resumeId = resumeRef.id;
    const sanitizedResumeId = resumeId.replace(/[^A-Za-z0-9_-]/g, "_");
    const storagePath = buildResumeStoragePath(userId, sanitizedResumeId);
    const storageRef = ref(storage, storagePath);

    // Upload to Firebase Storage
    await uploadBytes(storageRef, file, { contentType: "application/pdf" });
    const downloadUrl = await getDownloadURL(storageRef);

    const now = new Date().toISOString();
    const resume: Resume = {
      id: sanitizedResumeId,
      userId,
      name: name.trim() || file.name,
      originalFileName: file.name,
      storagePath,
      contentType: "application/pdf",
      sizeBytes: file.size,
      archived: false,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(resumeRef, resume);
    return { ...resume, downloadUrl };
  },

  rename: async (resumeId: string, name: string): Promise<void> => {
    const resumeRef = doc(getFirebaseDb(), COLLECTIONS.resumes, resumeId);
    await updateDoc(resumeRef, {
      name: name.trim(),
      updatedAt: new Date().toISOString(),
    });
  },

  archive: async (resumeId: string): Promise<void> => {
    const resumeRef = doc(getFirebaseDb(), COLLECTIONS.resumes, resumeId);
    await updateDoc(resumeRef, {
      archived: true,
      updatedAt: new Date().toISOString(),
    });
  },

  getDownloadUrl: async (resume: Resume): Promise<string> => {
    const storage = getFirebaseStorage();
    const storageRef = ref(storage, resume.storagePath);
    return getDownloadURL(storageRef);
  },

  listApplicationsUsingResume: async (resumeId: string): Promise<Application[]> => {
    const q = query(
      collection(getFirebaseDb(), COLLECTIONS.applications),
      where("resumeId", "==", resumeId),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Application);
  },
};
