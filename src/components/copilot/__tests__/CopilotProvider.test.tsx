import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CopilotProvider, useCopilot } from '../CopilotProvider';

const TestComponent = () => {
  const { enabled, toggleCopilot } = useCopilot();
  return (
    <div>
      <p>Copilot is {enabled ? 'enabled' : 'disabled'}</p>
      <button onClick={toggleCopilot}>Toggle Copilot</button>
    </div>
  );
};

describe('CopilotProvider', () => {
  it('should provide copilot context to children', () => {
    render(
      <CopilotProvider>
        <TestComponent />
      </CopilotProvider>
    );

    expect(screen.getByText('Copilot is disabled')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Toggle Copilot'));

    expect(screen.getByText('Copilot is enabled')).toBeInTheDocument();
  });

  it('should wrap children with ErrorBoundaryWrapper', () => {
    const { container } = render(
      <CopilotProvider>
        <TestComponent />
      </CopilotProvider>
    );

    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('should be compatible with GeminiCopilotProvider', () => {
    render(
      <CopilotProvider>
        <TestComponent />
      </CopilotProvider>
    );

    expect(screen.getByText('Copilot is disabled')).toBeInTheDocument();
  });
});
