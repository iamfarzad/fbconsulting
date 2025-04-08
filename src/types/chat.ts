
import { ReactNode } from 'react';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  mediaItems?: Array<{
    type: string;
    data: string;
    name?: string;
    mimeType?: string;
  }>;
  feedback?: 'positive' | 'negative' | null;
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
  subtitle?: string;
  onClose?: () => void;
  isConnecting?: boolean;
  clientId?: string;
}

export interface ConnectionStatusIndicatorProps {
  isConnected?: boolean;
  isLoading?: boolean;
  status?: string;
  onRetry?: () => void;
  className?: string;
}
