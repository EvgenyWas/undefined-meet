export class HttpError extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.message = message;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

// Common errors
export const BadRequestHttpError = new HttpError(400, 'Bad Request');
export const UnauthorizedHttpError = new HttpError(401, 'Unauthorized');
export const ForbiddenHttpError = new HttpError(403, 'Forbidden');
export const NotFoundHttpError = new HttpError(404, 'Not Found');
export const InternalServerErrorHttpError = new HttpError(
  500,
  'Internal Server Error',
);
