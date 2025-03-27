import { vi } from 'vitest';
import { GeminiAdapter } from '../services/GeminiAdapter';
import { mockGeminiResponse } from './mocks';

/**
 * Creates a wrapper function that tracks async operations
 */
export const createAsyncTracker = () => {
  let resolvePromise: () => void;
  const trackPromise = new Promise<void>((resolve) => {
    resolvePromise = resolve;
  });

  return {
    waitForAsync: () => trackPromise,
    complete: () => resolvePromise(),
  };
};

/**
 * Creates a mock adapter with pre-configured responses
 */
export const createMockGeminiAdapter = () => {
  const adapter = new GeminiAdapter();
  vi.spyOn(adapter, 'initialize').mockResolvedValue(true);
  vi.spyOn(adapter, 'generateResponse').mockResolvedValue(mockGeminiResponse.text());
  return adapter;
};

/**
 * Simulates a delay in async operations
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates a mock API error response
 */
export const createMockError = (message: string) => ({
  error: new Error(message),
  message,
  code: 'TEST_ERROR'
});

/**
 * Wraps component rendering with necessary providers
 */
export const renderWithProviders = (component: React.ReactElement) => {
  // Implement provider wrapping logic here
  return component;
};

/**
 * Cleans up mocks and spies after tests
 */
export const cleanupMocks = () => {
  vi.clearAllMocks();
  vi.resetModules();
};

/**
 * Creates a mock chat message history
 */
export const createMockChatHistory = (messageCount: number = 3) => {
  const history = [];
  for (let i = 0; i < messageCount; i++) {
    history.push({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i + 1}`,
      timestamp: new Date(Date.now() - (messageCount - i) * 1000).toISOString()
    });
  }
  return history;
};

/**
 * Simulates streaming response chunks
 */
export const createStreamSimulator = (chunks: string[]) => {
  let currentIndex = 0;
  return {
    hasNext: () => currentIndex < chunks.length,
    next: async () => {
      if (currentIndex >= chunks.length) return null;
      await delay(50); // Simulate network delay
      return chunks[currentIndex++];
    }
  };
};

/**
 * Test environment utilities
 */
export const testUtils = {
  mockApiKey: 'test-api-key',
  mockModel: 'gemini-pro',
  mockConfig: {
    temperature: 0.7,
    maxTokens: 1000
  }
};
