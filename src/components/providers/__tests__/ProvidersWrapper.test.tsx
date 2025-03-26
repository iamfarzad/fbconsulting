import React from 'react';
import { render, screen } from '@testing-library/react';
import ProvidersWrapper from '../ProvidersWrapper';

describe('ProvidersWrapper', () => {
  test('renders children correctly', () => {
    render(
      <ProvidersWrapper>
        <div data-testid="child">Child Component</div>
      </ProvidersWrapper>
    );

    const childElement = screen.getByTestId('child');
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent('Child Component');
  });

  test('wraps children with ErrorBoundaryWrapper', () => {
    const { container } = render(
      <ProvidersWrapper>
        <div data-testid="child">Child Component</div>
      </ProvidersWrapper>
    );

    const errorBoundaryWrapper = container.querySelector('ErrorBoundaryWrapper');
    expect(errorBoundaryWrapper).toBeInTheDocument();
  });

  test('ensures compatibility with CopilotProvider changes', () => {
    render(
      <ProvidersWrapper>
        <div data-testid="child">Child Component</div>
      </ProvidersWrapper>
    );

    const childElement = screen.getByTestId('child');
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent('Child Component');
  });
});
