import { render } from '@testing-library/react';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { GeminiProvider } from '@/components/copilot/providers/GeminiProvider';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Simple wrapper component for providers
const Providers = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <GeminiProvider>{children}</GeminiProvider>
  </BrowserRouter>
);

// Custom render method
const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    wrapper: Providers,
    ...options,
  });

// Re-export everything
export * from '@testing-library/react';
// Override render method
export { customRender as render };
