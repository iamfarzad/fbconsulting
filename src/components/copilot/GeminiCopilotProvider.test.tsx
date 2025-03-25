import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { GeminiCopilotProvider } from './GeminiCopilotProvider';
import { useGeminiConnectionManager } from './GeminiConnectionManager';
import { useGeminiChat } from './GeminiChatContext';

jest.mock('./GeminiConnectionManager');
jest.mock('./GeminiChatContext');

describe('GeminiCopilotProvider', () => {
  beforeEach(() => {
    useGeminiConnectionManager.mockReturnValue({
      isListening: false,
      toggleListening: jest.fn(),
      transcript: '',
      voiceError: null,
      isPlaying: false,
      progress: 0,
      stopAudio: jest.fn(),
      generateAndPlayAudio: jest.fn(),
    });

    useGeminiChat.mockReturnValue({
      messages: [],
      sendMessage: jest.fn(),
      step: 'intro',
      setStep: jest.fn(),
      userInfo: null,
      setUserInfo: jest.fn(),
      clearMessages: jest.fn(),
      clearStorage: jest.fn(),
      proposal: null,
      resetConversation: jest.fn(),
      generateProposal: jest.fn(),
      sendProposal: jest.fn(),
    });
  });

  it('renders children without crashing', () => {
    render(
      <GeminiCopilotProvider>
        <div>Test Child</div>
      </GeminiCopilotProvider>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('provides connection manager context', async () => {
    render(
      <GeminiCopilotProvider>
        <div>Test Child</div>
      </GeminiCopilotProvider>
    );

    await waitFor(() => {
      expect(useGeminiConnectionManager).toHaveBeenCalled();
    });
  });

  it('provides chat context', async () => {
    render(
      <GeminiCopilotProvider>
        <div>Test Child</div>
      </GeminiCopilotProvider>
    );

    await waitFor(() => {
      expect(useGeminiChat).toHaveBeenCalled();
    });
  });
});
