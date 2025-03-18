
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { AIMessage } from "@/services/copilotService";

interface ChatContainerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  showMessages: boolean;
  messages: AIMessage[];
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  suggestedResponse: string | null;
  handleSend: (images?: { mimeType: string; data: string }[]) => void;
  handleClear: () => void;
  toggleFullScreen: () => void;
  placeholder?: string;
  isFullScreen?: boolean;
  // Add image-related props
  images?: { mimeType: string; data: string; preview: string }[];
  uploadImage?: (file: File) => Promise<void>;
  removeImage?: (index: number) => void;
  isUploading?: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  containerRef,
  showMessages,
  messages,
  inputValue,
  setInputValue,
  isLoading,
  suggestedResponse,
  handleSend,
  handleClear,
  toggleFullScreen,
  placeholder = "Ask me anything...",
  isFullScreen = false,
  // Image-related props with defaults
  images = [],
  uploadImage,
  removeImage,
  isUploading = false
}) => {
  return (
    <motion.div 
      ref={containerRef}
      className="flex flex-col w-full relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {(showMessages || messages.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: "auto",
              transition: {
                height: { 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 300 
                },
                opacity: { duration: 0.2 }
              }
            }}
            exit={{ 
              opacity: 0, 
              height: 0,
              transition: {
                height: { duration: 0.2 },
                opacity: { duration: 0.1 }
              }
            }}
            className="will-change-[height,opacity] mb-4 relative"
          >
            <ChatMessageList 
              messages={messages} 
              showMessages={showMessages} 
              isFullScreen={isFullScreen}
              isLoading={isLoading}
            />
            
            {messages.length > 0 && !isFullScreen && (
              <motion.div 
                className="p-2 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFullScreen();
                  }}
                  className="text-black/70 text-sm hover:text-black bg-black/5 hover:bg-black/10 px-3 py-1.5 rounded-full transition-all"
                >
                  Expand to full screen
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 bg-background rounded-2xl"
      >
        <ChatInput
          value={inputValue}
          setValue={setInputValue}
          onSend={handleSend}
          onClear={handleClear}
          isLoading={isLoading}
          showMessages={showMessages}
          hasMessages={messages.length > 0}
          suggestedResponse={suggestedResponse}
          placeholder={placeholder}
          images={images}
          onUploadImage={uploadImage}
          onRemoveImage={removeImage}
          isUploading={isUploading}
        />
      </motion.div>
    </motion.div>
  );
};
