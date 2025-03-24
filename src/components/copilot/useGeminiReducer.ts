import { ChatMessage, GeminiState, GeminiAction, ChatStep, GeminiUserInfo, ProposalData } from '@/types';

export interface GeminiReducerState extends GeminiState {
  isLoading: boolean;
  chatError: string | null;
}

export type GeminiReducerAction = GeminiAction 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CHAT_ERROR'; payload: string | null };

const defaultState: GeminiReducerState = {
  messages: [],
  userInfo: null,
  step: 'intro',
  proposal: null,
  isLoading: false,
  chatError: null
};

export function geminiReducer(
  state: GeminiReducerState = defaultState, 
  action: GeminiReducerAction
): GeminiReducerState {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [], chatError: null };
    case 'SET_USER_INFO':
      return { ...state, userInfo: action.payload };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_PROPOSAL':
      return { ...state, proposal: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CHAT_ERROR':
      return { ...state, chatError: action.payload };
    case 'RESTORE_STATE':
      // Merge restored state with default state to ensure all fields exist
      return {
        ...defaultState,
        ...action.payload,
        isLoading: false, // Always reset loading on restore
        chatError: null // Always reset errors on restore
      };
    case 'RESET_STATE':
      return defaultState;
    default:
      return state;
  }
}

export const initialGeminiState = defaultState;
