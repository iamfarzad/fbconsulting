import { useState, useCallback } from 'react';
import { useGemini } from '@/components/copilot/providers/GeminiProvider';
import { GeminiMultimodalChat } from '@/services/gemini';
import { AIMessage } from '@/services/chat/messageTypes';

interface UseGeminiMessageSubmissionProps {
  addMessage: (role: 'user' | 'assistant' | 'error', content: string) => void;
  setIsLoading: (loading: boolean) => void;
  clearImages: () => void;
  multimodalChatRef: React.MutableRefObject<GeminiMultimodalChat | null>;
}

/**
 * Hook to handle sending and processing Gemini chat messages
 */
export function useGeminiMessageSubmission({
  addMessage,
  setIsLoading,
  clearImages,
  multimodalChatRef
}: UseGeminiMessageSubmissionProps) {
  const [error, setError] = useState<string | null>(null);
  const { personaData, model } = useGemini();

  const handleSendMessage = useCallback(async (
    inputValue: string,
    images: { mimeType: string; data: string; preview: string }[],
    isListening: boolean,
    stopListening: () => void
  ) => {
    // Don't send empty messages
    if ((!inputValue.trim() && images.length === 0) || !model) return;
    
    // Stop listening if active
    if (isListening) {
      stopListening();
    }
    
    // Add user message to chat
    addMessage('user', inputValue);
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get system instructions from persona if available
      const systemInstructions = personaData?.personaDefinitions?.[personaData?.currentPersona]?.systemInstructions;
      
      let response = '';
      
      // Handle multimodal request if images are present
      if (images.length > 0) {
        if (multimodalChatRef.current) {
          // Use the multimodal chat for ongoing conversation
          const imageData = images.map(img => ({
            mimeType: img.mimeType,
            data: img.data
          }));
          
          response = await multimodalChatRef.current.sendMessage(inputValue, imageData);
        } else {
          // Fallback to one-off request
          const config = localStorage.getItem('GEMINI_CONFIG');
          if (config) {
            const { apiKey } = JSON.parse(config);
            
            if (!apiKey) {
              throw new Error('API key not found');
            }
            
            // Create a new multimodal chat instance
            multimodalChatRef.current = new GeminiMultimodalChat({
              apiKey,
              model: 'gemini-2.0-flash'
            });
            
            // Send the message
            const imageData = images.map(img => ({
              mimeType: img.mimeType,
              data: img.data
            }));
            
            response = await multimodalChatRef.current.sendMessage(inputValue, imageData);
          } else {
            throw new Error('Gemini configuration not found');
          }
        }
      } else if (model) {
        // For text-only conversation
        // Start a chat with the current model
        const chat = model.startChat({
          history: [], // This is a simplification - in the full implementation, we would pass the message history
          systemInstruction: systemInstructions
        });
        
        // Send the message and handle response
        const result = await chat.sendMessage(inputValue);
        const text = result.response.text();
        
        // Check if response is valid
        if (typeof text !== 'string' || !text.trim()) {
          throw new Error('Invalid response from model');
        }
        
        response = text;
      } else {
        throw new Error('Model not initialized');
      }
      
      // Add assistant response
      addMessage('assistant', response);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      
      // Add error message
      addMessage('error', `Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
      setIsLoading(false);
      clearImages();
    }
  }, [addMessage, setIsLoading, clearImages, model, personaData, multimodalChatRef]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // This is intentionally left empty as the actual send logic will be called by the component
    }
  }, []);

  return {
    error,
    handleSendMessage,
    handleKeyDown
  };
}
