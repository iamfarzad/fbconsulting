import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useVoice } from '@/hooks/useVoice';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { GeminiState, GeminiAction, GeminiUserInfo, ChatStep, ProposalData } from '@/types';
import { useCopilotReadable } from '@copilot-kit/react-core';
import { useGeminiAudio } from '@/hooks/useGeminiAudio';
import { toast } from '@/components/ui/toast';
import ErrorBoundaryWrapper from '../ErrorBoundaryWrapper';

// GeminiConnectionManager.tsx
const GeminiConnectionManagerContext = createContext(null);

const GeminiConnectionManager = ({ children }) => {
  const { isListening, toggleListening, transcript, error: voiceError } = useVoice();
  const audio = useGeminiAudio({
    onStart: () => console.log('Audio playback started'),
    onStop: () => console.log('Audio playback stopped'),
    onError: (error) => console.error('Audio playback error:', error),
  });

  const contextValue = {
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
    <ErrorBoundaryWrapper>
      <GeminiConnectionManagerContext.Provider value={contextValue}>
        {children}
      </GeminiConnectionManagerContext.Provider>
    </ErrorBoundaryWrapper>
  );
};

export const useGeminiConnectionManager = () => {
  const context = useContext(GeminiConnectionManagerContext);
  if (!context) {
    throw new Error('useGeminiConnectionManager must be used within a GeminiConnectionManager');
  }
  return context;
};

// GeminiChatContext.tsx
const GeminiChatContext = createContext(null);

const initialState = {
  messages: [],
  userInfo: null,
  step: 'intro',
  proposal: null,
};

function reducer(state, action) {
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

const GeminiChatProvider = ({ children }) => {
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

  const sendMessage = useCallback((text) => {
    dispatch({ type: 'ADD_MESSAGE', payload: { role: 'user', content: text } });
  }, []);

  const setStep = useCallback((step) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const setUserInfo = useCallback((info) => {
    dispatch({ type: 'SET_USER_INFO', payload: info });
  }, []);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  const generateProposal = useCallback(async (proposalData) => {
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

  const contextValue = {
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
    <ErrorBoundaryWrapper>
      <GeminiChatContext.Provider value={contextValue}>
        {children}
      </GeminiChatContext.Provider>
    </ErrorBoundaryWrapper>
  );
};

export const useGeminiChat = () => {
  const context = useContext(GeminiChatContext);
  if (!context) {
    throw new Error('useGeminiChat must be used within a GeminiChatProvider');
  }
  return context;
};

// GeminiCopilotProvider.tsx
export const GeminiCopilotProvider = ({ children }) => (
  <ErrorBoundaryWrapper>
    <GeminiConnectionManager>
      <ErrorBoundaryWrapper>
        <GeminiChatProvider>
          {children}
        </GeminiChatProvider>
      </ErrorBoundaryWrapper>
    </GeminiConnectionManager>
  </ErrorBoundaryWrapper>
);
