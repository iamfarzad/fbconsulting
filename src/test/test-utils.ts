import { vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

export const mockApiKey = 'test-api-key';

export const mockUseApiKeyManagement = vi.fn().mockReturnValue({
  apiKey: mockApiKey,
});

// Custom render function that includes providers if needed
export const renderWithProviders = (ui: ReactElement) => {
  return render(ui);
};

// Setup function for common test setup
export const setupTest = () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
};

// Re-export everything from testing-library
export * from '@testing-library/react';
