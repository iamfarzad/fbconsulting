
import { useRef, useEffect } from 'react';
import { GeminiMultimodalChat } from '@/services/gemini';

/**
 * Hook to initialize multimodal chat
 * @returns The initialized multimodal chat reference and API key status
 */
export function useChatInitialization() {
  const multimodalChatRef = useRef<GeminiMultimodalChat | null>(null);
  
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
      }
    }
    
    return !!apiKey;
  };

  // Initialize when the hook is first used
  useEffect(() => {
    initializeMultimodalChat();
  }, []);

  return {
    multimodalChatRef,
    initializeMultimodalChat
  };
}
