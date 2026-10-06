export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number = 500,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid request") {
    super("validation_error", message, 400);
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super("unauthorized", message, 401);
  }
}
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super("forbidden", message, 403);
  }
}
export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super("not_found", message, 404);
  }
}
export class InvalidSignatureError extends AppError {
  constructor(message = "Invalid payment signature") {
    super("invalid_signature", message, 400);
  }
}
export class ConfigurationError extends AppError {
  constructor(message: string) {
    super("configuration_error", message, 500);
  }
}
export class NotImplementedError extends AppError {
  constructor(feature: string) {
    super("not_implemented", `${feature} is not implemented yet`, 501);
  }
}

/** Used by placeholder service functions. */
export function notImplemented(feature: string): never {
  throw new NotImplementedError(feature);
}
