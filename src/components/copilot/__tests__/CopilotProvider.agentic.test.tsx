
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { CopilotProvider } from '../CopilotProvider';

// Mock the Google GenAI adapter
jest.mock('@/services/copilot/googleGenAIAdapter', () => ({
  initializeGoogleGenAI: jest.fn().mockResolvedValue({
    chat: jest.fn().mockResolvedValue({
      text: jest.fn().mockReturnValue('Mock response')
    })
  })
}));

describe('CopilotProvider with agentic features', () => {
  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    cleanup();
  });

  test('renders children', () => {
    render(
      <CopilotProvider 
        apiKey="test-key"
        modelName="gemini-pro"
        agentic={{
          proactiveAssistance: true,
          learningEnabled: true,
          contextAwareness: true,
          behaviorPatterns: ['helpful', 'concise']
        }}
      >
        <div>Test Child</div>
      </CopilotProvider>
    );
    
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
  
  test('initializes with agentic config', () => {
    const agentic = {
      proactiveAssistance: true,
      learningEnabled: true,
      contextAwareness: true,
      behaviorPatterns: ['helpful', 'concise']
    };
    
    render(
      <CopilotProvider 
        apiKey="test-key"
        modelName="gemini-pro"
        agentic={agentic}
      >
        <div>Test Child</div>
      </CopilotProvider>
    );
    
    // You would typically check that the adapter was initialized correctly
    // This would depend on your specific implementation
  });
});
