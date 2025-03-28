
export function handleWebSocketError(event: Event): string {
  if (event instanceof ErrorEvent) {
    return `Network error: ${event.message}`;
  }
  return 'Unknown WebSocket error occurred';
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function logDetailedError(error: unknown, context: Record<string, any> = {}): void {
  console.error('Detailed error:', {
    error: error instanceof Error ? { 
      message: error.message, 
      stack: error.stack,
      name: error.name
    } : error,
    context
  });
}

export function categorizeError(error: unknown): 'network' | 'auth' | 'timeout' | 'server' | 'unknown' {
  const errorMessage = formatErrorMessage(error).toLowerCase();
  
  if (errorMessage.includes('network') || errorMessage.includes('connection') || errorMessage.includes('offline')) {
    return 'network';
  }
  
  if (errorMessage.includes('auth') || errorMessage.includes('key') || errorMessage.includes('permission') || 
      errorMessage.includes('token') || errorMessage.includes('unauthorized') || errorMessage.includes('forbidden')) {
    return 'auth';
  }
  
  if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
    return 'timeout';
  }
  
  if (errorMessage.includes('server') || errorMessage.includes('500') || errorMessage.includes('503')) {
    return 'server';
  }
  
  return 'unknown';
}
