
interface ErrorContext {
  [key: string]: any;
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'An unknown error occurred';
}

export function logDetailedError(error: unknown, context: ErrorContext = {}): void {
  console.group('Detailed Error Information');
  
  // Log the error itself
  console.error('Error:', error);
  
  // Log additional context
  if (Object.keys(context).length > 0) {
    console.log('Context:', context);
  }
  
  // Log stack trace if available
  if (error instanceof Error && error.stack) {
    console.log('Stack trace:', error.stack);
  }
  
  // For API errors that might have detailed response information
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as any;
    if (apiError.response) {
      console.log('Response status:', apiError.response.status);
      console.log('Response data:', apiError.response.data);
    }
  }
  
  console.groupEnd();
}

export function categorizeError(error: unknown): 'network' | 'auth' | 'timeout' | 'api' | 'unknown' {
  const errorString = formatErrorMessage(error).toLowerCase();
  
  if (errorString.includes('network') || errorString.includes('offline') || 
      errorString.includes('failed to fetch') || errorString.includes('connection')) {
    return 'network';
  }
  
  if (errorString.includes('api key') || errorString.includes('unauthorized') || 
      errorString.includes('auth') || errorString.includes('permission') || 
      (error && typeof error === 'object' && 'response' in error && 
       (error as any).response?.status === 401 || (error as any).response?.status === 403)) {
    return 'auth';
  }
  
  if (errorString.includes('timeout') || errorString.includes('timed out')) {
    return 'timeout';
  }
  
  if (errorString.includes('api') || 
      (error && typeof error === 'object' && 'response' in error)) {
    return 'api';
  }
  
  return 'unknown';
}
