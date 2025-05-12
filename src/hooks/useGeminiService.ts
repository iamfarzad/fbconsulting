import { useState, useCallback } from 'react';
import { fetchGeminiResponse } from '../services/api';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GeminiResponse {
  text?: string;
  error?: string;
  status: 'success' | 'error';
  data: Message[];
}

interface GeminiServiceState {
  loading: boolean;
  error: string | null;
  retryCount: number;
  response: GeminiResponse | null;
  messages: Message[];
}

export const useGeminiService = () => {
  const [state, setState] = useState<GeminiServiceState>({
    loading: false,
    error: null,
    retryCount: 0,
    response: null,
    messages: []
  });

  const sendMessage = useCallback(async (message: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await fetchGeminiResponse(message);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Format messages with type safety
      const formattedMessages: Message[] = Array.isArray(result.data) 
        ? result.data.map(msg => ({
            role: msg.role === 'user' || msg.role === 'assistant' ? msg.role : 'assistant',
            content: msg.content || msg.text || JSON.stringify(msg)
          }))
        : result.text 
          ? [{ role: 'assistant', content: result.text }]
          : [];
      
      // Update state atomically
      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
        retryCount: 0,
        response: result,
        messages: [...prev.messages, ...formattedMessages]
      }));

      return result;
    } catch (err) {
      console.error("Error in useGeminiService:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        retryCount: prev.retryCount + 1
      }));

      return {
        status: 'error',
        error: errorMessage,
        data: []
      } as GeminiResponse;
    }
  }, []);

  const resetMessages = useCallback(() => {
    setState({
      loading: false,
      error: null,
      retryCount: 0,
      response: null,
      messages: []
    });
  }, []);

  const generateAndPlayAudio = useCallback((text: string) => {
    console.log("Would play audio for:", text);
    return Promise.resolve();
  }, []);

  return {
    ...state,
    sendMessage,
    resetMessages,
    isLoading: state.loading,
    generateAndPlayAudio
  };
};

export default useGeminiService;
