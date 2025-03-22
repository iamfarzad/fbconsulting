
/**
 * Error handling utilities for consistent error management
 */

// Define error categories for better organization
export type ErrorCategory = 'api' | 'auth' | 'validation' | 'unknown' | 'ui';

/**
 * Formats error messages to be user-friendly
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  } else {
    return 'An unknown error occurred';
  }
}

/**
 * Categorizes errors to handle them appropriately
 */
export function categorizeError(error: unknown): ErrorCategory {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('api') || message.includes('network') || message.includes('fetch') || message.includes('request')) {
      return 'api';
    } else if (message.includes('auth') || message.includes('unauthorized') || message.includes('forbidden') || message.includes('permission') || message.includes('key')) {
      return 'auth';
    } else if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return 'validation';
    } else if (message.includes('ui') || message.includes('render') || message.includes('component')) {
      return 'ui';
    }
  }
  
  return 'unknown';
}

/**
 * Logs detailed error information for debugging
 */
export function logDetailedError(error: unknown, context: Record<string, any> = {}): void {
  console.error('Error details:', {
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
    category: categorizeError(error),
    context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Creates a user-friendly error message based on the error category
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const category = categorizeError(error);
  
  switch (category) {
    case 'api':
      return 'There was a problem connecting to the server. Please check your internet connection and try again.';
    case 'auth':
      return 'Authentication failed. Please check your credentials or API key and try again.';
    case 'validation':
      return 'There was an issue with the data provided. Please check your inputs and try again.';
    case 'ui':
      return 'There was a problem with the user interface. Please refresh the page and try again.';
    default:
      return 'An unexpected error occurred. Please try again later.';
  }
}

export default {
  formatErrorMessage,
  categorizeError,
  logDetailedError,
  getUserFriendlyErrorMessage
};
