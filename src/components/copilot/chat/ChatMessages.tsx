import React, { useCallback, useEffect } from 'react';
import { Loader2 } from "lucide-react";
import { AnimatedBars } from '../ui/AnimatedBars';
import { useGemini } from '../providers/GeminiProvider';
import { Message } from '../types';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  isProviderLoading: boolean;
  isListening: boolean;
  transcript: string;
  error: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isInitialized: boolean;
  onNewMessage?: (message: Message) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  isProviderLoading,
  isListening,
  transcript,
  error,
  messagesEndRef,
  isInitialized,
  onNewMessage
}) => {
  const { isConnected } = useGemini();

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, messagesEndRef]);

  // Show loading state when not connected to backend
  if (!isConnected || isProviderLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
          <p className="text-muted-foreground text-center">
            Connecting to AI Assistant...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (isInitialized && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-center">
          No messages yet. Start a conversation!
        </p>
      </div>
    );
  }

  // Check if messages is an array
  if (!Array.isArray(messages)) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-center">
          Invalid messages format. Please try again.
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
            
            {message.timestamp && (
              <div className="mt-1 text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] p-3 rounded-lg bg-muted">
            <AnimatedBars isActive={true} small={true} />
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
