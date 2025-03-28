import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';

// 1. Basic environment setup
beforeAll(() => {
  // Ensure we have a window object
  if (typeof window === 'undefined') {
    throw new Error('Test environment must include DOM');
  }
});

// 2. Essential mocks
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock ResizeObserver
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// 3. Cleanup utilities
afterEach(() => {
  vi.clearAllMocks();
  mockFetch.mockReset();
  document.body.innerHTML = ''; // Clean up DOM
});

afterAll(() => {
  vi.restoreAllMocks();
});

// 4. Error handling for async operations
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
