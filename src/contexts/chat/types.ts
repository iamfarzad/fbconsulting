
import { AIMessage } from '@/types/chat'; // Updated import

// Define the shape of our chat state
export interface ChatState {
  messages: AIMessage[];
  inputValue: string;
  isLoading: boolean;
  error: string | null;
  isFullScreen: boolean;
  showMessages: boolean;
  suggestedResponse: string | null;
  isInitialized: boolean;
  // Enhanced functionality
  activeConversationId: string | null;
  conversationTitle: string | null;
  voiceEnabled: boolean;
  mediaPreviewOpen: boolean;
  mediaItems: Array<{
    type: string;
    data: string;
    mimeType?: string;
    name?: string;
  }>;
}

// Define the actions we can dispatch
export type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: AIMessage }
  | { type: 'SET_MESSAGES'; payload: AIMessage[] }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_INPUT_VALUE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'SET_FULLSCREEN'; payload: boolean }
  | { type: 'SET_SHOW_MESSAGES'; payload: boolean }
  | { type: 'SET_SUGGESTED_RESPONSE'; payload: string | null }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_ACTIVE_CONVERSATION'; payload: string | null }
  | { type: 'SET_CONVERSATION_TITLE'; payload: string | null }
  | { type: 'TOGGLE_VOICE'; payload?: boolean }
  | { type: 'TOGGLE_MEDIA_PREVIEW'; payload?: boolean }
  | { type: 'ADD_MEDIA_ITEM'; payload: { type: string; data: string; mimeType?: string; name?: string } }
  | { type: 'REMOVE_MEDIA_ITEM'; payload: number }
  | { type: 'CLEAR_MEDIA_ITEMS' };

// Export interface for ChatContext
export interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (content: string, files?: any[]) => Promise<void>;
  clearMessages: () => void;
  toggleFullScreen: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  isInitialized: boolean;
  isLoading: boolean; 
  error: string | null;
  // Enhanced functionality
  addMediaItem: (item: { type: string; data: string; mimeType?: string; name?: string }) => void;
  removeMediaItem: (index: number) => void;
  clearMediaItems: () => void;
  toggleVoice: (enable?: boolean) => void;
}

// Initial state
export const initialChatState: ChatState = {
  messages: [],
  inputValue: '',
  isLoading: false,
  error: null,
  isFullScreen: false,
  showMessages: true,
  suggestedResponse: null,
  isInitialized: false,
  // Enhanced functionality initial values
  activeConversationId: null,
  conversationTitle: null,
  voiceEnabled: false,
  mediaPreviewOpen: false,
  mediaItems: [],
};
