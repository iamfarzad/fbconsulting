
/**
 * Formats an error message from different error types
 */
export const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'An unknown error occurred';
};

/**
 * Logs detailed error information for debugging
 */
export const logDetailedError = (error: any, context: Record<string, any> = {}): void => {
  console.error('Error details:', {
    message: formatErrorMessage(error),
    stack: error instanceof Error ? error.stack : undefined,
    context
  });
};

/**
 * Categorizes errors by type for appropriate handling
 */
export const categorizeError = (error: any): 'api' | 'auth' | 'validation' | 'unknown' => {
  const errorMessage = formatErrorMessage(error).toLowerCase();
  
  if (errorMessage.includes('network') || 
      errorMessage.includes('connect') || 
      errorMessage.includes('timeout')) {
    return 'api';
  }
  
  if (errorMessage.includes('auth') || 
      errorMessage.includes('key') || 
      errorMessage.includes('permission') ||
      errorMessage.includes('credential')) {
    return 'auth';
  }
  
  if (errorMessage.includes('valid') || 
      errorMessage.includes('required') || 
      errorMessage.includes('empty') ||
      errorMessage.includes('format')) {
    return 'validation';
  }
  
  return 'unknown';
};
