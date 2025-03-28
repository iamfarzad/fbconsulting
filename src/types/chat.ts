// Basic chat types
export interface AIMessage {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  id?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp?: number;
}

export interface ConnectionStatusIndicatorProps {
  isConnected?: boolean;
  isLoading?: boolean;
  className?: string;
  status?: 'connected' | 'connecting' | 'disconnected';
  onRetry?: () => void;
}

export interface ChatMessageListProps {
  messages?: AIMessage[];
  showMessages?: boolean;
  isFullScreen?: boolean;
  isLoading?: boolean;
}

export interface ChatInputProps {
  placeholder?: string;
  disabled?: boolean;
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

export interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  onClear?: () => void;
  hasMessages?: boolean;
  isConnected?: boolean;
  isConnecting?: boolean;
}

export interface UnifiedVoiceUIProps {
  onCommand?: (command: string) => Promise<void> | void;
  noFloatingButton?: boolean;
}
