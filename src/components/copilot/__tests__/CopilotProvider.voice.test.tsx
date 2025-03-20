
import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { CopilotProvider } from '../CopilotProvider';

// Mock the speech synthesis
const mockSpeechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  getVoices: jest.fn().mockReturnValue([
    { name: 'Charon', voiceURI: 'Charon' }
  ])
};

// Mock the speech recognition
const mockSpeechRecognition = {
  start: jest.fn(),
  stop: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

// Setup global mocks
global.SpeechSynthesis = mockSpeechSynthesis;
global.SpeechRecognition = jest.fn().mockImplementation(() => mockSpeechRecognition);
global.webkitSpeechRecognition = jest.fn().mockImplementation(() => mockSpeechRecognition);

describe('CopilotProvider with voice features', () => {
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
        voice={{
          enabled: true,
          voice: 'Charon'
        }}
      >
        <div>Test Child</div>
      </CopilotProvider>
    );
    
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
  
  test('initializes with voice config', async () => {
    const voice = {
      enabled: true,
      voice: 'Charon',
      pitch: 1.0,
      rate: 1.0
    };
    
    render(
      <CopilotProvider 
        apiKey="test-key"
        modelName="gemini-pro"
        voice={voice}
      >
        <div>Test Child</div>
      </CopilotProvider>
    );
    
    // Wait for async initialization
    await waitFor(() => {
      // You would check that the voice features were initialized correctly
      // This would depend on your specific implementation
    });
  });
  
  test('disables voice when configured', async () => {
    const voice = {
      enabled: false,
      voice: 'Charon'
    };
    
    render(
      <CopilotProvider 
        apiKey="test-key"
        modelName="gemini-pro"
        voice={voice}
      >
        <div>Test Child</div>
      </CopilotProvider>
    );
    
    // Wait for async initialization
    await waitFor(() => {
      // You would check that voice features are disabled
      // This would depend on your specific implementation
    });
  });
});
