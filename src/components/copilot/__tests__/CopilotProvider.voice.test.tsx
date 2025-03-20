
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
  ]),
  onvoiceschanged: null
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

// Mock the router since we're using useLocation
vi.mock('react-router-dom', () => ({
  useLocation: vi.fn().mockReturnValue({ pathname: '/' }),
}));

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
    const voice = {
      enabled: true,
      voice: 'Charon'
    };
    
    render(
      <CopilotProvider voice={voice}>
        <div>Test Child</div>
      </CopilotProvider>
    );
    
    // Simulate voices loaded event
    if (mockSpeechSynthesis.onvoiceschanged) {
      mockSpeechSynthesis.onvoiceschanged();
    }
    
    // Wait for async initialization
    await waitFor(() => {
      // Just checking it doesn't error
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });
  });
  
  it('disables voice when configured', async () => {
    const voice = {
      enabled: false,
      voice: 'Charon'
    };
    
    render(
      <CopilotProvider voice={voice}>
        <div>Test Child</div>
      </CopilotProvider>
    );
    
    // Wait for async initialization
    await waitFor(() => {
      // Just checking it doesn't error
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });
  });
});
