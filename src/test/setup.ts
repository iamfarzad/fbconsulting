import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';

// Extend the global Window interface for our test environment
declare global {
  interface Window {
    ResizeObserver: ResizeObserverConstructor;
  }
}

interface ResizeObserverEntry {
  target: Element;
  contentRect: DOMRectReadOnly;
  borderBoxSize: ReadonlyArray<ResizeObserverSize>;
  contentBoxSize: ReadonlyArray<ResizeObserverSize>;
}

interface ResizeObserverConstructor {
  new (callback: ResizeObserverCallback): ResizeObserver;
  prototype: ResizeObserver;
}

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

// Mock ResizeObserver which is commonly needed
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock fetch if needed
global.fetch = vi.fn();

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});
