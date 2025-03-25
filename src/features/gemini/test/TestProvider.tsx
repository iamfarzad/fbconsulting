import React from 'react';
import { vi } from 'vitest';
import { createMockGeminiAdapter } from './utils';
import { testUtils } from './utils';

interface TestProviderProps {
  children: React.ReactNode;
  mockAdapter?: ReturnType<typeof createMockGeminiAdapter>;
  mockConfig?: typeof testUtils.mockConfig;
  initialState?: {
    isReady?: boolean;
    error?: Error | null;
    isLoading?: boolean;
  };
}

/**
 * Test provider that wraps components with mocked Gemini context
 */
export const TestProvider: React.FC<TestProviderProps> = ({
  children,
  mockAdapter = createMockGeminiAdapter(),
  mockConfig = testUtils.mockConfig,
  initialState = {
    isReady: true,
    error: null,
    isLoading: false
  }
}) => {
  // Mock context values
  const contextValue = {
    adapter: mockAdapter,
    config: mockConfig,
    state: {
      ...initialState,
      initialize: vi.fn().mockResolvedValue(true),
      submitMessage: vi.fn().mockImplementation(async (message: string) => {
        return mockAdapter.generateResponse(message);
      })
    }
  };

  return (
    <div data-testid="gemini-test-provider">
      {/* Implement actual provider wrapping here when context is ready */}
      {children}
    </div>
  );
};

/**
 * HOC to wrap components with TestProvider
 */
export const withTestProvider = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  providerProps?: Omit<TestProviderProps, 'children'>
) => {
  return function WithTestProvider(props: P) {
    return (
      <TestProvider {...providerProps}>
        <WrappedComponent {...props} />
      </TestProvider>
    );
  };
};

/**
 * Custom hook for accessing test context in tests
 */
export const useTestContext = () => {
  // Implement context hook when ready
  return {
    adapter: createMockGeminiAdapter(),
    config: testUtils.mockConfig,
    state: {
      isReady: true,
      error: null,
      isLoading: false
    }
  };
};

/**
 * Test utilities for working with the provider
 */
export const testProviderUtils = {
  /**
   * Creates a mocked provider state
   */
  createMockState: (overrides = {}) => ({
    isReady: true,
    error: null,
    isLoading: false,
    ...overrides
  }),

  /**
   * Creates test render options
   */
  createRenderOptions: (providerProps?: TestProviderProps) => ({
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <TestProvider {...providerProps}>{children}</TestProvider>
    )
  })
};
