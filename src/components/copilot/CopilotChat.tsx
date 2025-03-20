
import React, { useState, useEffect } from 'react';
import { useCopilotChat } from '@copilotkit/react-core';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInputArea } from './chat/ChatInputArea';
import { ErrorDisplay } from './chat/ErrorDisplay';
import { Message } from '@copilotkit/shared';

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
  
  // Initialize CopilotKit chat
  const { chatState, handleSubmitMessage, isInitialized, error } = useCopilotChat({
    messages: [{
      role: 'system',
      content: systemMessage
    }]
  });
  
  const messages = chatState?.messages || [];
  const isLoading = chatState?.isLoading || false;
  
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
  
  // Show error if there's an issue
  useEffect(() => {
    if (error) {
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 5000);
    }
  }, [error]);
  
  // Handle sending message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      role: 'user',
      content: inputValue
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
      <ChatHeader 
        title="AI Assistant" 
        subtitle={isInitialized ? "Ready" : "Initializing..."}
      />
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
        <ChatMessages 
          messages={messages} 
          isLoading={isLoading}
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
