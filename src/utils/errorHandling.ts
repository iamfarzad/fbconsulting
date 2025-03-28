
/**
 * Formats an error message from various error types
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  } else {
    return 'An unknown error occurred';
  }
}

/**
 * Creates a sanitized error object for API responses
 */
export function createErrorResponse(error: unknown): { error: string } {
  return {
    error: formatErrorMessage(error)
  };
}

/**
 * Handles common API errors and returns appropriate status codes
 */
export function handleApiError(error: unknown): { statusCode: number; message: string } {
  const errorMessage = formatErrorMessage(error);
  
  if (errorMessage.includes('not found') || errorMessage.includes('404')) {
    return { statusCode: 404, message: errorMessage };
  } else if (errorMessage.includes('unauthorized') || errorMessage.includes('authentication') || errorMessage.includes('auth')) {
    return { statusCode: 401, message: errorMessage };
  } else if (errorMessage.includes('permission') || errorMessage.includes('forbidden')) {
    return { statusCode: 403, message: errorMessage };
  } else if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
    return { statusCode: 400, message: errorMessage };
  } else if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
    return { statusCode: 408, message: errorMessage };
  } else if (errorMessage.includes('server')) {
    return { statusCode: 500, message: errorMessage };
  } else {
    return { statusCode: 500, message: errorMessage };
  }
}
