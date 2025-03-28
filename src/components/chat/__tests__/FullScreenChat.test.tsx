
import React from 'react';
import { render, screen } from '@testing-library/react';
import FullScreenChat from '../FullScreenChat';
import { AIMessage } from '@/services/chat/messageTypes';

const mockMessages: AIMessage[] = [
  {
    role: 'assistant',
    content: 'Hello, how can I help you?',
    id: '1',
    timestamp: Date.now() - 1000
  },
  {
    role: 'user',
    content: 'Can you tell me about your services?',
    id: '2',
    timestamp: Date.now()
  }
];

describe('FullScreenChat', () => {
  it('renders correctly with messages', () => {
    render(
      <FullScreenChat
        onMinimize={jest.fn()}
        onSendMessage={jest.fn()}
        inputValue=""
        setInputValue={jest.fn()}
        isLoading={false}
        suggestedResponse={null}
        onClear={jest.fn()}
        initialMessages={mockMessages}
      />
    );
    
    expect(screen.getByText('Chat with AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Hello, how can I help you?')).toBeInTheDocument();
    expect(screen.getByText('Can you tell me about your services?')).toBeInTheDocument();
  });

  it('displays placeholder when no messages', () => {
    render(
      <FullScreenChat
        onMinimize={jest.fn()}
        onSendMessage={jest.fn()}
        inputValue=""
        setInputValue={jest.fn()}
        isLoading={false}
        suggestedResponse={null}
        onClear={jest.fn()}
      />
    );
    
    expect(screen.getByText('How can I help you today?')).toBeInTheDocument();
  });
});
