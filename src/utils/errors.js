export class ValidationError extends Error {
  constructor(message = "Validation failed") {
    super(message);
    this.status = 422;
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.status = 404;
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(message = "Resource already exists") {
    super(message);
    this.status = 409;
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.status = 401;
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.status = 403;
    this.name = "ForbiddenError";
  }
}
