
import React from 'react';
import { Button } from '@/components/ui/button';
import { Expand } from 'lucide-react';
import useUnifiedChat from '@/hooks/useUnifiedChat';

interface UnifiedChatProps {
  placeholder?: string;
  onToggleFullScreen: () => void;
  apiKey?: string;
  modelName?: string;
}

export const UnifiedChat: React.FC<UnifiedChatProps> = ({
  placeholder = "Ask me anything...",
  onToggleFullScreen,
  apiKey,
  modelName
}) => {
  const {
    inputValue,
    setInputValue,
    sendMessage,
    isLoading,
    messages
  } = useUnifiedChat({ apiKey, modelName });

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-medium">AI Assistant</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleFullScreen} 
          aria-label="Expand chat"
        >
          <Expand className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 h-64 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p className="text-center">How can I help you today?</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index}
              className={`mb-4 p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 ml-8' 
                  : 'bg-gray-50 dark:bg-gray-800 mr-8'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg mr-2 bg-transparent"
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnifiedChat;
