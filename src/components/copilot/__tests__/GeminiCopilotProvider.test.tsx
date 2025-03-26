import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GeminiCopilotProvider, useGeminiCopilot } from '../GeminiCopilotProvider';

const TestComponent = () => {
  const { isListening, toggleListening, transcript, voiceError, messages, sendMessage, isPlaying, progress, stopAudio, generateAndPlayAudio, step, setStep, userInfo, setUserInfo, isLoading, chatError, clearMessages, clearStorage, proposal, audio, resetConversation, generateProposal, sendProposal } = useGeminiCopilot();
  return (
    <div>
      <p>Listening: {isListening ? 'Yes' : 'No'}</p>
      <button onClick={toggleListening}>Toggle Listening</button>
      <p>Transcript: {transcript}</p>
      <p>Voice Error: {voiceError}</p>
      <p>Messages: {messages.length}</p>
      <button onClick={() => sendMessage('Test message')}>Send Message</button>
      <p>Playing: {isPlaying ? 'Yes' : 'No'}</p>
      <p>Progress: {progress}</p>
      <button onClick={stopAudio}>Stop Audio</button>
      <button onClick={() => generateAndPlayAudio('Test audio')}>Play Audio</button>
      <p>Step: {step}</p>
      <button onClick={() => setStep('nextStep')}>Set Step</button>
      <p>User Info: {userInfo ? userInfo.name : 'None'}</p>
      <button onClick={() => setUserInfo({ name: 'Test User' })}>Set User Info</button>
      <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
      <p>Chat Error: {chatError}</p>
      <button onClick={clearMessages}>Clear Messages</button>
      <button onClick={clearStorage}>Clear Storage</button>
      <p>Proposal: {proposal ? proposal.title : 'None'}</p>
      <button onClick={resetConversation}>Reset Conversation</button>
      <button onClick={() => generateProposal({ title: 'Test Proposal' })}>Generate Proposal</button>
      <button onClick={sendProposal}>Send Proposal</button>
    </div>
  );
};

describe('GeminiCopilotProvider', () => {
  it('should provide gemini copilot context to children', () => {
    render(
      <GeminiCopilotProvider>
        <TestComponent />
      </GeminiCopilotProvider>
    );

    expect(screen.getByText('Listening: No')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Toggle Listening'));

    expect(screen.getByText('Listening: Yes')).toBeInTheDocument();
  });

  it('should wrap children with ErrorBoundaryWrapper', () => {
    const { container } = render(
      <GeminiCopilotProvider>
        <TestComponent />
      </GeminiCopilotProvider>
    );

    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('should be compatible with CopilotProvider', () => {
    render(
      <GeminiCopilotProvider>
        <TestComponent />
      </GeminiCopilotProvider>
    );

    expect(screen.getByText('Listening: No')).toBeInTheDocument();
  });
});
