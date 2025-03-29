export interface WebSocketClientOptions {
  url?: string;
  clientId?: string;
  onOpen?: () => void;
  onMessage?: (data: any) => void;
  onClose?: () => void;
  onError?: (error: string) => void;
  reconnectAttempts?: number;
  pingInterval?: number;
  pingTimeout?: number;
  debug?: boolean;
  autoReconnect?: boolean;
  suppressErrors?: boolean;
  onAudioChunk?: (info: AudioChunkInfo, data: ArrayBuffer) => void;
}

export interface WebSocketMessage {
  type: string;
  content?: string;
  error?: string;
  status?: string;
}

export interface AudioChunkInfo {
  size: number;
  format: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp?: number;
}

export interface VoiceConfig {
  voice: string;
  pitch?: number;
  rate?: number;
  volume?: number;
}

export interface ChatConfig {
  temperature?: number;
  maxTokens?: number;
  topK?: number;
  topP?: number;
  voice?: VoiceConfig;
}

export interface SpatialContext {
  pageSection: string;
  elementType: string;
  interactionType: string;
  userBehavior: string;
  timestamp: number;
}

export interface CopilotConfig {
  apiKey: string;
  options: {
    model: string;
    temperature: number;
    maxTokens: number;
    initialMessages: Message[];
    voice?: VoiceConfig;
    spatialContext?: SpatialContext;
    agentic?: {
      proactiveAssistance: boolean;
      learningEnabled: boolean;
      contextAwareness: boolean;
      behaviorPatterns: string[];
    };
  };
}
