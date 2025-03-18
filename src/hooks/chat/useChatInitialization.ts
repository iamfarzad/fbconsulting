
import { useRef, useEffect } from 'react';
import { GeminiMultimodalChat } from '@/services/gemini';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to initialize and manage multimodal chat
 * @returns The initialized multimodal chat reference and initialization methods
 */
export function useChatInitialization() {
  const multimodalChatRef = useRef<GeminiMultimodalChat | null>(null);
  const { toast } = useToast();
  
  // Initialize the multimodal chat if an API key exists
  const initializeMultimodalChat = () => {
    const savedConfig = localStorage.getItem('GEMINI_CONFIG');
    let apiKey = '';
    
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        apiKey = config.apiKey;
        
        if (apiKey && !multimodalChatRef.current) {
          multimodalChatRef.current = new GeminiMultimodalChat({
            apiKey,
            model: 'gemini-2.0-vision'
          });
        }
      } catch (error) {
        console.error('Error initializing multimodal chat:', error);
        toast({
          title: "Configuration Error",
          description: "Could not initialize AI chat. Please check your settings.",
          variant: "destructive",
        });
      }
    }
    
    return !!apiKey;
  };

  // Check if API key is available
  const hasApiKey = () => {
    const savedConfig = localStorage.getItem('GEMINI_CONFIG');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        return !!config.apiKey;
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  // Get the current API key
  const getApiKey = (): string => {
    const savedConfig = localStorage.getItem('GEMINI_CONFIG');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        return config.apiKey || '';
      } catch (error) {
        return '';
      }
    }
    return '';
  };

  // Initialize when the hook is first used
  useEffect(() => {
    initializeMultimodalChat();
  }, []);

  // Clear chat history and reset the chat instance
  const resetChat = () => {
    if (multimodalChatRef.current) {
      multimodalChatRef.current.clearHistory();
    }
  };

  return {
    multimodalChatRef,
    initializeMultimodalChat,
    hasApiKey,
    getApiKey,
    resetChat
  };
}
