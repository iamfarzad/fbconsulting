
import { ReactNode } from 'react';

export interface AIMessage {
  id: string;  // Make id required to match usage throughout the app
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp?: number;
  mediaItems?: Array<{
    type: string;
    data: string;
    name?: string;
    mimeType?: string;
  }>;
}

export interface ChatComponentProps {
  theme?: 'light' | 'dark' | 'system';
  initialMessages?: AIMessage[];
  apiKey?: string;
  modelName?: string;
  systemMessage?: string;
  welcomeMessage?: string;
  placeholder?: string;
  showBranding?: boolean;
  enableAttachments?: boolean;
  className?: string;
}

export interface ChatConfig {
  apiKey?: string;
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
  systemMessage?: string;
  welcomeMessage?: string;
  enableAttachments?: boolean;
}

export interface ChatHeaderProps {
  title?: string;
  onClear?: () => void;
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
  isConnected?: boolean;
  isLoading?: boolean;
  category?: string;
  date?: string;
  readTime?: string;
  author?: string;
  authorTitle?: string;
  authorAvatar?: string;
  hasMessages?: boolean;
}

export interface ConnectionStatusIndicatorProps {
  isConnected?: boolean;
  isLoading?: boolean;
  status?: string;
  onRetry?: () => void;
}
