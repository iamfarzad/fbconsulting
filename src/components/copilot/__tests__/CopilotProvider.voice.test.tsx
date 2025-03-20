
import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { CopilotProvider } from '../CopilotProvider';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the speech synthesis
const mockSpeechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  getVoices: vi.fn().mockReturnValue([
    { name: 'Charon', voiceURI: 'Charon' }
  ])
};

// Mock the speech recognition
const mockSpeechRecognition = {
  start: vi.fn(),
  stop: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

// Setup global mocks
Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true
});

// Mock SpeechRecognition
global.SpeechRecognition = vi.fn().mockImplementation(() => mockSpeechRecognition);
global.webkitSpeechRecognition = vi.fn().mockImplementation(() => mockSpeechRecognition);

describe('CopilotProvider with voice features', () => {
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
  
  it('initializes with voice config', async () => {
    render(
      <CopilotProvider>
        <div>Test Child</div>
      </CopilotProvider>
    );
    
    // Wait for async initialization
    await waitFor(() => {
      // You would check that the voice features were initialized correctly
      // This would depend on your specific implementation
    });
  });
  
  it('disables voice when configured', async () => {
    render(
      <CopilotProvider>
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
