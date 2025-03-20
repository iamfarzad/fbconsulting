
import React from 'react';
import { useEnhancedChat } from '@/hooks/useEnhancedChat';
import { EnhancedChatContainer } from '@/components/ui/ai-chat/EnhancedChatContainer';
import { useToast } from '@/hooks/use-toast';
import { ChatServiceType } from '@/services/chat/ChatFactory';

interface EnhancedChatDemoProps {
  apiKey?: string;
  className?: string;
  fullScreen?: boolean;
}

export const EnhancedChatDemo: React.FC<EnhancedChatDemoProps> = ({
  apiKey,
  className,
  fullScreen = false
}) => {
  const { toast } = useToast();
  const [isFullScreen, setIsFullScreen] = React.useState(fullScreen);
  
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    isListening,
    toggleListening,
    voiceError,
    isVoiceSupported
  } = useEnhancedChat({
    apiKey: apiKey,
    serviceType: apiKey ? ChatServiceType.GEMINI : ChatServiceType.MOCK,
    persistMessages: true,
    storageKey: 'enhanced-chat-demo'
  });
  
  // Show error toast when error occurs
  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      });
    }
  }, [error, toast]);
  
  // Show voice error toast when voice error occurs
  React.useEffect(() => {
    if (voiceError) {
      toast({
        title: 'Voice Recognition Error',
        description: voiceError,
        variant: 'destructive'
      });
    }
  }, [voiceError, toast]);
  
  return (
    <EnhancedChatContainer
      title="AI Assistant"
      subtitle={apiKey ? "Connected to Gemini AI" : "Demo Mode (Mock Responses)"}
      messages={messages}
      onSendMessage={sendMessage}
      onClearChat={clearMessages}
      isLoading={isLoading}
      isFullScreen={isFullScreen}
      onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
      className={className}
      isVoiceSupported={isVoiceSupported}
      onToggleVoice={toggleListening}
      isListening={isListening}
    />
  );
};
