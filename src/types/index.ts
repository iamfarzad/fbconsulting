export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeminiUserInfo {
  name: string;
  email: string;
}

export type ChatStep = 'intro' | 'form' | 'chat' | 'proposal' | 'chooseAction';

export interface ProposalData {
  summary: string[];
  pricing: Array<{
    service: string;
    price: number;
    description: string;
  }>;
  recommendations: string[];
}

export type GeminiAction =
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_USER_INFO'; payload: GeminiUserInfo | null }
  | { type: 'SET_STEP'; payload: ChatStep }
  | { type: 'SET_PROPOSAL'; payload: ProposalData | null }
  | { type: 'RESTORE_STATE'; payload: GeminiState }
  | { type: 'RESET_STATE' };

export interface GeminiState {
  messages: ChatMessage[];
  userInfo: GeminiUserInfo | null;
  step: ChatStep;
  proposal: ProposalData | null;
}
