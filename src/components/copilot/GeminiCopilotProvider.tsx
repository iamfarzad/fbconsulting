
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { GeminiState, GeminiAction, GeminiUserInfo, ChatStep, ProposalData } from '@/types';
import { GeminiAdapter } from '@/features/gemini/services/geminiAdapter';
import ErrorBoundaryWrapper from '../ErrorBoundaryWrapper';

interface GeminiCopilotContextType {
  messages: GeminiState['messages'];
  sendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  chatError: string | null;
  clearMessages: () => void;
  step: ChatStep;
  setStep: (step: ChatStep) => void;
  userInfo: GeminiUserInfo | null;
  setUserInfo: (info: GeminiUserInfo | null) => void;
  proposal: ProposalData | null;
  generateProposal: (proposalData: ProposalData) => Promise<{success: boolean, message: string}>;
  resetConversation: () => void;
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
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message immediately
    dispatch({ 
      type: 'ADD_MESSAGE', 
      payload: { 
        role: 'user', 
        content,
        id: Date.now().toString(),
        timestamp: Date.now()
      } 
    });

    try {
      setIsLoading(true);
      setChatError(null);

      // Actual API call
      const response = await GeminiAdapter.generateResponse({
        prompt: content,
        model: 'gemini-2.0-pro'
      });

      // Add the response
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: response.text,
          id: Date.now().toString(),
          timestamp: Date.now()
        }
      });

      if (response.error) {
        setChatError(response.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChatError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, [dispatch]);

  const setStep = useCallback((step: ChatStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, [dispatch]);

  const setUserInfo = useCallback((info: GeminiUserInfo | null) => {
    dispatch({ type: 'SET_USER_INFO', payload: info });
  }, [dispatch]);

  const generateProposal = useCallback(async (proposalData: ProposalData) => {
    try {
      dispatch({ type: 'SET_PROPOSAL', payload: proposalData });
      return { success: true, message: 'Proposal generated successfully' };
    } catch (error) {
      console.error('Error generating proposal:', error);
      return { success: false, message: 'Failed to generate proposal' };
    }
  }, [dispatch]);

  const resetConversation = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, [dispatch]);

  const contextValue = {
    messages: state.messages,
    sendMessage,
    isLoading,
    chatError,
    clearMessages,
    step: state.step,
    setStep,
    userInfo: state.userInfo,
    setUserInfo,
    proposal: state.proposal,
    generateProposal,
    resetConversation
  };

  return (
    <GeminiCopilotContext.Provider value={contextValue}>
      <ErrorBoundaryWrapper>
        {children}
      </ErrorBoundaryWrapper>
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

// Fix React error with missing useState import
import { useState } from 'react';
