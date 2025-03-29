
import { ReactNode } from 'react';

// Basic AI message type
export interface AIMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp?: number;
  media?: Array<{
    type: string;
    data: string;
    mimeType?: string;
    url?: string;
    caption?: string;
    fileName?: string;
  }>;
}

// Props for ChatInput component
export interface ChatInputProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

// Props for ChatMessageList component
export interface ChatMessageListProps {
  messages?: AIMessage[];
  isLoading?: boolean;
  isFullScreen?: boolean;
  showMessages?: boolean;
}

// Props for FullScreenChat component
export interface UnifiedFullScreenChatProps {
  onMinimize: () => void;
  placeholderText?: string;
  apiKey?: string;
  modelName?: string;
}

// For file attachments in chat
export interface FileAttachment {
  data: string;
  mimeType: string;
  name: string;
  type: string;
  size?: number;
}

// Configuration for UnifiedChat component
export interface UnifiedChatConfig {
  apiKey?: string;
  modelName?: string;
  placeholder?: string;
  autoFullScreen?: boolean;
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
}

// Props for the UnifiedChat component
export interface UnifiedChatProps extends UnifiedChatConfig {
  className?: string;
  initialMessages?: AIMessage[];
  onMessageSent?: (message: string) => void;
  onMessageReceived?: (message: AIMessage) => void;
}
