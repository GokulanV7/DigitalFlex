export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleSupabaseError = (error: any): AppError => {
  if (error?.code === 'PGRST301') {
    return new AppError('Resource not found', 'NOT_FOUND', 404);
  }
  
  if (error?.code === '23505') {
    return new AppError('Resource already exists', 'DUPLICATE', 409);
  }
  
  if (error?.code === '42501') {
    return new AppError('Insufficient permissions', 'FORBIDDEN', 403);
  }
  
  return new AppError(
    error?.message || 'An unexpected error occurred',
    'UNKNOWN_ERROR',
    500
  );
};

export const handleStripeError = (error: any): AppError => {
  switch (error?.type) {
    case 'card_error':
      return new AppError(error.message, 'PAYMENT_FAILED', 400);
    case 'rate_limit_error':
      return new AppError('Too many requests, please try again later', 'RATE_LIMIT', 429);
    case 'invalid_request_error':
      return new AppError('Invalid payment request', 'INVALID_REQUEST', 400);
    case 'api_error':
      return new AppError('Payment service unavailable', 'SERVICE_ERROR', 503);
    default:
      return new AppError('Payment processing failed', 'PAYMENT_ERROR', 500);
  }
};

export const logError = (error: Error, context?: any) => {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  if (context) {
    console.error('Context:', context);
  }
};
