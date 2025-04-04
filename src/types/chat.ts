import { ReactNode } from 'react';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  feedback?: 'positive' | 'negative' | null;
}

export interface ChatInputProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

export interface ChatMessageListProps {
  messages?: AIMessage[];
  isLoading?: boolean;
  isFullScreen?: boolean;
  showMessages?: boolean;
}

export interface FileAttachment {
  data: string;
  mimeType: string;
  name: string;
  type: string;
  size?: number;
}

export interface ChatConfig {
  placeholder?: string;
  autoFullScreen?: boolean;
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
}

export interface ChatProps extends ChatConfig {
  className?: string;
  initialMessages?: AIMessage[];
  onMessageSent?: (message: string) => void;
  onMessageReceived?: (message: AIMessage) => void;
  title?: string;
  subtitle?: string;
  placeholderText?: string;
  onToggleFullScreen?: () => void;
}

export interface ConnectionStatusIndicatorProps {
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  className?: string;
}

export interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}
