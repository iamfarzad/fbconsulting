
export type MediaType = 'image' | 'document' | 'code' | 'link';

export interface MessageMedia {
  type: MediaType;
  url?: string;
  data?: string;
  caption?: string;
  mimeType?: string;
  fileName?: string;
  // Code-specific properties
  codeContent?: string;
  codeLanguage?: string;
  // Link-specific properties
  linkTitle?: string;
  linkDescription?: string;
  linkImage?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  mediaItems?: MessageMedia[];
  feedback?: 'positive' | 'negative' | null;
}

export interface LeadInfo {
  name?: string;
  email?: string;
  company?: string;
  industry?: string;
  needs?: string[];
  budget?: string;
  timeline?: string;
  source?: string;
  stage?: string;
  lastContact?: number;
  notes?: string;
  phone?: string; // Added to fix TS2353 error
}

// Define LeadStage for useLeadStage.ts
export type LeadStage = 'new' | 'discovery' | 'proposal' | 'negotiation' | 'closed';
