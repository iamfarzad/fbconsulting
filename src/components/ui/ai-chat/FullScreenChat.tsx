
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { AIChatInput } from '../ai-chat';
import { Button } from '../../ui/button';
import { AnimatedBars } from '../AnimatedBars';

interface FullScreenChatProps {
  onMinimize: () => void;
}

const FullScreenChat: React.FC<FullScreenChatProps> = ({ onMinimize }) => {
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
              <AIChatInput placeholderText="Ask about our AI services..." />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FullScreenChat;
