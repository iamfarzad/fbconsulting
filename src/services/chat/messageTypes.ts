
export interface MessageMedia {
  type: 'image' | 'document' | 'code' | 'link';
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
}
