import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { AnimatedBars } from '../ui/AnimatedBars';
import { ChatInput } from '../ui/ai-chat/ChatInput';
import { ChatMessageList } from '../ui/ai-chat/ChatMessageList';
import { AIMessage } from '@/services/copilotService';
import { UploadedFile } from '@/hooks/useFileUpload';
import { useFullScreenChatState } from '@/hooks/chat/useFullScreenChatState';

interface FullScreenChatProps {
  onMinimize: () => void;
  initialMessages?: AIMessage[];
  onSendMessage: (files?: { mimeType: string; data: string; name: string; type: string }[]) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  suggestedResponse: string | null;
  onClear: () => void;
  placeholderText?: string;
  // File-related props
  files?: UploadedFile[];
  uploadFile?: (file: File) => Promise<void>;
  removeFile?: (index: number) => void;
  isUploading?: boolean;
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
  placeholderText = "Ask about our AI services...",
  // File-related props with defaults
  files = [],
  uploadFile,
  removeFile,
  isUploading = false
}) => {
  const { messages, addMessage, clearMessages } = useFullScreenChatState(initialMessages);

  // Prevent body scrolling when fullscreen chat is open
  useEffect(() => {
    // Save the current overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';
    
    // Restore original overflow style when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md overflow-hidden"
    >
      <div className="relative w-full h-full max-w-7xl mx-auto px-4 overflow-hidden">
        <div className="absolute right-4 top-6 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={onMinimize}
            className="rounded-full border-white/30 bg-black/50 hover:bg-black/70 dark:border-white/30 dark:bg-black/50 dark:hover:bg-black/70 dark:text-white"
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>
        
        <div className="h-full pt-20 pb-10 flex flex-col overflow-hidden">
          <div className="flex flex-col flex-grow h-full max-w-4xl mx-auto overflow-hidden">
            <div className="p-6 text-center mb-4">
              <h2 className="text-2xl font-semibold text-white mb-2">Chat with AI Assistant</h2>
              <div className="flex justify-center">
                <AnimatedBars isActive={true} />
              </div>
              <p className="text-white/70 mt-4">
                Ask me anything about our AI services and automation solutions
              </p>
            </div>
            
            <div className="flex-1 p-6 flex flex-col relative overflow-hidden">
              {messages.length > 0 ? (
                <div className="flex-1 mb-6 relative overflow-auto">
                  <ChatMessageList 
                    messages={messages} 
                    showMessages={true} 
                    isFullScreen={true} 
                  />
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
              
              <div className="mt-auto pt-4 relative">
                <ChatInput
                  value={inputValue}
                  setValue={setInputValue}
                  onSend={onSendMessage}
                  onClear={onClear}
                  isLoading={isLoading}
                  showMessages={true}
                  hasMessages={messages.length > 0}
                  suggestedResponse={suggestedResponse}
                  placeholder={placeholderText}
                  files={files}
                  onUploadFile={uploadFile}
                  onRemoveFile={removeFile}
                  isUploading={isUploading}
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
