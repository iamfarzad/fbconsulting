
import React from 'react';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn("flex space-x-1 items-center", className)}>
      <div className="text-sm text-muted-foreground mr-2">AI is typing</div>
      <div className="typing-dot bg-primary/50 animate-pulse"></div>
      <div className="typing-dot bg-primary/50 animate-pulse delay-75"></div>
      <div className="typing-dot bg-primary/50 animate-pulse delay-150"></div>
      <style jsx>{`
        .typing-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
        }
        .delay-75 {
          animation-delay: 0.2s;
        }
        .delay-150 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}
