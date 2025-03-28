
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  className?: string;
  style?: 'simple' | 'bubbled';
  dark?: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  className,
  style = 'bubbled',
  dark = false
}) => {
  // Choose the appropriate dot style based on the props
  const dotColor = dark ? 'bg-white' : 'bg-gray-500';
  const bubbleColor = dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200';
  
  if (style === 'simple') {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            className={cn("w-2 h-2 rounded-full", dotColor)}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: dot * 0.2,
            }}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className={cn("flex justify-start", className)}>
      <div className={cn("border p-3 rounded-lg max-w-[80%]", bubbleColor)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className={cn("w-2 h-2 rounded-full", dotColor)}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: dot * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
