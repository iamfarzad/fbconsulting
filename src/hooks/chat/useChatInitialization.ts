
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
    
    console.log("Checking for API key - ENV:", envApiKey ? "✅ Found" : "❌ Not found");
    
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        // User-provided key takes precedence over environment variable
        apiKey = config.apiKey || apiKey;
        
        console.log("Checking for API key - Local Storage:", config.apiKey ? "✅ Found" : "❌ Using env key");
        
        if (apiKey && !multimodalChatRef.current) {
          multimodalChatRef.current = new GeminiMultimodalChat({
            apiKey,
            model: 'gemini-2.0-vision'
          });
          
          console.log("✅ Gemini chat initialized successfully with key source:", config.apiKey ? "localStorage" : "environment");
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
      console.log("ENV variable check:", import.meta.env.VITE_GEMINI_API_KEY ? "exists" : "not found", "Value:", import.meta.env.VITE_GEMINI_API_KEY);
    }
    
    return !!apiKey;
  };

  // Check if API key is available from any source
  const hasApiKey = () => {
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log("ENV API Key check in hasApiKey():", envApiKey ? "✅ Found" : "❌ Not found");
    
    // Check localStorage
    const savedConfig = localStorage.getItem('GEMINI_CONFIG');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        const hasKey = !!(config.apiKey || envApiKey);
        console.log("API Key availability:", hasKey ? "✅ Available" : "❌ Not available");
        return hasKey;
      } catch (error) {
        console.log("Error parsing config, falling back to env key:", !!envApiKey);
        return !!envApiKey;
      }
    }
    console.log("No local config, using env key:", !!envApiKey);
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
    const initialized = initializeMultimodalChat();
    console.log("Initial chat initialization result:", initialized ? "✅ Success" : "❌ Failed");
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
