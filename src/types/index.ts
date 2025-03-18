// Chat message types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Lead information type
export interface LeadInfo {
  email?: string;
  name?: string;
  phone?: string;
  company?: string;
  role?: string;
  interests?: string[];
  challenges?: string[];
  budget?: string;
  timeframe?: string;
  stage?: 'discovery' | 'qualification' | 'interested' | 'ready-to-book';
  notes?: string;
  message?: string;
  timestamp?: string;
}

// Persona data types
export interface PersonaData {
  currentPersona: string;
  personas: Record<string, Persona>;
  currentPage: string;
}

export interface Persona {
  name: string;
  description: string;
  systemPrompt: string;
  suggestedResponses?: string[];
}

// Chat service types
export interface ChatService {
  sendMessage: (message: string, leadInfo?: LeadInfo) => Promise<string>;
  getHistory: () => ChatMessage[];
  clearHistory: () => void;
  initializeChat: (personaData: PersonaData) => void;
}

// Google GenAI adapter types
export interface GoogleGenAIAdapterOptions {
  modelName: string;
  temperature: number;
  maxOutputTokens: number;
  topP?: number;
  topK?: number;
}

export interface GoogleGenAIAdapter {
  apiKey: string;
  modelName: string;
  temperature: number;
  maxOutputTokens: number;
  topP?: number;
  topK?: number;
}
