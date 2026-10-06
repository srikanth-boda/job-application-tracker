import { beforeEach, describe, expect, it, vi } from "vitest";
import { UnauthorizedError } from "@/lib/errors";

const createOrder = vi.fn();
const requireUser = vi.fn();

vi.mock("@/lib/auth/server-auth", () => ({ requireUser: (r: Request) => requireUser(r) }));
vi.mock("@/services/payments", () => ({ getPaymentService: () => ({ createOrder }) }));

import { POST } from "@/app/api/payments/create-order/route";

function request(body: unknown) {
  return new Request("http://localhost/api/payments/create-order", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/payments/create-order", () => {
  beforeEach(() => {
    createOrder.mockReset();
    requireUser.mockReset();
  });

  it("returns 401 without a valid user", async () => {
    requireUser.mockRejectedValue(new UnauthorizedError());
    const response = await POST(request({ planId: "premium" }));
    expect(response.status).toBe(401);
    expect(createOrder).not.toHaveBeenCalled();
  });

  it("returns 400 for an unknown plan", async () => {
    requireUser.mockResolvedValue({ uid: "u1", email: null });
    const response = await POST(request({ planId: "nope" }));
    expect(response.status).toBe(400);
  });

  it("creates an order for the authenticated user", async () => {
    requireUser.mockResolvedValue({ uid: "u1", email: null });
    createOrder.mockResolvedValue({ orderId: "o1" });
    const response = await POST(request({ planId: "premium" }));
    expect(response.status).toBe(200);
    expect(createOrder).toHaveBeenCalledWith({ userId: "u1", planId: "premium" });
  });
});
