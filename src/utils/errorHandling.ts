
/**
 * Format error message for display
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
    
    if ('message' in errorObj && typeof errorObj.message === 'string') {
      return errorObj.message;
    }
    
    try {
      return JSON.stringify(errorObj);
    } catch (e) {
      return 'Unknown error object';
    }
  }
  
  return 'An unknown error occurred';
};

/**
 * Log detailed error information for debugging
 */
export const logDetailedError = (error: unknown, context: Record<string, unknown> = {}): void => {
  const errorType = error instanceof Error ? error.constructor.name : typeof error;
  const errorDetails = {
    type: errorType,
    message: formatErrorMessage(error),
    stack: error instanceof Error ? error.stack : undefined,
    context
  };
  
  console.error('Detailed error:', errorDetails);
};

/**
 * Categorize errors for better handling
 */
export const categorizeError = (error: unknown): 'network' | 'auth' | 'timeout' | 'unknown' => {
  const errorStr = formatErrorMessage(error).toLowerCase();
  
  if (errorStr.includes('network') || 
      errorStr.includes('fetch') || 
      errorStr.includes('connection') ||
      errorStr.includes('websocket')) {
    return 'network';
  }
  
  if (errorStr.includes('key') || 
      errorStr.includes('auth') || 
      errorStr.includes('unauthorized') ||
      errorStr.includes('permission') ||
      errorStr.includes('403') ||
      errorStr.includes('401')) {
    return 'auth';
  }
  
  if (errorStr.includes('timeout') || 
      errorStr.includes('timed out')) {
    return 'timeout';
  }
  
  return 'unknown';
};

/**
 * Gracefully handle WebSocket errors
 */
export const handleWebSocketError = (event: Event): string => {
  console.error('WebSocket error:', event);
  
  return 'Connection to AI service failed. The app will continue to work with limited functionality.';
};
