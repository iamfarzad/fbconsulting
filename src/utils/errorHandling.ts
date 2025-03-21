/**
 * Error handling utilities for API connections and service initialization
 */

/**
 * Formats an error object into a user-friendly message
 * @param error The error object to format
 * @returns A user-friendly error message string
 */
export function formatErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return 'An unknown error occurred';
  }
  
  /**
   * Logs detailed error information to the console
   * @param error The error object to log
   * @param context Additional context information
   */
  export function logDetailedError(error: unknown, context: Record<string, unknown> = {}): void {
    console.error('Error details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      ...context
    });
  }
  
  /**
   * Determines if an error is related to API connectivity
   * @param error The error to check
   * @returns True if the error is related to API connectivity
   */
  export function isApiConnectionError(error: unknown): boolean {
    const errorMessage = error instanceof Error ? error.message.toLowerCase() : 
                        typeof error === 'string' ? error.toLowerCase() : '';
    
    return errorMessage.includes('api') || 
           errorMessage.includes('network') || 
           errorMessage.includes('connection') ||
           errorMessage.includes('fetch') ||
           errorMessage.includes('timeout');
  }
  
  /**
   * Categorizes an error based on its content
   * @param error The error to categorize
   * @returns The error category
   */
  export function categorizeError(error: unknown): 'api' | 'auth' | 'validation' | 'unknown' {
    const errorMessage = error instanceof Error ? error.message.toLowerCase() : 
                        typeof error === 'string' ? error.toLowerCase() : '';
    
    if (errorMessage.includes('api') || 
        errorMessage.includes('network') || 
        errorMessage.includes('connection')) {
      return 'api';
    }
    
    if (errorMessage.includes('auth') || 
        errorMessage.includes('key') || 
        errorMessage.includes('token') ||
        errorMessage.includes('permission')) {
      return 'auth';
    }
    
    if (errorMessage.includes('valid') || 
        errorMessage.includes('format') || 
        errorMessage.includes('required')) {
      return 'validation';
    }
    
    return 'unknown';
  }