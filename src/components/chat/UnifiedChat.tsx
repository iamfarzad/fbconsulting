
import React from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatContainer } from '@/components/ui/ai-chat/ChatContainer';

interface UnifiedChatProps {
  title?: string;
  subtitle?: string;
  placeholderText?: string;
}

export const UnifiedChat: React.FC<UnifiedChatProps> = ({
  title,
  subtitle,
  placeholderText = "Ask me anything..."
}) => {
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    showMessages,
    suggestedResponse,
    handleSend,
    handleClear,
    toggleFullScreen,
    isFullScreen,
    containerRef,
    files,
    uploadFile,
    removeFile,
    isUploading,
  } = useChat();

  return (
    <div className="w-full">
      {title && (
        <header className="mb-6 text-center">
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </header>
      )}
      
      <ChatContainer
        containerRef={containerRef}
        messages={messages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading}
        showMessages={showMessages}
        suggestedResponse={suggestedResponse}
        handleSend={handleSend}
        handleClear={handleClear}
        toggleFullScreen={toggleFullScreen}
        isFullScreen={isFullScreen}
        placeholder={placeholderText}
        files={files}
        uploadFile={uploadFile}
        removeFile={removeFile}
        isUploading={isUploading}
      />
    </div>
  );
};
