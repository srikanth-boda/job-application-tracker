import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError, ValidationError } from "@/lib/errors";

type Handler = (request: Request) => Promise<Response>;

/** Consistent error shape for every Route Handler: { error: { code, message } }. */
export function withErrorHandling(handler: Handler): Handler {
  return async (request) => {
    try {
      return await handler(request);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            error: {
              code: "validation_error",
              message: "Invalid request",
              issues: error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
            },
          },
          { status: 400 },
        );
      }
      if (error instanceof AppError) {
        return NextResponse.json(
          { error: { code: error.code, message: error.message } },
          { status: error.status },
        );
      }
      console.error("Unhandled route error", error);
      return NextResponse.json(
        { error: { code: "internal_error", message: "Something went wrong" } },
        { status: 500 },
      );
    }
  };
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ValidationError("Request body must be valid JSON");
  }
}
