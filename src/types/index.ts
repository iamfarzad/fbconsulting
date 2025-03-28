
// Chat Types
export type ChatStep = 'intro' | 'info' | 'discovery' | 'proposal' | 'followup' | 'completed';

export interface GeminiUserInfo {
  name: string;
  email: string;
  company?: string;
  role?: string;
  needs?: string[];
}

export interface ProposalData {
  description: string;
  services: string[];
  estimatedCost?: string;
  timeframe?: string;
}

// Gemini State Types
export interface GeminiState {
  messages: {
    role: 'user' | 'assistant' | 'system' | 'error';
    content: string;
    id?: string;
    timestamp?: number;
  }[];
  userInfo: GeminiUserInfo | null;
  step: ChatStep;
  proposal: ProposalData | null;
}

export type GeminiAction =
  | { type: 'SET_MESSAGES'; payload: GeminiState['messages'] }
  | { type: 'ADD_MESSAGE'; payload: GeminiState['messages'][0] }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_USER_INFO'; payload: GeminiUserInfo | null }
  | { type: 'SET_STEP'; payload: ChatStep }
  | { type: 'SET_PROPOSAL'; payload: ProposalData | null }
  | { type: 'RESTORE_STATE'; payload: GeminiState }
  | { type: 'RESET_STATE' };
