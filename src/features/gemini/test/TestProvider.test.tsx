import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestProvider, withTestProvider } from './TestProvider';
import { createMockGeminiAdapter } from './utils';

describe('TestProvider', () => {
  it('should render children', () => {
    render(
      <TestProvider>
        <div data-testid="test-child">Test Content</div>
      </TestProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should provide mock adapter', () => {
    const mockAdapter = createMockGeminiAdapter();
    const TestComponent = () => {
      // Add context usage test when context is implemented
      return <div>Test Component</div>;
    };

    render(
      <TestProvider mockAdapter={mockAdapter}>
        <TestComponent />
      </TestProvider>
    );
  });

  it('should work with HOC pattern', () => {
    const TestComponent = () => <div data-testid="hoc-test">HOC Test</div>;
    const WrappedComponent = withTestProvider(TestComponent);

    render(<WrappedComponent />);
    expect(screen.getByTestId('hoc-test')).toBeInTheDocument();
  });
});
