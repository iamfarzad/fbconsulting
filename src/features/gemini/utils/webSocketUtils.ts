
import API_CONFIG from '@/config/apiConfigConfig';

/**
 * Construct a WebSocket URL from the base URL, path, and client ID
 */
export function constructWebSocketUrl(clientId: string, customUrl?: string): string {
  if (customUrl) return customUrl;
  
  const wsBaseUrl = API_CONFIG.WS_BASE_URL;
  const wsPath = API_CONFIG.WEBSOCKET.PATH;
  return `${wsBaseUrl}${wsPath}${clientId}`;
}

/**
 * Calculate reconnection delay with exponential backoff
 */
export function calculateReconnectDelay(attemptNumber: number): number {
  const baseDelay = API_CONFIG.WEBSOCKET.RECONNECT_DELAY;
  const calculatedDelay = baseDelay * Math.pow(2, attemptNumber - 1);
  
  // Cap the maximum delay at 30 seconds
  return Math.min(calculatedDelay, 30000);
}

/**
 * Parse binary data from a WebSocket message
 */
export function parseBinaryMessage(data: Blob | ArrayBuffer): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    if (data instanceof ArrayBuffer) {
      resolve(data);
      return;
    }
    
    if (data instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert Blob to ArrayBuffer'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading Blob data'));
      reader.readAsArrayBuffer(data);
      return;
    }
    
    reject(new Error('Unsupported binary data format'));
  });
}

/**
 * Encode message to base64
 */
export function encodeBase64Message(message: string): string {
  return btoa(message);
}

/**
 * Decode base64 message
 */
export function decodeBase64Message(base64: string): string {
  return atob(base64);
}

/**
 * Parse JSON message safely
 */
export function parseJsonMessage(message: string): any {
  try {
    return JSON.parse(message);
  } catch (error) {
    console.error('Failed to parse WebSocket message:', error);
    throw new Error('Invalid JSON message');
  }
}

/**
 * Create a message object for sending
 */
export function createTextMessage(text: string, enableTTS: boolean = true) {
  return {
    type: 'text_message',
    text,
    enableTTS,
    role: 'user'
  };
}

/**
 * Create a multimodal message object for sending
 */
export function createMultimodalMessage(
  text: string, 
  files: { mimeType: string; data: string }[], 
  enableTTS: boolean = true
) {
  return {
    type: 'multimodal_message',
    text,
    files,
    enableTTS,
    role: 'user'
  };
}
