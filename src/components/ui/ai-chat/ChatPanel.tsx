
import React from 'react';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

export const ChatPanel: React.FC = () => {
  const { 
    messages, 
    inputValue, 
    setInputValue, 
    isLoading, 
    suggestedResponse, 
    handleSend, 
    handleClear, 
    isFullScreen,
    toggleFullScreen,
    files, 
    uploadFile, 
    removeFile, 
    isUploading 
  } = useChat();

  return (
    <div className="flex flex-col h-full rounded-lg border shadow-sm overflow-hidden">
      <header className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Farzad-AI Assistant</h2>
        <Button variant="ghost" size="sm" onClick={toggleFullScreen}>
          {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessageList 
          messages={messages} 
          showMessages={true} 
          isFullScreen={isFullScreen}
          isLoading={isLoading}
        />
      </div>
      
      <footer className="p-4 border-t">
        <ChatInput
          value={inputValue}
          setValue={setInputValue}
          onSend={handleSend}
          onClear={handleClear}
          isLoading={isLoading}
          showMessages={true}
          hasMessages={messages.length > 0}
          suggestedResponse={suggestedResponse}
          placeholder="Ask me anything about AI automation for your business..."
          files={files}
          onUploadFile={uploadFile}
          onRemoveFile={removeFile}
          isUploading={isUploading}
        />
      </footer>
    </div>
  );
};
