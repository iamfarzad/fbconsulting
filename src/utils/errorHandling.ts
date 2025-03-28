
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
