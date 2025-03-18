
import React from 'react';
import { Loader2 } from "lucide-react";
import { AnimatedBars } from '@/components/ui/AnimatedBars';
import { AIMessage } from '@/services/chat/messageTypes';

interface ChatMessagesProps {
  messages: AIMessage[];
  isLoading: boolean;
  isProviderLoading: boolean;
  isListening: boolean;
  transcript: string;
  error: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isInitialized: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  isProviderLoading,
  isListening,
  transcript,
  error,
  messagesEndRef,
  isInitialized
}) => {
  // Provider not initialized or loading
  if (isProviderLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
          <p className="text-muted-foreground text-center">
            Initializing AI Assistant...
          </p>
        </div>
      </div>
    );
  }

  // No messages state
  if (isInitialized && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-center">
          No messages yet. Start a conversation!
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Messages */}
      {messages.map((message, index) => (
        <div 
          key={index}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[80%] p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : message.role === 'error'
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-muted'
            }`}
          >
            <div className="whitespace-pre-wrap">{message.content}</div>
            
            {/* Timestamp */}
            <div className="mt-1 text-xs opacity-70">
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      ))}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] p-3 rounded-lg bg-muted">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Voice transcript indicator */}
      {isListening && transcript && (
        <div className="flex justify-end">
          <div className="max-w-[80%] p-3 rounded-lg bg-primary/20 text-primary-foreground/70">
            <div className="flex items-center gap-2">
              <AnimatedBars isActive={true} small={true} />
              <div className="whitespace-pre-wrap">{transcript}</div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </>
  );
};
