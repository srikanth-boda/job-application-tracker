import { describe, expect, it, vi, beforeEach } from "vitest";
import { applicationService } from "@/services/applications/application-service";
import * as firestore from "firebase/firestore";

vi.mock("firebase/firestore", () => {
  const collectionMock = vi.fn((_db, ...paths) => ({ type: "collection", path: paths.join("/") }));
  const docMock = vi.fn((...args) => {
    if (args.length === 1 && typeof args[0] === "object") {
      return { id: "mock-auto-id-123", parent: args[0] };
    }
    return { id: args[args.length - 1], path: args.slice(1).join("/") };
  });

  return {
    collection: collectionMock,
    doc: docMock,
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    onSnapshot: vi.fn(),
    serverTimestamp: vi.fn(() => "MOCK_SERVER_TIMESTAMP"),
    Timestamp: {
      fromDate: vi.fn((d: Date) => ({ toDate: () => d, toMillis: () => d.getTime() })),
      now: vi.fn(() => ({ toDate: () => new Date(), toMillis: () => Date.now() })),
    },
    writeBatch: vi.fn(() => ({
      update: vi.fn(),
      set: vi.fn(),
      commit: vi.fn().mockResolvedValue(undefined),
    })),
  };
});

vi.mock("@/lib/firebase/client", () => ({
  getFirebaseDb: vi.fn(() => ({})),
  getFirebaseAuth: vi.fn(() => ({
    currentUser: { uid: "user-alice-123" },
  })),
}));

describe("applicationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createApplication targets users/{uid}/applications subcollection with auto-generated ID and server timestamps", async () => {
    const mockSetDoc = vi.mocked(firestore.setDoc);
    mockSetDoc.mockResolvedValueOnce(undefined as never);

    const input = {
      companyName: "Google",
      jobTitle: "Software Engineer",
      source: "linkedin" as const,
      status: "applied" as const,
      appliedAt: "2026-04-10",
      location: "Mountain View, CA",
      workMode: "remote",
      resumeName: "Resume.pdf",
    };

    const app = await applicationService.createApplication("user-alice-123", input);

    expect(firestore.collection).toHaveBeenCalledWith(
      expect.anything(),
      "users",
      "user-alice-123",
      "applications",
    );
    expect(mockSetDoc).toHaveBeenCalledTimes(1);

    const savedDoc = mockSetDoc.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(savedDoc?.userId).toBe("user-alice-123");
    expect(savedDoc?.companyName).toBe("Google");
    expect(savedDoc?.jobTitle).toBe("Software Engineer");
    expect(savedDoc?.workMode).toBe("remote");
    expect(savedDoc?.createdAt).toBe("MOCK_SERVER_TIMESTAMP");
    expect(savedDoc?.updatedAt).toBe("MOCK_SERVER_TIMESTAMP");
    expect(app.id).toBe("mock-auto-id-123");
  });

  it("getApplications retrieves applications for user from subcollection", async () => {
    const mockGetDocs = vi.mocked(firestore.getDocs);
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        {
          id: "app-1",
          data: () => ({
            companyName: "Google",
            jobTitle: "Software Engineer",
            source: "linkedin",
            status: "applied",
            appliedAt: "2026-04-10",
          }),
        },
        {
          id: "app-2",
          data: () => ({
            companyName: "Microsoft",
            jobTitle: "Senior Engineer",
            source: "indeed",
            status: "interview",
            appliedAt: "2026-04-12",
          }),
        },
      ],
    } as never);

    const apps = await applicationService.getApplications("user-alice-123");

    expect(firestore.collection).toHaveBeenCalledWith(
      expect.anything(),
      "users",
      "user-alice-123",
      "applications",
    );
    expect(apps).toHaveLength(2);
    // Should be sorted by date descending (app-2 then app-1)
    expect(apps[0]?.id).toBe("app-2");
    expect(apps[1]?.id).toBe("app-1");
  });

  it("getApplication retrieves single application from users/{uid}/applications/{appId}", async () => {
    const mockGetDoc = vi.mocked(firestore.getDoc);
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      id: "app-123",
      data: () => ({
        companyName: "Apple",
        jobTitle: "iOS Dev",
        source: "company_portal",
        status: "offer",
      }),
    } as never);

    const app = await applicationService.getApplication("app-123", "user-alice-123");

    expect(firestore.doc).toHaveBeenCalledWith(
      expect.anything(),
      "users",
      "user-alice-123",
      "applications",
      "app-123",
    );
    expect(app).not.toBeNull();
    expect(app?.companyName).toBe("Apple");
  });

  it("updateApplication updates document at users/{uid}/applications/{appId}", async () => {
    const mockUpdateDoc = vi.mocked(firestore.updateDoc);
    mockUpdateDoc.mockResolvedValueOnce(undefined as never);

    await applicationService.updateApplication(
      "app-123",
      { companyName: "Netflix", jobTitle: "Lead UI" },
      "user-alice-123",
    );

    expect(firestore.doc).toHaveBeenCalledWith(
      expect.anything(),
      "users",
      "user-alice-123",
      "applications",
      "app-123",
    );
    expect(mockUpdateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        companyName: "Netflix",
        jobTitle: "Lead UI",
        updatedAt: "MOCK_SERVER_TIMESTAMP",
      }),
    );
  });

  it("deleteApplication deletes document at users/{uid}/applications/{appId}", async () => {
    const mockDeleteDoc = vi.mocked(firestore.deleteDoc);
    mockDeleteDoc.mockResolvedValueOnce(undefined as never);

    await applicationService.deleteApplication("app-123", "user-alice-123");

    expect(firestore.doc).toHaveBeenCalledWith(
      expect.anything(),
      "users",
      "user-alice-123",
      "applications",
      "app-123",
    );
    expect(mockDeleteDoc).toHaveBeenCalledTimes(1);
  });

  it("subscribeToApplications establishes onSnapshot listener on users/{uid}/applications", () => {
    const mockOnSnapshot = vi.mocked(firestore.onSnapshot);
    const unsubscribeFn = vi.fn();
    mockOnSnapshot.mockReturnValueOnce(unsubscribeFn as never);

    const onUpdate = vi.fn();
    const unsub = applicationService.subscribeToApplications("user-alice-123", onUpdate);

    expect(firestore.collection).toHaveBeenCalledWith(
      expect.anything(),
      "users",
      "user-alice-123",
      "applications",
    );
    expect(mockOnSnapshot).toHaveBeenCalledTimes(1);
    expect(unsub).toBe(unsubscribeFn);
  });
});
