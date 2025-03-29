
import React from 'react';
import { Card } from '@/components/ui/card';
import { useWebSocketChatLogic } from '@/hooks/useWebSocketChatLogic';
import { MediaPreview } from '@/components/ui/ai-chat/input/MediaPreview';
import WebSocketChatHeader from './websocket/WebSocketChatHeader';
import WebSocketChatMessages from './websocket/WebSocketChatMessages';
import WebSocketChatInput from './websocket/WebSocketChatInput';

export function WebSocketChat() {
  const {
    messages,
    input,
    setInput,
    status,
    isProcessing,
    messageEndRef,
    files,
    handleSendMessage,
    handleFileUpload,
    removeFile,
    clearFiles,
    clearMessages
  } = useWebSocketChatLogic();

  // Determine if input should be disabled
  const isInputDisabled = status !== 'connected' || isProcessing;

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header with status and clear button */}
      <WebSocketChatHeader 
        status={status}
        onClearChat={clearMessages}
        messagesCount={messages.length}
        isProcessing={isProcessing}
      />
      
      {/* Messages area */}
      <WebSocketChatMessages 
        messages={messages}
        isProcessing={isProcessing}
        messagesEndRef={messageEndRef}
      />
      
      {/* File preview area */}
      {files.length > 0 && (
        <MediaPreview 
          mediaItems={files.map(file => ({
            type: file.type,
            data: file.preview || file.data,
            name: file.name,
            mimeType: file.mimeType
          }))} 
          onRemove={removeFile}
        />
      )}
      
      {/* Input area */}
      <WebSocketChatInput 
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        isDisabled={isInputDisabled}
        onFileSelect={handleFileUpload}
      />
    </div>
  );
}

export default WebSocketChat;
