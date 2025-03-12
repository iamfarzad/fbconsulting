
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { AnimatedBars } from '../ui/AnimatedBars';
import { ChatInput } from '../ui/ai-chat/ChatInput';
import { ChatMessageList } from '../ui/ai-chat/ChatMessageList';
import { AIMessage } from '@/services/copilotService';

interface FullScreenChatProps {
  onMinimize: () => void;
  initialMessages?: AIMessage[];
  onSendMessage: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  suggestedResponse: string | null;
  onClear: () => void;
  placeholderText?: string;
}

const FullScreenChat: React.FC<FullScreenChatProps> = ({ 
  onMinimize,
  initialMessages = [],
  onSendMessage,
  inputValue,
  setInputValue,
  isLoading,
  suggestedResponse,
  onClear,
  placeholderText = "Ask about our AI services..."
}) => {
  const hasMessages = initialMessages.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md"
    >
      <div className="relative w-full h-full max-w-7xl mx-auto px-4">
        <div className="absolute right-4 top-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={onMinimize}
            className="rounded-full border-white/30 bg-black/50 hover:bg-black/70"
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>
        
        <div className="h-full pt-20 pb-10 overflow-auto">
          <div className="bg-transparent h-full max-w-4xl mx-auto flex flex-col">
            <div className="p-6 text-center mb-4">
              <h2 className="text-2xl font-semibold text-white mb-2">Chat with AI Assistant</h2>
              <div className="flex justify-center">
                <AnimatedBars isActive={true} />
              </div>
              <p className="text-white/70 mt-4">
                Ask me anything about our AI services and automation solutions
              </p>
            </div>
            
            <div className="flex-1 p-6 overflow-hidden flex flex-col">
              {hasMessages && (
                <div className="mb-6">
                  <ChatMessageList messages={initialMessages} showMessages={true} />
                </div>
              )}
              
              <ChatInput
                value={inputValue}
                setValue={setInputValue}
                onSend={onSendMessage}
                onClear={onClear}
                isLoading={isLoading}
                showMessages={true}
                hasMessages={hasMessages}
                suggestedResponse={suggestedResponse}
                placeholder={placeholderText}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FullScreenChat;
