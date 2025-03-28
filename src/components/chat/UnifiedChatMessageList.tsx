
import React, { useRef, useEffect } from 'react';
import { Bot, User, Loader2 } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { AIMessage, ChatMessageListProps } from '@/types/chat';

// Simple chat message component
const ChatMessage = ({ message }: { message: AIMessage }) => {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
      <div className={`p-3 rounded-lg max-w-[80%] ${
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : isError
            ? 'bg-destructive text-destructive-foreground'
            : 'bg-muted'
      }`}>
        <div className="flex items-start gap-2">
          {!isUser && (
            <Bot className="h-5 w-5 mt-1 shrink-0" />
          )}
          <div>
            {message.content}
          </div>
          {isUser && (
            <User className="h-5 w-5 mt-1 shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
};

export const UnifiedChatMessageList: React.FC<ChatMessageListProps> = ({ 
  messages: propMessages,
  showMessages: propShowMessages,
  isFullScreen = false,
  isLoading: propIsLoading
}) => {
  const { state } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use props if provided, otherwise use context
  const messages = propMessages || state.messages;
  const showMessages = propShowMessages !== undefined ? propShowMessages : state.showMessages;
  const isLoading = propIsLoading !== undefined ? propIsLoading : state.isLoading;
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!showMessages) {
    return null;
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
        {isFullScreen ? (
          <>
            <Bot className="h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-1">How can I help you today?</h3>
            <p className="text-sm">Ask me anything about our services, AI capabilities, or business challenges.</p>
          </>
        ) : (
          <p className="text-sm">Type a message to start a conversation.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <ChatMessage key={message.id || index} message={message} />
      ))}
      
      {isLoading && (
        <div className="flex justify-center items-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default UnifiedChatMessageList;
