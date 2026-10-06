import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PaymentStatus } from "@/components/payments/PaymentStatus";

describe("<PaymentStatus />", () => {
  it("renders a human label for the status", () => {
    render(<PaymentStatus status="verified" />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });
});
