
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  children: React.ReactNode;
  className?: string;
  isFullScreen?: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ 
  children, 
  className,
  isFullScreen = false 
}) => {
  return (
    <div 
      className={cn(
        "glassmorphism-base rounded-xl border border-white/10 shadow-lg",
        isFullScreen 
          ? "fixed inset-0 z-50 flex flex-col p-0" 
          : "flex flex-col p-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ChatPanel;
