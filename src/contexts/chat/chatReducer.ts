
import { ChatState, ChatAction } from './types';

// Reducer function to handle all state updates
export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        showMessages: true,
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload,
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
        activeConversationId: null,
        conversationTitle: null,
      };
    case 'SET_INPUT_VALUE':
      return {
        ...state,
        inputValue: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'TOGGLE_FULLSCREEN':
      return {
        ...state,
        isFullScreen: !state.isFullScreen,
      };
    case 'SET_FULLSCREEN':
      return {
        ...state,
        isFullScreen: action.payload,
      };
    case 'SET_SHOW_MESSAGES':
      return {
        ...state,
        showMessages: action.payload,
      };
    case 'SET_SUGGESTED_RESPONSE':
      return {
        ...state,
        suggestedResponse: action.payload,
      };
    case 'SET_INITIALIZED':
      return {
        ...state,
        isInitialized: action.payload,
      };
    case 'SET_ACTIVE_CONVERSATION':
      return {
        ...state,
        activeConversationId: action.payload,
      };
    case 'SET_CONVERSATION_TITLE':
      return {
        ...state,
        conversationTitle: action.payload,
      };
    case 'TOGGLE_VOICE':
      return {
        ...state,
        voiceEnabled: action.payload !== undefined ? action.payload : !state.voiceEnabled,
      };
    case 'TOGGLE_MEDIA_PREVIEW':
      return {
        ...state,
        mediaPreviewOpen: action.payload !== undefined ? action.payload : !state.mediaPreviewOpen,
      };
    case 'ADD_MEDIA_ITEM':
      return {
        ...state,
        mediaItems: [...state.mediaItems, action.payload],
      };
    case 'REMOVE_MEDIA_ITEM':
      return {
        ...state,
        mediaItems: state.mediaItems.filter((_, index) => index !== action.payload),
      };
    case 'CLEAR_MEDIA_ITEMS':
      return {
        ...state,
        mediaItems: [],
      };
    default:
      return state;
  }
}
