
import React from 'react';
import { useGeminiChatHandler } from '@/hooks/useGeminiChatHandler';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInputArea } from './chat/ChatInputArea';
import { ErrorDisplay } from './chat/ErrorDisplay';

export const GeminiChat: React.FC = () => {
  const {
    inputValue,
    setInputValue,
    messages,
    isLoading,
    isProviderLoading,
    isInitialized,
    isListening,
    transcript,
    handleSendMessage,
    handleKeyDown,
    toggleListening,
    clearMessages,
    messagesEndRef,
    currentPersonaName,
    error,
    providerError,
    voiceError,
    isVoiceSupported
  } = useGeminiChatHandler();
  
  return (
    <div className="flex flex-col h-full bg-background border rounded-lg shadow-sm overflow-hidden">
      <ChatHeader 
        personaName={currentPersonaName}
        isLoading={isProviderLoading}
        messagesCount={messages.length}
        onClear={clearMessages}
      />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Error state */}
        {providerError && <ErrorDisplay error={providerError} />}
        
        {/* Chat messages */}
        <ChatMessages 
          messages={messages}
          isLoading={isLoading}
          isProviderLoading={isProviderLoading}
          isListening={isListening}
          transcript={transcript}
          error={error}
          messagesEndRef={messagesEndRef}
          isInitialized={isInitialized}
        />
      </div>
      
      <ChatInputArea 
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleKeyDown={handleKeyDown}
        handleSendMessage={handleSendMessage}
        toggleListening={toggleListening}
        isLoading={isLoading}
        isListening={isListening}
        isInitialized={isInitialized}
        isProviderLoading={isProviderLoading}
        isVoiceSupported={isVoiceSupported}
        error={error}
        voiceError={voiceError}
      />
    </div>
  );
};

export default GeminiChat;
