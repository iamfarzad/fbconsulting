
import { useState, useEffect, useCallback } from 'react';
import { useGeminiAPI } from '@/App';
import { sendGeminiChatRequest, convertToGeminiMessages } from '@/services/gemini/geminiService';

interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
}

interface UseGeminiChatProps {
  personaData?: any;
}

export const useGeminiChat = ({ personaData }: UseGeminiChatProps = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useGeminiAPI();
  
  // Initialize with a welcome message
  useEffect(() => {
    if (personaData && messages.length === 0) {
      const currentPersona = personaData.personaDefinitions[personaData.currentPersona];
      if (currentPersona) {
        setMessages([
          {
            role: 'assistant',
            content: currentPersona.welcomeMessage || 'Hello! How can I help you today?'
          }
        ]);
      }
    }
  }, [personaData, messages.length]);
  
  const appendMessage = useCallback(async (message: Message) => {
    // Add user message to the chat
    setMessages(prev => [...prev, message]);
    
    // If it's a user message, get a response
    if (message.role === 'user' && apiKey) {
      setIsLoading(true);
      
      try {
        // Use persona instructions if available
        let systemPrompt;
        if (personaData) {
          const currentPersona = personaData.personaDefinitions[personaData.currentPersona];
          systemPrompt = currentPersona?.systemInstructions;
        }
        
        // Convert messages to Gemini format
        const geminiMessages = convertToGeminiMessages(
          messages.concat(message),
          systemPrompt
        );
        
        // Get response from Gemini API
        const responseText = await sendGeminiChatRequest(geminiMessages, apiKey);
        
        // Add assistant response to the chat
        setMessages(prev => [
          ...prev, 
          { role: 'assistant', content: responseText }
        ]);
      } catch (error) {
        console.error('Error getting chat response:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to get a response. Please try again.';
        
        // Add error message to the chat
        setMessages(prev => [
          ...prev, 
          { role: 'error', content: errorMessage }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [messages, apiKey, personaData]);
  
  return {
    messages,
    isLoading,
    appendMessage
  };
};

export default useGeminiChat;
