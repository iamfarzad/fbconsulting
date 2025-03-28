import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { vi } from 'vitest';

interface SetupOptions extends Omit<RenderOptions, 'wrapper'> {
  initialProps?: Record<string, unknown>;
}

interface SetupResult extends RenderResult {
  rerender: (ui: React.ReactElement) => void;
}

// Basic component test setup
export const setupComponentTest = (
  ui: React.ReactElement,
  options: SetupOptions = {}
): SetupResult => {
  const { initialProps = {}, ...renderOptions } = options;

  // Create result with all testing-library utilities
  const result = render(ui, renderOptions) as SetupResult;

  return {
    ...result,
    rerender: (newUi: React.ReactElement) => result.rerender(newUi),
  };
};

// Mock an async function
export const mockAsyncFn = <T,>(returnValue: T) =>
  vi.fn().mockResolvedValue(returnValue);

// Mock an event handler
export const mockEventHandler = () => vi.fn();

// Helper for testing async operations
export const waitForNextTick = () =>
  new Promise(resolve => setTimeout(resolve, 0));
