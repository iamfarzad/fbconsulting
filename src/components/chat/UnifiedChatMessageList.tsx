
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
      <div className="flex items-start gap-2 max-w-[80%]">
        {!isUser && !isError && (
          <div className="flex-shrink-0 rounded-full bg-primary/10 p-1 w-8 h-8 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
        )}
        
        {isUser && (
          <div className="flex-shrink-0 rounded-full bg-muted p-1 w-8 h-8 flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
        )}
        
        <div 
          className={`p-3 rounded-lg ${
            isError 
              ? 'bg-destructive/10 text-destructive border border-destructive/20'
              : isUser 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
};

export const UnifiedChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  showMessages,
  isFullScreen,
  isLoading
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { state } = useChat();
  const chatShowMessages = state.showMessages;
  
  // Use props if provided, otherwise fall back to context
  const displayShowMessages = showMessages !== undefined ? showMessages : chatShowMessages;
  const displayMessages = messages || state.messages;
  const displayIsLoading = isLoading !== undefined ? isLoading : state.isLoading;
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayMessages, displayIsLoading]);
  
  // Filter out system messages for display
  const filteredMessages = displayMessages.filter(msg => msg.role !== 'system');
    
  if (!displayShowMessages || filteredMessages.length === 0) {
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
      {filteredMessages.map((message, index) => (
        <ChatMessage 
          key={message.id || index} 
          message={message} 
        />
      ))}
      
      {displayIsLoading && (
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
