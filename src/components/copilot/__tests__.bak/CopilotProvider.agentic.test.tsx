import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { CopilotProvider } from '../CopilotProvider';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the Google GenAI adapter
vi.mock('@/services/copilot/googleGenAIAdapter', () => ({
  initializeGoogleGenAI: vi.fn().mockResolvedValue({
    chat: vi.fn().mockResolvedValue({
      text: vi.fn().mockReturnValue('Mock response')
    })
  })
}));

describe('CopilotProvider with agentic features', () => {
  beforeEach(() => {
    // Reset mocks between tests
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    cleanup();
  });

  it('renders children', () => {
    render(
      <CopilotProvider>
        <div>Test Child</div>
      </CopilotProvider>
    );
    
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
  
  it('initializes with agentic config', () => {
    const agentic = {
      proactiveAssistance: true,
      learningEnabled: true,
      contextAwareness: true,
      behaviorPatterns: ['helpful', 'concise']
    };
    
    render(
      <CopilotProvider agentic={agentic}>
        <div>Test Child</div>
      </CopilotProvider>
    );
    
    // You would typically check that the adapter was initialized correctly
    // This would depend on your specific implementation
  });
});
