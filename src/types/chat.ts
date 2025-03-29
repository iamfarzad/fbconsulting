
import { ReactNode } from 'react';
import { MessageMedia } from '@/services/chat/messageTypes';

// Basic AI message type
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  media?: MessageMedia[];
  feedback?: 'positive' | 'negative' | null;
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
  title?: string;
  subtitle?: string;
  placeholderText?: string;
  onToggleFullScreen?: () => void;
}

// Added missing types for ConnectionStatusIndicator
export interface ConnectionStatusIndicatorProps {
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  className?: string;
}

// Added missing types for ChatHeader
export interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

// Added missing types for UnifiedVoiceUI
export interface UnifiedVoiceUIProps {
  isListening?: boolean;
  transcript?: string;
  onToggleListening?: () => void;
  className?: string;
}
