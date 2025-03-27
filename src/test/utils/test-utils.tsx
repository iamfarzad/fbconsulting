import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

// Mock response generator
export const createMockResponse = <T,>(data: T) => ({
  ok: true,
  json: async () => data,
  status: 200,
  statusText: 'OK'
});

// Mock error response
export const createErrorResponse = (status = 500, statusText = 'Internal Server Error') => ({
  ok: false,
  json: async () => ({ error: statusText }),
  status,
  statusText
});

// Common test context providers can be added here
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

// Custom render method
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Common mock generators
export const createMockFn = () => vi.fn();
export const createAsyncMockFn = <T,>(returnValue: T) => 
  vi.fn().mockResolvedValue(returnValue);

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
