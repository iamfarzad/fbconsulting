
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
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
        
        <div className="h-full pt-20 pb-10 flex flex-col">
          <div className="flex flex-col flex-grow h-full max-w-4xl mx-auto">
            <div className="p-6 text-center mb-4">
              <h2 className="text-2xl font-semibold text-white mb-2">Chat with AI Assistant</h2>
              <div className="flex justify-center">
                <AnimatedBars isActive={true} />
              </div>
              <p className="text-white/70 mt-4">
                Ask me anything about our AI services and automation solutions
              </p>
            </div>
            
            <div className="flex-1 p-6 overflow-auto flex flex-col">
              {hasMessages ? (
                <div className="flex-1 overflow-auto mb-6">
                  <ChatMessageList messages={initialMessages} showMessages={true} />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-white/80">
                    <p className="text-xl font-medium mb-2">How can I help you today?</p>
                    <p className="max-w-md mx-auto">
                      I can provide information about AI automation, workflow optimization, 
                      cost reduction strategies, and customized solutions for your business.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-auto pt-4">
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
      </div>
    </motion.div>
  );
};

export default FullScreenChat;
