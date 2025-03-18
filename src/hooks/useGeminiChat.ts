
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
  
  // Get the API key and model from localStorage
  const getConfig = () => {
    try {
      const config = localStorage.getItem('GEMINI_CONFIG');
      if (config) {
        const parsedConfig = JSON.parse(config);
        return {
          apiKey: parsedConfig.apiKey,
          modelName: parsedConfig.modelName || 'gemini-pro'
        };
      }
    } catch (error) {
      console.error('Error parsing Gemini config:', error);
    }
    return {
      apiKey: null,
      modelName: 'gemini-pro'
    };
  };
  
  const { apiKey, modelName } = getConfig();

  const { sendMessage } = useMessageHandler({
    messages,
    apiKey,
    modelName,
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
