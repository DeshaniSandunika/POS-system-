export class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export const errorHandler = (err) => {
  if (err instanceof AppError) {
    return { statusCode: err.statusCode, message: err.message };
  }

  if (err.isJoi || err.details) {
    return {
      statusCode: 400,
      message: 'Validation error',
      details: err.details || err.message,
    };
  }

  return {
    statusCode: 500,
    message: 'Internal server error',
  };
};
