
import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChatProvider, useChat } from '@/contexts/ChatContext';
import { UnifiedChatMessageList } from './UnifiedChatMessageList';
import { UnifiedChatInput } from './UnifiedChatInput';
import { UnifiedFullScreenChatProps } from '@/types/chat';

// Inner component that uses the ChatContext
const FullScreenChatContent: React.FC<{ 
  onMinimize: () => void, 
  placeholderText?: string
}> = ({
  onMinimize,
  placeholderText = "Ask me anything..."
}) => {
  const { state, actions } = useChat();
  const { isLoading, messages } = state;
  const { clearMessages } = actions;
  
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className="font-semibold">AI Assistant</h2>
        <div className="flex items-center gap-4">
          {messages.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearMessages}
            >
              Clear Chat
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onMinimize}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <UnifiedChatMessageList
          messages={messages}
          isLoading={isLoading}
          isFullScreen={true}
        />
      </div>
      
      <div className="p-4 border-t">
        <UnifiedChatInput placeholder={placeholderText} />
      </div>
    </motion.div>
  );
};

// Main component that provides the ChatContext
export const UnifiedFullScreenChat: React.FC<UnifiedFullScreenChatProps> = ({
  onMinimize,
  placeholderText,
  apiKey,
  modelName
}) => {
  return (
    <ChatProvider apiKey={apiKey} modelName={modelName}>
      <FullScreenChatContent 
        onMinimize={onMinimize} 
        placeholderText={placeholderText} 
      />
    </ChatProvider>
  );
};

export default UnifiedFullScreenChat;
