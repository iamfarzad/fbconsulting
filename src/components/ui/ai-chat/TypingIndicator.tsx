
import React from 'react';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center space-x-1.5", className)}>
      <div className="w-2 h-2 rounded-full bg-primary/70 animate-pulse" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 rounded-full bg-primary/70 animate-pulse" style={{ animationDelay: "200ms" }} />
      <div className="w-2 h-2 rounded-full bg-primary/70 animate-pulse" style={{ animationDelay: "400ms" }} />
    </div>
  );
};

export default TypingIndicator;
