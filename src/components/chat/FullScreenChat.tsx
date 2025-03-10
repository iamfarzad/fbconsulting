
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { AIChatInput } from '../ui/ai-chat';
import { Button } from '../ui/button';

interface FullScreenChatProps {
  onMinimize: () => void;
}

const FullScreenChat: React.FC<FullScreenChatProps> = ({ onMinimize }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
    >
      <div className="relative w-full h-full max-w-7xl mx-auto px-4">
        <div className="absolute right-4 top-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={onMinimize}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-full pt-20 pb-10">
          <div className="bg-background rounded-lg shadow-xl h-full max-w-4xl mx-auto overflow-hidden flex flex-col">
            <div className="p-6 text-center border-b">
              <h2 className="text-2xl font-semibold">Chat with AI Assistant</h2>
              <p className="text-muted-foreground mt-2">
                Ask me anything about our AI services and automation solutions
              </p>
            </div>
            
            <div className="flex-1 p-6 overflow-hidden">
              <AIChatInput />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FullScreenChat;
