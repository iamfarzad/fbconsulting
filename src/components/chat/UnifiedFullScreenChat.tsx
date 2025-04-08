
import React from 'react';
import { Button } from '@/components/ui/button';
import { Minimize, X, Send } from 'lucide-react';
import useUnifiedChat from '@/hooks/useUnifiedChat';
import { motion } from 'framer-motion';

interface UnifiedFullScreenChatProps {
  onMinimize: () => void;
  placeholderText?: string;
  apiKey?: string;
  modelName?: string;
}

const UnifiedFullScreenChat: React.FC<UnifiedFullScreenChatProps> = ({
  onMinimize,
  placeholderText = "Ask me anything...",
  apiKey,
  modelName
}) => {
  const {
    inputValue,
    setInputValue,
    sendMessage,
    clearMessages,
    isLoading,
    messages
  } = useUnifiedChat({ apiKey, modelName });

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-medium">AI Assistant</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearMessages}
          >
            Clear Chat
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMinimize}
            aria-label="Minimize chat"
          >
            <Minimize className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMinimize}
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p className="text-center">How can I help you today?</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 ml-8' 
                  : 'bg-gray-50 dark:bg-gray-800 mr-8'
              }`}
            >
              <p>{message.content}</p>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            disabled={isLoading}
            className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg mr-2 bg-transparent min-h-[100px] resize-none"
            rows={3}
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !inputValue.trim()}
            size="icon"
            className="h-12 w-12 rounded-full"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default UnifiedFullScreenChat;
