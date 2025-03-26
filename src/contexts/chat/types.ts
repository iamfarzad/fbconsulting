import { ReactNode } from 'react';

// Message types
export type MessageRole = 'user' | 'assistant' | 'system' | 'error' | 'function';

export interface MessageContent {
  text?: string;
  image_url?: string;
}

export interface MessageFeedback {
  isLiked?: boolean;
  isDisliked?: boolean;
  comment?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  type: string;
  name: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string | MessageContent[];
  createdAt: Date;
  feedback?: MessageFeedback;
  mediaItems?: MediaItem[];
  isLoading?: boolean;
}

// Chat state
export interface ChatState {
  messages: Message[];
  inputValue: string;
  isLoading: boolean;
  error: Error | null;
  isFullScreen: boolean;
  showMessages: boolean;
  mediaItems: MediaItem[];
  currentPersona: string;
  isVoiceEnabled: boolean;
}

// Chat actions
export type ChatAction =
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<Message> } }
  | { type: 'SET_INPUT_VALUE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'TOGGLE_FULL_SCREEN' }
  | { type: 'SET_SHOW_MESSAGES'; payload: boolean }
  | { type: 'ADD_MEDIA_ITEM'; payload: MediaItem }
  | { type: 'REMOVE_MEDIA_ITEM'; payload: string }
  | { type: 'CLEAR_MEDIA_ITEMS' }
  | { type: 'SET_PERSONA'; payload: string }
  | { type: 'SET_VOICE_ENABLED'; payload: boolean }
  | { type: 'CLEAR_CHAT' };

// Context types
export interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (content: string) => Promise<void>;
  addUserMessage: (content: string) => void;
  clearChat: () => void;
  setInputValue: (value: string) => void;
  addMediaItem: (item: MediaItem) => void;
  removeMediaItem: (id: string) => void;
  toggleFullScreen: () => void;
  setMessageFeedback: (messageId: string, feedback: MessageFeedback) => void;
}

export interface ChatProviderProps {
  children: ReactNode;
  initialState?: Partial<ChatState>;
}
