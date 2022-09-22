export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): {
    message: string;
    field?: string;
  };
}

export class RequestValidationPayloadError extends CustomError {
  statusCode = 400;
  params: string | undefined;
  constructor(message: string, params?: string, statusCode?: number) {
    super(message);
    this.params = params;
    this.statusCode = statusCode ? statusCode : this.statusCode;

    Object.setPrototypeOf(this, RequestValidationPayloadError.prototype);
  }

  serializeErrors() {
    return {
      message: this.message,
      field: this.params,
    };
  }
}

export class ConflictDatabaseError extends CustomError {
  statusCode = 400;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ConflictDatabaseError.prototype);
  }

  serializeErrors() {
    return {
      message: this.message,
    };
  }
}

export class APIError extends CustomError {
  statusCode = 401;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode ? statusCode : this.statusCode;

    Object.setPrototypeOf(this, APIError.prototype);
  }

  serializeErrors() {
    return {
      message: this.message,
    };
  }
}

export class DatabaseError extends CustomError {
  statusCode = 500;

  constructor() {
    super('Internal server error');

    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  serializeErrors() {
    return {
      message: this.message,
    };
  }
}

export class ExternalServiceError extends CustomError {
  statusCode = 500;

  constructor() {
    super('External server error');

    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
  serializeErrors() {
    return {
      message: this.message,
    };
  }
}
