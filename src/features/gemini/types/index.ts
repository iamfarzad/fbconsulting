// Core Types
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface VoiceConfig {
  enabled: boolean;
  voice: string;
  pitch: number;
  rate: number;
}

export interface SpatialContext {
  pageSection: string;
  elementType: string;
  interactionType: string;
  userBehavior: string;
  timestamp: number;
}

// Copilot Types
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
