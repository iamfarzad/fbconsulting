
import React from 'react';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn("flex space-x-1 items-center", className)}>
      <div className="text-sm text-muted-foreground mr-2">AI is typing</div>
      <div className="w-1 h-1 bg-primary/50 rounded-full animate-pulse"></div>
      <div className="w-1 h-1 bg-primary/50 rounded-full animate-pulse delay-75"></div>
      <div className="w-1 h-1 bg-primary/50 rounded-full animate-pulse delay-150"></div>
      <style jsx>{`
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
