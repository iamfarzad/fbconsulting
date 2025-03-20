
import React from 'react';
import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className }) => {
  return (
    <div className={`flex justify-start ${className}`}>
      <div className="max-w-[80%] p-3 rounded-lg bg-muted">
        <div className="flex space-x-2">
          <motion.div 
            className="w-2 h-2 rounded-full bg-foreground/40"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <motion.div 
            className="w-2 h-2 rounded-full bg-foreground/40"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
          />
          <motion.div 
            className="w-2 h-2 rounded-full bg-foreground/40"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
          />
        </div>
      </div>
    </div>
  );
};
