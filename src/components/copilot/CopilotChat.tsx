
import React, { useState, useEffect, useRef } from 'react';
import { CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInputArea } from './chat/ChatInputArea';
import { ErrorDisplay } from './chat/ErrorDisplay';
import { AIMessage } from '@/services/chat/messageTypes';
import { useGeminiAPI } from '@/hooks/useGeminiAPI';
import { useMessageHandler } from '@/hooks/chat/useMessageHandler';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface CopilotChatProps {
  apiKey?: string;
  systemMessage?: string;
  className?: string;
}

export const CopilotChat: React.FC<CopilotChatProps> = ({
  apiKey: propApiKey,
  systemMessage = 'You are a helpful AI assistant.',
  className = '',
}) => {
  const { toast } = useToast();
  const { apiKey: contextApiKey } = useGeminiAPI();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Check for voice support
  useEffect(() => {
    const checkVoiceSupport = () => {
      if (typeof window !== 'undefined') {
        return !!window.SpeechRecognition || !!window.webkitSpeechRecognition;
      }
      return false;
    };
    
    setIsVoiceSupported(checkVoiceSupport());
  }, []);
  
  // Determine which API key to use
  const effectiveApiKey = propApiKey || contextApiKey || import.meta.env.VITE_GEMINI_API_KEY;
  
  // Set initialized state based on API key
  useEffect(() => {
    setIsInitialized(!!effectiveApiKey);
    if (!effectiveApiKey) {
      setError("No API key found. Please provide an API key.");
    } else {
      setError(null);
    }
  }, [effectiveApiKey]);
  
  // Add messages to state
  const addMessage = (role: 'user' | 'assistant' | 'system' | 'error', content: string) => {
    const newMessage: Message = {
      role: role === 'error' ? 'system' : role,
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  };
  
  // Handle errors
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive"
    });
  };
  
  // Get system prompt function for messageHandler
  const getSystemPrompt = () => systemMessage;
  
  // Use message handler from hooks
  const { sendMessage } = useMessageHandler({
    messages: messages,
    apiKey: effectiveApiKey || null,
    addMessage,
    setLoadingState: setIsLoading,
    handleError,
    getSystemPrompt,
    modelName: 'gemini-2.0-flash'
  });
  
  // Handle sending message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    if (isListening) {
      setIsListening(false);
    }
    
    sendMessage(inputValue);
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
    // Voice functionality would be implemented here with a proper hook
  };
  
  // Clear messages
  const clearMessages = () => {
    setMessages([]);
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Convert messages to AIMessage format for ChatMessages component
  const aiMessages: AIMessage[] = messages.map(msg => ({
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp
  }));
  
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
          messages={aiMessages} 
          isLoading={isLoading}
          isProviderLoading={!isInitialized}
          isListening={isListening}
          transcript={transcript}
          error={error}
          messagesEndRef={messagesEndRef}
          isInitialized={isInitialized}
        />
      </div>
      
      {/* Error display */}
      {error && <ErrorDisplay error={error} />}
      
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
        isProviderLoading={!isInitialized}
        isVoiceSupported={isVoiceSupported}
        error={error}
        voiceError={voiceError}
      />
    </div>
  );
};

export default CopilotChat;
