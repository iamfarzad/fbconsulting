
import { ReactNode, RefObject } from 'react';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  id?: string;
  mediaItems?: Array<{
    type: string;
    data: string;
    mimeType?: string;
  }>;
}

export interface ChatInputProps {
  placeholder?: string;
}

export interface ChatMessageListProps {
  messages?: AIMessage[];
  showMessages?: boolean;
  isFullScreen?: boolean;
  isLoading?: boolean;
}

export interface UnifiedChatProps {
  title?: string;
  subtitle?: string;
  placeholderText?: string;
  className?: string;
  apiKey?: string;
  modelName?: string;
  onToggleFullScreen?: () => void;
}

export interface UnifiedFullScreenChatProps {
  onMinimize: () => void;
  placeholderText?: string;
  apiKey?: string;
  modelName?: string;
}

export interface ChatProviderProps {
  children: ReactNode;
  apiKey?: string;
  modelName?: string;
}

export interface ConnectionStatusIndicatorProps {
  isConnected: boolean;
  isLoading?: boolean;
  className?: string;
}

export interface ChatHeaderProps {
  title?: string;
  onClose?: () => void;
  onClear?: () => void;
  hasMessages?: boolean;
}

export interface UnifiedVoiceUIProps {
  onCommand?: (command: string) => void | Promise<void>;
  noFloatingButton?: boolean;
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
}
