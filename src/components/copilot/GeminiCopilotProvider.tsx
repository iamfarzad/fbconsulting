import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useVoice } from '@/hooks/useVoice';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { GeminiState, GeminiAction, GeminiUserInfo, ChatStep, ProposalData } from '@/types';
import { useCopilotReadable } from '@copilot-kit/react-core';
import { useGeminiAudio } from '@/hooks/useGeminiAudio';
import { toast } from '@/components/ui/toast';

interface GeminiCopilotContextType {
  isListening: boolean;
  toggleListening: () => void;
  transcript: string | null;
  voiceError: string | null;
  messages: GeminiState['messages'];
  sendMessage: (text: string) => void;
  isPlaying: boolean;
  progress: number;
  stopAudio: () => void;
  generateAndPlayAudio: (text: string) => Promise<void>;
  step: ChatStep;
  setStep: (step: ChatStep) => void;
  userInfo: GeminiUserInfo | null;
  setUserInfo: (info: GeminiUserInfo | null) => void;
  isLoading: boolean;
  chatError: string | null;
  clearMessages: () => void;
  clearStorage: () => void;
  proposal: ProposalData | null;
  audio: ReturnType<typeof useGeminiAudio>;
  resetConversation: () => void;
  generateProposal: (proposalData: ProposalData) => Promise<{success: boolean, message: string}>;
  sendProposal: () => Promise<{success: boolean}>;
}

const GeminiCopilotContext = createContext<GeminiCopilotContextType | null>(null);

const initialState: GeminiState = {
  messages: [],
  userInfo: null,
  step: 'intro',
  proposal: null
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

export const GeminiCopilotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { clearStorage, hasStoredState } = useLocalStorage(state, dispatch);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Wait for potential localStorage restore before rendering
  React.useEffect(() => {
    if (!isInitialized) {
      const hasState = hasStoredState();
      if (!hasState) {
        dispatch({ type: 'RESET_STATE' });
      }
      setIsInitialized(true);
    }
  }, [hasStoredState, isInitialized]);

  const {
    isListening,
    toggleListening,
    transcript,
    error: voiceError,
  } = useVoice();

  // Replace existing audio playback with our new implementation
  const audio = useGeminiAudio({
    onStart: () => {
      console.log('Audio playback started');
    },
    onStop: () => {
      console.log('Audio playback stopped');
    },
    onError: (error) => {
      console.error('Audio playback error:', error);
    }
  });

  // Expose state to CopilotKit for assistant to access
  useCopilotReadable({
    userInfo: state.userInfo,
    proposal: state.proposal
  });

  const sendMessage = useCallback((text: string) => {
    dispatch({ type: 'ADD_MESSAGE', payload: { role: 'user', content: text } });
    // TODO: Add actual message handling logic here
  }, []);

  const setStep = useCallback((step: ChatStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const setUserInfo = useCallback((info: GeminiUserInfo | null) => {
    dispatch({ type: 'SET_USER_INFO', payload: info });
  }, []);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  // Hook up to the new audio system
  const generateAndPlayAudio = useCallback(async (text: string) => {
    return audio.playText(text);
  }, [audio]);

  // Create generateProposal function
  const generateProposal = useCallback(async (proposalData: ProposalData) => {
    try {
      dispatch({ type: 'SET_PROPOSAL', payload: proposalData });
      return { success: true, message: 'Proposal generated successfully' };
    } catch (error) {
      console.error('Error generating proposal:', error);
      return { success: false, message: 'Failed to generate proposal' };
    }
  }, []);

  // Add a send proposal function with toast notification
  const sendProposal = useCallback(async () => {
    try {
      // Implement actual sending logic here (API call, etc.)
      
      // Show success toast notification
      toast.success('Proposal sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Error sending proposal:', error);
      toast.error('Failed to send proposal');
      return { success: false };
    }
  }, []);

  // Add reset conversation functionality
  const resetConversation = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
    // Also clear any active audio
    audio.stopPlayback();
  }, [audio]);

  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }

  const contextValue = {
    isListening,
    toggleListening,
    transcript,
    voiceError,
    messages: state.messages,
    sendMessage,
    isPlaying: audio.isPlaying,
    progress: audio.progress,
    stopAudio: audio.stopPlayback,
    generateAndPlayAudio,
    step: state.step,
    setStep,
    userInfo: state.userInfo,
    setUserInfo,
    isLoading: false, // TODO: Add actual loading state
    chatError: null, // TODO: Add actual error handling
    clearMessages,
    clearStorage,
    proposal: state.proposal,
    audio,
    resetConversation,
    generateProposal,
    sendProposal
  };

  return (
    <GeminiCopilotContext.Provider value={contextValue}>
      {children}
    </GeminiCopilotContext.Provider>
  );
};

export const useGeminiCopilot = () => {
  const context = useContext(GeminiCopilotContext);
  if (!context) {
    throw new Error('useGeminiCopilot must be used within a GeminiCopilotProvider');
  }
  return context;
};
