import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChatMessages } from './ChatMessages';
import { Message } from '../types';

describe('ChatMessages', () => {
  const messages: Message[] = [
    { role: 'user', content: 'Hello', timestamp: Date.now() },
    { role: 'assistant', content: 'Hi there!', timestamp: Date.now() },
  ];

  it('renders messages correctly', () => {
    render(
      <ChatMessages
        messages={messages}
        isLoading={false}
        isProviderLoading={false}
        isListening={false}
        transcript=""
        error={null}
        messagesEndRef={{ current: null }}
        isInitialized={true}
      />
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  it('shows loading state when provider is loading', () => {
    render(
      <ChatMessages
        messages={[]}
        isLoading={false}
        isProviderLoading={true}
        isListening={false}
        transcript=""
        error={null}
        messagesEndRef={{ current: null }}
        isInitialized={true}
      />
    );

    expect(screen.getByText('Connecting to AI Assistant...')).toBeInTheDocument();
  });

  it('shows error state when there is an error', () => {
    render(
      <ChatMessages
        messages={[]}
        isLoading={false}
        isProviderLoading={false}
        isListening={false}
        transcript=""
        error="Test error"
        messagesEndRef={{ current: null }}
        isInitialized={true}
      />
    );

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('shows empty state when there are no messages', () => {
    render(
      <ChatMessages
        messages={[]}
        isLoading={false}
        isProviderLoading={false}
        isListening={false}
        transcript=""
        error={null}
        messagesEndRef={{ current: null }}
        isInitialized={true}
      />
    );

    expect(screen.getByText('No messages yet. Start a conversation!')).toBeInTheDocument();
  });

  it('shows loading indicator when loading', () => {
    render(
      <ChatMessages
        messages={messages}
        isLoading={true}
        isProviderLoading={false}
        isListening={false}
        transcript=""
        error={null}
        messagesEndRef={{ current: null }}
        isInitialized={true}
      />
    );

    expect(screen.getByText('Connecting to AI Assistant...')).toBeInTheDocument();
  });

  it('shows voice transcript indicator when listening', () => {
    render(
      <ChatMessages
        messages={messages}
        isLoading={false}
        isProviderLoading={false}
        isListening={true}
        transcript="Test transcript"
        error={null}
        messagesEndRef={{ current: null }}
        isInitialized={true}
      />
    );

    expect(screen.getByText('Test transcript')).toBeInTheDocument();
  });
});
