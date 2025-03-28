
import { AIMessage } from '@/features/gemini/types/messageTypes';
import { ReactNode, RefObject } from 'react';

export interface ChatInputProps {
  placeholder?: string;
}

export interface ChatMessageListProps {
  messages: AIMessage[];
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
