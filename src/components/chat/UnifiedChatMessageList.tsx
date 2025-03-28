
import React, { useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Bot, Loader2 } from 'lucide-react';
import { AIMessage } from '@/services/chat/messageTypes';

// Simple chat message component
const ChatMessage = ({ message, isUser }: { message: AIMessage; isUser: boolean }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
      <div 
        className={`max-w-[80%] p-3 rounded-lg ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export const UnifiedChatMessageList: React.FC = () => {
  const { state } = useChat();
  const { messages, isLoading } = state;
  
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);
  
  // Filter out system messages
  const displayMessages = Array.isArray(messages) 
    ? messages.filter(msg => msg.role !== 'system')
    : [];
    
  if (displayMessages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground">
        <Bot size={36} className="mb-2 opacity-50" />
        <h3 className="text-lg font-medium mb-1">How can I help you today?</h3>
        <p className="text-sm">Ask me anything about our AI services and automation solutions.</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col space-y-2 p-2">
      {displayMessages.map((message, index) => (
        <ChatMessage 
          key={index} 
          message={message} 
          isUser={message.role === 'user'} 
        />
      ))}
      
      {isLoading && (
        <div className="flex items-center space-x-2 p-3">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">AI is thinking...</span>
        </div>
      )}
      
      <div ref={bottomRef} />
    </div>
  );
};

export default UnifiedChatMessageList;
