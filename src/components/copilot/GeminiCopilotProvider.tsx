import { 
  useGeminiMessageSubmission,
  useGeminiInitialization,
} from '@/features/gemini';
import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { useVoice } from '@/hooks/useVoice';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { 
  GeminiState,
  GeminiAction,
  GeminiUserInfo, 
  ChatStep, 
  ProposalData 
} from '@/types';
import { useCopilotReadable } from '@copilot-kit/react-core';
import { useGeminiAudio } from '@/hooks/useGeminiAudio';
import { toast } from '@/components/ui/toast';

interface ConnectionContextType {
  isListening: boolean;
  toggleListening: () => void;
  transcript: string | null;
  voiceError: string | null;
  isPlaying: boolean;
  progress: number;
  stopAudio: () => void;
  generateAndPlayAudio: (text: string) => Promise<void>;
}

interface ChatContextType {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    id: string;
  }>;
  sendMessage: (content: string) => Promise<void>;
  step: ChatStep;
  setStep: (step: ChatStep) => void;
  userInfo: GeminiUserInfo | null;
  setUserInfo: (info: GeminiUserInfo) => void;
  clearMessages: () => void;
  clearStorage: () => void;
  proposal: ProposalData | null;
  resetConversation: () => void;
  generateProposal: (data: ProposalData) => Promise<{ success: boolean; message: string }>;
  sendProposal: () => Promise<{ success: boolean }>;
}

const GeminiConnectionManagerContext = createContext<ConnectionContextType | null>(null);
const GeminiChatContext = createContext<ChatContextType | null>(null);

interface ProviderProps {
  children: ReactNode;
}

const GeminiConnectionManager: React.FC<ProviderProps> = ({ children }) => {
  const { isListening, toggleListening, transcript, error: voiceError } = useVoice();
  const audio = useGeminiAudio({
    onStart: () => console.log('Audio playback started'),
    onStop: () => console.log('Audio playback stopped'),
    onError: (error: Error) => console.error('Audio playback error:', error),
  });

  const contextValue: ConnectionContextType = {
    isListening,
    toggleListening,
    transcript,
    voiceError,
    isPlaying: audio.isPlaying,
    progress: audio.progress,
    stopAudio: audio.stopPlayback,
    generateAndPlayAudio: audio.playText,
  };

  return (
    <GeminiConnectionManagerContext.Provider value={contextValue}>
      {children}
    </GeminiConnectionManagerContext.Provider>
  );
};

const initialState: GeminiState = {
  messages: [],
  userInfo: null,
  step: 'intro',
  proposal: null,
};

function reducer(state: GeminiState, action: GeminiAction): GeminiState {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    case 'SET_USER_INFO':
      return { ...state, userInfo: action.payload };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_PROPOSAL':
      return { ...state, proposal: action.payload };
    case 'RESTORE_STATE':
      return action.payload;
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

const GeminiChatProvider: React.FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { clearStorage, hasStoredState } = useLocalStorage(state, dispatch);
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    if (!isInitialized) {
      const hasState = hasStoredState();
      if (!hasState) {
        dispatch({ type: 'RESET_STATE' });
      }
      setIsInitialized(true);
    }
  }, [hasStoredState, isInitialized]);

  useCopilotReadable({
    userInfo: state.userInfo,
    proposal: state.proposal
  });

  const sendMessage = useCallback(async (content: string) => {
    dispatch({ 
      type: 'ADD_MESSAGE', 
      payload: { 
        role: 'user', 
        content,
        id: Date.now().toString()
      } 
    });

    try {
      const loadingId = Date.now().toString();
      dispatch({ 
        type: 'ADD_MESSAGE', 
        payload: { 
          role: 'assistant', 
          content: '...', 
          id: loadingId 
        } 
      });

      const response = await new Promise<string>(resolve => 
        setTimeout(() => resolve("This is a mock AI response. Replace with actual Gemini API call."), 1000)
      );

      dispatch({
        type: 'SET_MESSAGES',
        payload: state.messages.filter(m => m.id !== loadingId).concat({
          role: 'assistant',
          content: response,
          id: Date.now().toString()
        })
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      dispatch({
        type: 'SET_MESSAGES',
        payload: state.messages.filter(m => m.id !== Date.now().toString())
      });
    }
  }, [state.messages]);

  const setStep = useCallback((step: ChatStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const setUserInfo = useCallback((info: GeminiUserInfo) => {
    dispatch({ type: 'SET_USER_INFO', payload: info });
  }, []);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  const generateProposal = useCallback(async (proposalData: ProposalData) => {
    try {
      dispatch({ type: 'SET_PROPOSAL', payload: proposalData });
      return { success: true, message: 'Proposal generated successfully' };
    } catch (error) {
      console.error('Error generating proposal:', error);
      return { success: false, message: 'Failed to generate proposal' };
    }
  }, []);

  const sendProposal = useCallback(async () => {
    try {
      toast.success('Proposal sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Error sending proposal:', error);
      toast.error('Failed to send proposal');
      return { success: false };
    }
  }, []);

  const resetConversation = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  const contextValue: ChatContextType = {
    messages: state.messages,
    sendMessage,
    step: state.step,
    setStep,
    userInfo: state.userInfo,
    setUserInfo,
    clearMessages,
    clearStorage,
    proposal: state.proposal,
    resetConversation,
    generateProposal,
    sendProposal,
  };

  return (
    <GeminiChatContext.Provider value={contextValue}>
      {children}
    </GeminiChatContext.Provider>
  );
};

export const useGeminiChat = () => {
  const context = useContext(GeminiChatContext);
  if (!context) {
    throw new Error('useGeminiChat must be used within a GeminiChatProvider');
  }
  return context;
};

export const GeminiCopilotProvider: React.FC<ProviderProps> = ({ children }) => (
  <GeminiConnectionManager>
    <GeminiChatProvider>
      {children}
    </GeminiChatProvider>
  </GeminiConnectionManager>
);
