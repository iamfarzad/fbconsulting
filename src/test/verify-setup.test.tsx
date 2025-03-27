import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { setupComponentTest, mockAsyncFn, waitForNextTick } from './utils/component-utils';
import { ApiMockFactory } from './utils/api-mocks';
import { render, fireEvent, screen } from '@testing-library/react';

interface TestComponentProps {
  onFetch: () => Promise<void>;
}

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

  // Test Layer 2: React Testing Library
  it('works with React Testing Library', () => {
    render(<div data-testid="test">Test</div>);
    expect(screen.getByTestId('test')).toHaveTextContent('Test');
  });

  // Test Layer 3: Component Testing
  it('can render and interact with components', async () => {
    const mockFetch = vi.fn();
    render(<TestComponent onFetch={mockFetch} />);
    
    const button = screen.getByRole('button');
    await fireEvent.click(button);
    
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  // Test Layer 4: Async Operations
  it('handles async operations', async () => {
    const mockFn = mockAsyncFn('test-data');
    const result = await mockFn();
    expect(result).toBe('test-data');
  });

  // Test Layer 5: API Mocking
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
