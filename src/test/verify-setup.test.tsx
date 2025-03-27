import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { setupComponentTest, mockAsyncFn, waitForNextTick } from './utils/component-utils';
import { ApiMockFactory } from './utils/api-mocks';
import { fireEvent } from '@testing-library/react';

interface TestComponentProps {
  onFetch: () => Promise<void>;
}

// Simple test component
const TestComponent: React.FC<TestComponentProps> = ({ onFetch }) => (
  <div data-testid="test-component">
    <button onClick={() => onFetch()}>Fetch Data</button>
  </div>
);

describe('Test Infrastructure Verification', () => {
  // Test Layer 1: Core Environment
  it('has working DOM environment', () => {
    expect(window).toBeDefined();
    expect(document).toBeDefined();
  });

  // Test Layer 2: Utility Layer
  it('has working test utilities', () => {
    const { container } = setupComponentTest(<div>Test</div>);
    expect(container).toBeDefined();
  });

  // Test Layer 3: Component Testing
  it('can render and interact with components', async () => {
    const mockFetch = mockAsyncFn(undefined);
    const { getByRole } = setupComponentTest(
      <TestComponent onFetch={mockFetch} />
    );

    const button = getByRole('button');
    fireEvent.click(button);
    
    await waitForNextTick();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  // Test Layer 4: API Mocking
  it('can mock API calls', async () => {
    const mockData = { message: 'success' };
    const mockApi = ApiMockFactory.success(mockData);
    const mockFetch = ApiMockFactory.mockFetch(mockApi);
    
    global.fetch = mockFetch;
    
    const response = await fetch('/api/test');
    const data = await response.json();
    
    expect(data.data).toEqual(mockData);
  });
});
