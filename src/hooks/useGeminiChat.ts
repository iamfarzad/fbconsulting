
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

  const { sendMessage } = useMessageHandler({
    messages,
    apiKey: window.localStorage.getItem('GEMINI_API_KEY'),
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
