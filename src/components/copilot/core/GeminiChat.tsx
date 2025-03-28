import React from 'react';
import { useGemini } from '../providers/GeminiProvider';
import { UnifiedChat } from '@/components/chat/UnifiedChat';
import ConnectionStatusIndicator from '@/components/ui/ConnectionStatusIndicator';

interface GeminiChatProps {
  title?: string;
  placeholder?: string;
  fullScreen?: boolean;
  className?: string;
  onToggleFullScreen?: () => void;
}

export const GeminiChat: React.FC<GeminiChatProps> = ({
  title = 'Gemini Chat',
  placeholder = 'Type your message...',
  fullScreen,
  className,
  onToggleFullScreen
}) => {
  const { isConnected, isConnecting, error } = useGemini();

  return (
    <div className="flex flex-col h-full">
      <div className="absolute top-4 right-4 z-10">
        <ConnectionStatusIndicator />
      </div>
      <UnifiedChat
        title={title}
        placeholderText={placeholder}
        fullScreen={fullScreen}
        onToggleFullScreen={onToggleFullScreen}
        className={className}
        subtitle={error || (isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected')}
      />
    </div>
  );
};

export default GeminiChat;
