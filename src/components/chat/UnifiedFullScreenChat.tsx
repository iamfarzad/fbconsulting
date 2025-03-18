/**
 * UnifiedFullScreenChat Component
 * A full-screen version of the UnifiedChat component
 */

import React from 'react';
import { UnifiedChat } from './UnifiedChat';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UnifiedFullScreenChatProps {
  onMinimize: () => void;
  useCopilotKit?: boolean;
  placeholderText?: string;
}

export const UnifiedFullScreenChat: React.FC<UnifiedFullScreenChatProps> = ({
  onMinimize,
  useCopilotKit = true,
  placeholderText = "Ask me anything..."
}) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="fixed inset-4 bg-background border rounded-lg shadow-lg overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMinimize}
            className="h-8 w-8"
          >
            <X size={18} />
          </Button>
        </div>
        
        <div className="flex-1 p-0 overflow-hidden">
          <UnifiedChat
            useCopilotKit={useCopilotKit}
            fullScreen={true}
            placeholderText={placeholderText}
            className="h-full border-0 rounded-none shadow-none"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UnifiedFullScreenChat;
