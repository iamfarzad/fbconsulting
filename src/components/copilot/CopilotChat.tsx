
import React, { useState, useEffect } from 'react';
import { CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInputArea } from './chat/ChatInputArea';
import { ErrorDisplay } from './chat/ErrorDisplay';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

interface CopilotChatProps {
  apiKey?: string;
  systemMessage?: string;
  className?: string;
}

export const CopilotChat: React.FC<CopilotChatProps> = ({
  apiKey,
  systemMessage = 'You are a helpful AI assistant.',
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check for voice support
  useEffect(() => {
    const checkVoiceSupport = () => {
      if (typeof window !== 'undefined') {
        return !!window.SpeechRecognition || !!window.webkitSpeechRecognition;
      }
      return false;
    };
    
    setIsVoiceSupported(checkVoiceSupport());
    setIsInitialized(!!apiKey);
  }, [apiKey]);
  
  // Show error if there's an issue
  useEffect(() => {
    if (error) {
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 5000);
    }
  }, [error]);
  
  // Handle sending message
  const handleSubmitMessage = (newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    
    // Simulate API response
    setTimeout(() => {
      const response: Message = {
        role: 'assistant',
        content: `This is a mock response to: "${newMessage.content}"`,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 1000);
  };
  
  // Handle sending message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };
    
    handleSubmitMessage(newMessage);
    setInputValue('');
  };
  
  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle voice input toggle
  const toggleListening = () => {
    setIsListening(prev => !prev);
    // Voice functionality would be implemented here
  };
  
  return (
    <div className={`rounded-lg border shadow-sm overflow-hidden flex flex-col h-[600px] ${className}`}>
      {/* Chat header */}
      <CardHeader className="p-4 border-b">
        <h3 className="text-lg font-medium">AI Assistant</h3>
        <p className="text-sm text-muted-foreground">{isInitialized ? "Ready" : "Initializing..."}</p>
      </CardHeader>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
        <ChatMessages 
          messages={messages} 
          isLoading={isLoading}
          isProviderLoading={false}
          isListening={isListening}
          transcript=""
          error={error}
          messagesEndRef={{ current: null }}
          isInitialized={isInitialized}
        />
      </div>
      
      {/* Error display */}
      {errorVisible && <ErrorDisplay error={error || "Unknown error"} />}
      
      {/* Input area */}
      <ChatInputArea 
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleKeyDown={handleKeyDown}
        handleSendMessage={handleSendMessage}
        toggleListening={toggleListening}
        isLoading={isLoading}
        isListening={isListening}
        isInitialized={isInitialized}
        isProviderLoading={false}
        isVoiceSupported={isVoiceSupported}
        error={error}
        voiceError={voiceError}
      />
    </div>
  );
};

export default CopilotChat;
