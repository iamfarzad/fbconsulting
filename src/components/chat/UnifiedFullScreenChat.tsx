import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedBars } from '@/components/ui/AnimatedBars';
import { UnifiedChat } from './UnifiedChat';
import { ChatProvider } from '@/contexts/ChatContext';

interface UnifiedFullScreenChatProps {
  onMinimize: () => void;
  title?: string;
  subtitle?: string;
  placeholderText?: string;
  apiKey?: string;
  modelName?: string;
}

export const UnifiedFullScreenChat: React.FC<UnifiedFullScreenChatProps> = ({
  onMinimize,
  title = 'AI Assistant',
  subtitle,
  placeholderText = "Ask me anything...",
  apiKey,
  modelName
}) => {
  // Prevent body scrolling when fullscreen chat is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

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
        
        <div className="p-6 text-center mb-4">
          <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          <div className="flex justify-center">
            <AnimatedBars isActive={true} />
          </div>
          {subtitle && (
            <p className="text-muted-foreground mt-4">{subtitle}</p>
          )}
        </div>
        
        <div className="flex-1 p-6 flex flex-col relative overflow-hidden">
          <ChatProvider apiKey={apiKey} modelName={modelName}>
            <UnifiedChat 
              fullScreen={true} 
              placeholderText={placeholderText}
              title={title}
              subtitle={subtitle}
              className="h-full border-0 rounded-none shadow-none"
            />
            {/* Fallback UI for invalid messages format */}
            {!Array.isArray(messages) && (
              <div className="text-center text-red-500">
                Invalid messages format. Please try again.
              </div>
            )}
          </ChatProvider>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UnifiedFullScreenChat;
