import { vi } from 'vitest';

// Types for API responses
interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

// API Mock Factory
export class ApiMockFactory {
  private static defaultHeaders = {
    'Content-Type': 'application/json'
  };

  static success<T>(data: T): ApiResponse<T> {
    return {
      data,
      status: 200
    };
  }

  static error(message: string, status = 400): ApiResponse {
    return {
      error: message,
      status
    };
  }

  // Mock fetch responses
  static mockFetch(response: ApiResponse) {
    return vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: response.status < 400,
        status: response.status,
        json: () => Promise.resolve(response),
        headers: new Headers(this.defaultHeaders)
      })
    );
  }

  // Mock WebSocket
  static createMockWebSocket() {
    const mockWs = {
      send: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      readyState: WebSocket.OPEN,
    };

    return mockWs;
  }

  // Mock EventSource
  static createMockEventSource() {
    return {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      close: vi.fn(),
      readyState: EventSource.OPEN,
    };
  }
}

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Mock API endpoints
export const mockEndpoints = {
  gemini: '/api/gemini',
  chat: '/api/chat',
  audio: '/api/audio',
};

// API error messages
export const apiErrors = {
  network: 'Network Error',
  unauthorized: 'Unauthorized',
  notFound: 'Not Found',
  server: 'Internal Server Error',
};
