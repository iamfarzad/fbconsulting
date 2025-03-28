
import React from 'react';
import { AIMessage } from '@/services/chat/messageTypes';
import { Loader2 } from 'lucide-react';

interface ChatMessagesProps {
  messages: AIMessage[];
  isLoading?: boolean;
  isProviderLoading?: boolean;
  isListening?: boolean;
  transcript?: string;
  error?: string | null;
  messagesEndRef?: React.RefObject<HTMLDivElement>;
  isInitialized?: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading = false,
  isProviderLoading = false,
  isListening = false,
  transcript = '',
  error = null,
  messagesEndRef,
  isInitialized = true
}) => {
  // If there are no messages and the provider is still loading, show a loading state
  if (messages.length === 0 && isProviderLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">Initializing AI assistant...</p>
      </div>
    );
  }

  // If there are no messages and there's no error, show a welcome message
  if (messages.length === 0 && !error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <h3 className="text-lg font-medium mb-2">Welcome to the AI Assistant</h3>
        <p className="text-sm text-muted-foreground mb-4">
          How can I help you today?
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Display all messages */}
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`px-4 py-2 rounded-lg max-w-[80%] ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : message.role === 'system'
                ? 'bg-muted text-muted-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}

      {/* Show loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Show listening indicator */}
      {isListening && (
        <div className="flex justify-center py-2">
          <div className="bg-secondary p-3 rounded-lg max-w-[80%]">
            <p className="text-sm font-medium mb-1">Listening...</p>
            {transcript && <p className="text-sm italic">{transcript}</p>}
          </div>
        </div>
      )}

      {/* Messages end reference for scrolling */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
