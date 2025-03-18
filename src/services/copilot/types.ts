/**
 * Types for Google GenAI configuration and chat functionality
 */

export type VoiceType = 'Charon';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  audio?: AudioContent;
}

export interface AudioContent {
  voice: VoiceType;
  text: string;
}

export interface SpatialContext {
  pageSection: string;
  elementType: string;
  interactionType: string;
  userBehavior: string;
  timestamp: number;
}

export interface VoiceConfig {
  enabled: boolean;
  voice: VoiceType;
  pitch?: number;
  rate?: number;
}

export interface AgenticConfig {
  proactiveAssistance: boolean;
  learningEnabled: boolean;
  contextAwareness: boolean;
  behaviorPatterns: string[];
  userPreferences?: Record<string, unknown>;
}

export interface GoogleGenAIConfig {
  apiKey: string;
  modelName?: string;
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  voice?: VoiceConfig;
  spatialUnderstanding?: boolean;
  agentic?: AgenticConfig;
  streamingEnabled?: boolean;
}

export interface ChatOptions {
  initialMessages?: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  voice?: VoiceConfig;
  spatialContext?: SpatialContext;
  agentic?: AgenticConfig;
}
