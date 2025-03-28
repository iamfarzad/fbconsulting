
import React, { useRef } from 'react';
import { ChatProvider, useChat } from '@/contexts/ChatContext';
import { UnifiedChatProps } from '@/types/chat';
import { UnifiedChatMessageList } from './UnifiedChatMessageList';
import { UnifiedChatInput } from './UnifiedChatInput';

// Internal component that uses the context
const UnifiedChatContent: React.FC<{
  title?: string;
  subtitle?: string;
  placeholderText?: string;
  onToggleFullScreen?: () => void;
  className?: string;
}> = ({
  title,
  subtitle,
  placeholderText = "Ask me anything...",
  onToggleFullScreen,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { state } = useChat();

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {title && (
        <header className="mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
        </header>
      )}
      
      <div className="bg-background border rounded-lg shadow overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 max-h-64">
          <UnifiedChatMessageList />
        </div>
        
        <div className="border-t p-3">
          <UnifiedChatInput placeholder={placeholderText} />
        </div>
        
        {onToggleFullScreen && state.messages.length > 0 && (
          <div className="p-2 text-center">
            <button
              onClick={onToggleFullScreen}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Expand to full screen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrapper component that provides the context
export const UnifiedChat: React.FC<UnifiedChatProps> = ({
  title,
  subtitle,
  placeholderText,
  className,
  apiKey,
  modelName,
  onToggleFullScreen
}) => {
  return (
    <ChatProvider apiKey={apiKey} modelName={modelName}>
      <UnifiedChatContent
        title={title}
        subtitle={subtitle}
        placeholderText={placeholderText}
        className={className}
        onToggleFullScreen={onToggleFullScreen}
      />
    </ChatProvider>
  );
};

export default UnifiedChat;
