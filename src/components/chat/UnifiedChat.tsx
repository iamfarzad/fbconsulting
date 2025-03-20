
import React from 'react';
import { useChat, ChatProvider } from '@/contexts/ChatContext';
import { ChatHeader } from './core/ChatHeader';
import { UnifiedChatMessageList } from './UnifiedChatMessageList';
import { UnifiedChatInput } from './UnifiedChatInput';

interface UnifiedChatContentProps {
  title?: string;
  subtitle?: string;
  placeholderText?: string;
  fullScreen?: boolean;
  onToggleFullScreen?: () => void;
  className?: string;
  useCopilotKit?: boolean;
}

// Inner component that uses the ChatContext
const UnifiedChatContent: React.FC<UnifiedChatContentProps> = ({
  title = 'AI Assistant',
  subtitle,
  placeholderText = 'Ask me anything...',
  fullScreen = false,
  onToggleFullScreen,
  className = '',
  useCopilotKit = false
}) => {
  const { 
    state, 
    clearMessages, 
    toggleFullScreen,
    containerRef,
    isInitialized
  } = useChat();
  
  const {
    isFullScreen: contextIsFullScreen,
    isLoading,
    messages,
    showMessages
  } = state;
  
  // Use either prop or context value for fullScreen
  const isFullScreenMode = fullScreen || contextIsFullScreen;
  const handleToggleFullScreen = onToggleFullScreen || toggleFullScreen;
  
  const hasMessages = messages.filter(m => m.role !== 'system').length > 0;
  
  return (
    <div 
      className={`flex flex-col bg-background border rounded-lg shadow-sm ${isFullScreenMode ? 'h-full' : 'h-[500px]'} ${className}`}
      ref={containerRef}
    >
      <ChatHeader 
        title={title}
        subtitle={subtitle || (isInitialized ? 'Connected' : 'Initializing...')}
        onClear={hasMessages ? clearMessages : undefined}
        onToggleFullScreen={handleToggleFullScreen}
        isFullScreen={isFullScreenMode}
        isConnected={isInitialized}
        isLoading={isLoading}
      />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Only show messages if we have some or if showMessages is true */}
        {(showMessages || hasMessages) && (
          <UnifiedChatMessageList />
        )}
      </div>
      
      <div className="p-4 border-t">
        <UnifiedChatInput placeholder={placeholderText} />
      </div>
    </div>
  );
};

// Main component that provides the ChatContext
interface UnifiedChatProps extends UnifiedChatContentProps {}

export const UnifiedChat: React.FC<UnifiedChatProps> = (props) => {
  return (
    <ChatProvider>
      <UnifiedChatContent {...props} />
    </ChatProvider>
  );
};
