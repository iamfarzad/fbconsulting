import React from 'react';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { ConnectionStatus } from './ConnectionStatus';
import { useChat } from '@/contexts/ChatContext';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ClearChatButton } from '@/components/ui/buttons/ClearChatButton';
import { PopoverMenu } from '@/components/ui/PopoverMenu';

export const ChatPanel: React.FC = () => {
  const { messages, inputValue, setInputValue, isLoading, suggestedResponse, handleSend, handleClear, isFullScreen, files, uploadFile, removeFile, isUploading } = useChat();

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <SectionHeading title="Farzad-AI" className="text-2xl font-bold" />
        <PopoverMenu />
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <ConnectionStatus />
        <ChatMessageList messages={messages} showMessages={true} isFullScreen={isFullScreen} isLoading={isLoading} />
      </div>
      <footer className="p-4 border-t border-gray-200">
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
        <ClearChatButton onClick={handleClear} />
      </footer>
    </div>
  );
};
