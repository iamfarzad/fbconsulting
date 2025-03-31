// Chat Types
export * from './chat';
export * from './message';
export * from './voice';
export * from './gemini';

// Core Types
export interface ProposalData {
  description: string;
  services: string[];
  estimatedCost?: string;
  timeframe?: string;
}

export interface LeadInfo {
  name?: string;
  email?: string;
  company?: string;
  position?: string;
  interests?: string[];
  source?: string;
  stage?: string;
  notes?: string;
}

export interface UserInfo {
  name: string;
  email: string;
  company?: string;
  role?: string;
  needs?: string[];
}
