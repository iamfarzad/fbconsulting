
export interface AIMessage {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  id?: string;
}

export type MessageRole = 'user' | 'assistant' | 'system' | 'error';

export interface ChatContextType {
  state: {
    messages: AIMessage[];
    inputValue: string;
    isLoading: boolean;
    showMessages: boolean;
    isInitialized: boolean;
    isFullScreen: boolean;
  };
  dispatch: React.Dispatch<any>;
  sendMessage: (content: string, files?: any[]) => void;
  clearMessages: () => void;
  toggleFullScreen: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  error?: string | null;
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

export interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  onClear?: () => void;
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
  isConnected?: boolean;
  isLoading?: boolean;
}

export interface UnifiedChatProps {
  placeholderText?: string;
  onToggleFullScreen?: () => void;
  className?: string;
  apiKey?: string;
  modelName?: string;
  title?: string;
  subtitle?: string;
}

export interface UnifiedFullScreenChatProps {
  onMinimize: () => void;
  placeholderText?: string;
  apiKey?: string;
  modelName?: string;
}

export interface FileAttachment {
  mimeType: string;
  data: string;
  name: string;
  type: string;
}

export interface AudioMessage {
  content: string;
  voiceId?: string;
  stability?: number;
  similarity?: number;
  speakerBoost?: boolean;
  style?: number;
  modelId?: string;
}

// Create a dedicated type for Voice UI
export interface VoiceUIProps {
  onCommand?: (command: string) => void;
  noFloatingButton?: boolean;
}

// Unified Voice UI Props
export interface UnifiedVoiceUIProps {
  onCommand?: (command: string) => void;
  noFloatingButton?: boolean;
}

// Create a dedicated type for Voice Feedback
export interface VoiceFeedbackProps {
  isListening: boolean;
  transcript?: string;
}

export interface ConnectionStatusIndicatorProps {
  status: 'connecting' | 'connected' | 'disconnected';
  onRetry?: () => Promise<void>;
}
