import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { createRulesTestEnv, validApplication } from "./rules.helpers";

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await createRulesTestEnv("demo-rules-firestore");
});
afterAll(async () => env.cleanup());
beforeEach(async () => env.clearFirestore());

describe("applications subcollection: users/{userId}/applications/{appId}", () => {
  it("denies anonymous access", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "users/alice/applications/a1")));
    await assertFails(setDoc(doc(db, "users/alice/applications/a1"), validApplication("alice")));
  });

  it("lets the owner create, read, update, and delete their application", async () => {
    const db = env.authenticatedContext("alice").firestore();
    await assertSucceeds(setDoc(doc(db, "users/alice/applications/a1"), validApplication("alice")));
    await assertSucceeds(getDoc(doc(db, "users/alice/applications/a1")));
  });

  it("blocks creating an application in another user's subcollection", async () => {
    const db = env.authenticatedContext("mallory").firestore();
    await assertFails(setDoc(doc(db, "users/alice/applications/a1"), validApplication("alice")));
  });

  it("blocks reading another user's application in their subcollection", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "users/alice/applications/a1"), validApplication("alice"));
    });
    await assertFails(getDoc(doc(env.authenticatedContext("bob").firestore(), "users/alice/applications/a1")));
  });

  it("rejects invalid status values", async () => {
    const db = env.authenticatedContext("alice").firestore();
    await assertFails(
      setDoc(doc(db, "users/alice/applications/a1"), { ...validApplication("alice"), status: "ghosted" }),
    );
  });
});

describe("applications top-level compatibility", () => {
  it("denies anonymous access", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "applications/a1")));
    await assertFails(setDoc(doc(db, "applications/a1"), validApplication("alice")));
  });

  it("lets the owner create and read their application", async () => {
    const db = env.authenticatedContext("alice").firestore();
    await assertSucceeds(setDoc(doc(db, "applications/a1"), validApplication("alice")));
    await assertSucceeds(getDoc(doc(db, "applications/a1")));
  });

  it("blocks creating an application for someone else", async () => {
    const db = env.authenticatedContext("mallory").firestore();
    await assertFails(setDoc(doc(db, "applications/a1"), validApplication("alice")));
  });

  it("blocks reading another user's application", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "applications/a1"), validApplication("alice"));
    });
    await assertFails(getDoc(doc(env.authenticatedContext("bob").firestore(), "applications/a1")));
  });
});

describe("payments are server-write only", () => {
  it("lets the owner read but never write payment records or subscriptions", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "payments/razorpay_pay_1"), {
        userId: "alice",
        amount: 100,
      });
      await setDoc(doc(ctx.firestore(), "subscriptions/alice"), {
        userId: "alice",
        planId: "free",
      });
    });
    const db = env.authenticatedContext("alice").firestore();
    await assertSucceeds(getDoc(doc(db, "payments/razorpay_pay_1")));
    await assertFails(setDoc(doc(db, "payments/razorpay_pay_2"), { userId: "alice", amount: 1 }));
    await assertFails(
      setDoc(doc(db, "subscriptions/alice"), { userId: "alice", planId: "premium" }),
    );
    await assertFails(
      getDoc(doc(env.authenticatedContext("bob").firestore(), "payments/razorpay_pay_1")),
    );
  });
});
