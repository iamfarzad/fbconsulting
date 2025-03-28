
import React from 'react';
import { motion } from 'framer-motion';
import { useChat, ChatProvider } from '@/contexts/ChatContext';
import { ChatHeader } from './core/ChatHeader';
import { UnifiedChatMessageList } from './UnifiedChatMessageList';
import { UnifiedChatInput } from './UnifiedChatInput';

interface UnifiedFullScreenChatContentProps {
  onMinimize?: () => void;
  placeholderText?: string;
}

const UnifiedFullScreenChatContent: React.FC<UnifiedFullScreenChatContentProps> = ({
  onMinimize,
  placeholderText = 'Ask me anything...',
}) => {
  const { state, clearMessages, containerRef } = useChat();
  
  const { isLoading, messages, isInitialized } = state;
  
  const hasMessages = messages.filter(m => m.role !== 'system').length > 0;
  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      ref={containerRef}
    >
      <ChatHeader 
        title="Gemini AI Assistant"
        subtitle={isInitialized ? 'Connected' : 'Initializing...'}
        onClear={hasMessages ? clearMessages : undefined}
        onToggleFullScreen={onMinimize}
        isFullScreen={true}
        isConnected={isInitialized}
        isLoading={isLoading}
      />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <UnifiedChatMessageList />
      </div>
      
      <div className="p-4 border-t">
        <UnifiedChatInput placeholder={placeholderText} />
      </div>
    </motion.div>
  );
};

interface UnifiedFullScreenChatProps {
  onMinimize?: () => void;
  placeholderText?: string;
  apiKey?: string;
  modelName?: string;
}

export const UnifiedFullScreenChat: React.FC<UnifiedFullScreenChatProps> = (props) => {
  const { apiKey, modelName, ...restProps } = props;

  return (
    <ChatProvider apiKey={apiKey} modelName={modelName}>
      <UnifiedFullScreenChatContent {...restProps} />
    </ChatProvider>
  );
};

export default UnifiedFullScreenChat;
