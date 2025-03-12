
import React from 'react';
import { Bot, X } from 'lucide-react';
import { AIChatInput } from '../ui/ai-chat';
import { motion } from 'framer-motion';
import { AnimatedBars } from '../ui/AnimatedBars';

interface MiniChatWindowProps {
  onClose: () => void;
  onExpand: () => void;
}

const MiniChatWindow: React.FC<MiniChatWindowProps> = ({ 
  onClose, 
  onExpand 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-20 right-4 md:right-6 z-50 w-full max-w-md"
    >
      <div className="bg-black border border-white/30 rounded-xl shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Bot size={18} className="text-white" />
            AI Assistant
          </h3>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <AnimatedBars isActive={true} small={true} />
            </div>
            <button 
              onClick={onClose}
              className="text-white/70 hover:text-white p-1 rounded-full hover:bg-black/80"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div className="p-4 pt-0">
          <AIChatInput autoFullScreen={false} />
        </div>
        
        <div className="p-3 text-center border-t border-white/10">
          <button
            onClick={onExpand}
            className="text-white/70 text-sm hover:text-white transition-colors"
          >
            Expand to full screen
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MiniChatWindow;
