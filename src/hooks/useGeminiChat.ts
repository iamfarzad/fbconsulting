
import { useChatState } from './chat/useChatState';
import { usePersonaManager } from './chat/usePersonaManager';
import { useMessageHandler } from './chat/useMessageHandler';
import { AIMessage } from '@/services/chat/messageTypes';

interface UseGeminiChatProps {
  personaData?: any;
  initialMessages?: AIMessage[];
}

export const useGeminiChat = ({ 
  personaData,
  initialMessages = []
}: UseGeminiChatProps = {}) => {
  const {
    messages,
    isLoading,
    error,
    addMessage,
    clearMessages,
    setLoadingState,
    handleError
  } = useChatState(initialMessages);

  const { getSystemPrompt } = usePersonaManager({
    personaData,
    addMessage,
    messages
  });
  
  // Get the API key from localStorage
  const getApiKey = () => {
    try {
      const config = localStorage.getItem('GEMINI_CONFIG');
      if (config) {
        const { apiKey } = JSON.parse(config);
        return apiKey;
      }
    } catch (error) {
      console.error('Error parsing Gemini config:', error);
    }
    return null;
  };

  const { sendMessage } = useMessageHandler({
    messages,
    apiKey: getApiKey(),
    addMessage,
    setLoadingState,
    handleError,
    getSystemPrompt
  });

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    setMessages: addMessage
  };
};

export default useGeminiChat;
