
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
    // First check for API key in environment variables
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Then check localStorage for user-provided key
    const savedConfig = localStorage.getItem('GEMINI_CONFIG');
    let apiKey = envApiKey || '';
    
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        // User-provided key takes precedence over environment variable
        apiKey = config.apiKey || apiKey;
        
        if (apiKey && !multimodalChatRef.current) {
          multimodalChatRef.current = new GeminiMultimodalChat({
            apiKey,
            model: 'gemini-2.0-vision'
          });
          
          console.log("✅ Gemini chat initialized successfully");
          return true;
        }
      } catch (error) {
        console.error('Error initializing multimodal chat:', error);
        toast({
          title: "Configuration Error",
          description: "Could not initialize AI chat. Please check your settings.",
          variant: "destructive",
        });
      }
    } else if (apiKey) {
      // If we only have the env variable but no saved config
      multimodalChatRef.current = new GeminiMultimodalChat({
        apiKey,
        model: 'gemini-2.0-vision'
      });
      
      console.log("✅ Gemini chat initialized successfully with environment API key");
      return true;
    }
    
    if (!apiKey) {
      console.log("⚠️ No Gemini API key found in env or localStorage, using mock responses");
    }
    
    return !!apiKey;
  };

  // Check if API key is available from any source
  const hasApiKey = () => {
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Check localStorage
    const savedConfig = localStorage.getItem('GEMINI_CONFIG');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        return !!(config.apiKey || envApiKey);
      } catch (error) {
        return !!envApiKey;
      }
    }
    return !!envApiKey;
  };

  // Get the current API key from any source
  const getApiKey = (): string => {
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Check localStorage first as user-provided keys take precedence
    const savedConfig = localStorage.getItem('GEMINI_CONFIG');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        return config.apiKey || envApiKey || '';
      } catch (error) {
        return envApiKey || '';
      }
    }
    return envApiKey || '';
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
