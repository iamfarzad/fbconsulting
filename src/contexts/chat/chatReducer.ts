import { ChatState, ChatAction } from './types';

export const initialChatState: ChatState = {
  messages: [],
  inputValue: '',
  isLoading: false,
  error: null,
  isFullScreen: false,
  showMessages: true,
  mediaItems: [],
  currentPersona: 'default',
  isVoiceEnabled: false,
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload,
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id === action.payload.id
            ? { ...message, ...action.payload.updates }
            : message
        ),
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

    case 'TOGGLE_FULL_SCREEN':
      return {
        ...state,
        isFullScreen: !state.isFullScreen,
      };

    case 'SET_SHOW_MESSAGES':
      return {
        ...state,
        showMessages: action.payload,
      };

    case 'ADD_MEDIA_ITEM':
      return {
        ...state,
        mediaItems: [...state.mediaItems, action.payload],
      };

    case 'REMOVE_MEDIA_ITEM':
      return {
        ...state,
        mediaItems: state.mediaItems.filter((item) => item.id !== action.payload),
      };

    case 'CLEAR_MEDIA_ITEMS':
      return {
        ...state,
        mediaItems: [],
      };

    case 'SET_PERSONA':
      return {
        ...state,
        currentPersona: action.payload,
      };

    case 'SET_VOICE_ENABLED':
      return {
        ...state,
        isVoiceEnabled: action.payload,
      };

    case 'CLEAR_CHAT':
      return {
        ...state,
        messages: [],
        mediaItems: [],
        error: null,
      };

    default:
      return state;
  }
}
