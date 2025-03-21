export interface Message {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp?: number;
}

export interface WebSocketMessage {
  type: 'text' | 'error' | 'connection' | 'audio' | 'vision_response';
  content?: string;
  status?: 'connected' | 'error';
  error?: string;
}

export interface MessageHandler {
  (data: string): void;
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
