
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIMessage } from '@/services/chat/messageTypes';
import { EnhancedChatMessageList } from './EnhancedChatMessageList';
import { EnhancedChatInput } from './EnhancedChatInput';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedChatContainerProps {
  title?: string;
  subtitle?: string;
  messages: AIMessage[];
  onSendMessage: (message: string, images?: any[]) => void;
  onClearChat?: () => void;
  isLoading?: boolean;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  onClose?: () => void;
  className?: string;
  isVoiceSupported?: boolean;
  onToggleVoice?: () => void;
  isListening?: boolean;
}

export const EnhancedChatContainer: React.FC<EnhancedChatContainerProps> = ({
  title = 'Chat',
  subtitle,
  messages,
  onSendMessage,
  onClearChat,
  isLoading = false,
  isFullScreen = false,
  onToggleFullScreen,
  onClose,
  className,
  isVoiceSupported = false,
  onToggleVoice,
  isListening = false,
}) => {
  return (
    <Card className={cn(
      "flex flex-col overflow-hidden",
      isFullScreen ? "fixed inset-0 z-50 rounded-none" : "h-full",
      className
    )}>
      <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-2">
          {onToggleFullScreen && (
            <Button variant="ghost" size="icon" onClick={onToggleFullScreen}>
              {isFullScreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isFullScreen ? 'Minimize' : 'Maximize'}
              </span>
            </Button>
          )}
          
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        <EnhancedChatMessageList
          messages={messages}
          isLoading={isLoading}
          className="h-full"
        />
      </CardContent>
      
      <div className="p-4 border-t">
        <EnhancedChatInput
          onSendMessage={onSendMessage}
          onClearChat={onClearChat}
          isLoading={isLoading}
          isVoiceSupported={isVoiceSupported}
          onToggleVoice={onToggleVoice}
          isListening={isListening}
        />
      </div>
    </Card>
  );
};
