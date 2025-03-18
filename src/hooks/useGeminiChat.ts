
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
  
  // Get the API key and model from environment or localStorage
  const getConfig = () => {
    // First check environment variable
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    let apiKey = envApiKey || null;
    let modelName = 'gemini-2.0-flash';
    
    console.log("useGeminiChat - ENV API Key:", envApiKey ? "✅ Found" : "❌ Not found");
    
    try {
      // Then check localStorage (user-provided key takes precedence)
      const config = localStorage.getItem('GEMINI_CONFIG');
      if (config) {
        const parsedConfig = JSON.parse(config);
        // User-provided key takes precedence
        apiKey = parsedConfig.apiKey || apiKey;
        modelName = parsedConfig.modelName || modelName;
        
        console.log("useGeminiChat - Local storage config:", parsedConfig.apiKey ? "✅ Found key" : "❌ No key");
      }
    } catch (error) {
      console.error('Error parsing Gemini config:', error);
    }
    
    if (apiKey) {
      console.log(`useGeminiChat - Using ${apiKey === envApiKey ? 'environment' : 'localStorage'} API key with model: ${modelName}`);
    } else {
      console.log("useGeminiChat - No API key found, messages will fall back to mock responses");
    }
    
    return {
      apiKey,
      modelName
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
