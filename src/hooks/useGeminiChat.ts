import { useState, useEffect, useCallback } from 'react';
import { useGeminiAPI } from '@/App';
import { AIMessage } from '@/services/chat/messageTypes';
import { sendGeminiChatRequest, convertToGeminiMessages } from '@/services/gemini/geminiService';
import { toast } from 'sonner';

interface UseGeminiChatProps {
  personaData?: any;
  initialMessages?: AIMessage[];
}

export const useGeminiChat = ({ 
  personaData,
  initialMessages = []
}: UseGeminiChatProps = {}) => {
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiKey } = useGeminiAPI();
  
  // Initialize with a welcome message
  useEffect(() => {
    if (personaData && messages.length === 0) {
      try {
        const currentPersona = personaData.personaDefinitions[personaData.currentPersona];
        if (currentPersona) {
          setMessages([
            {
              role: 'assistant',
              content: currentPersona.welcomeMessage || 'Hello! How can I help you today?',
              timestamp: Date.now()
            }
          ]);
        }
      } catch (error) {
        console.error('Error initializing chat with persona:', error);
      }
    }
  }, [personaData, messages.length]);
  
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    if (!apiKey) {
      setError('API key is not available. Please configure your Gemini API key.');
      toast.error('API key is missing', {
        description: 'Please add your Gemini API key in the settings.'
      });
      return;
    }
    
    // Add user message to the chat
    const userMessage: AIMessage = {
      role: 'user',
      content,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      // Use persona instructions if available
      let systemPrompt;
      if (personaData) {
        try {
          const currentPersona = personaData.personaDefinitions[personaData.currentPersona];
          systemPrompt = currentPersona?.systemInstructions;
        } catch (error) {
          console.error('Error getting persona instructions:', error);
        }
      }
      
      // Convert messages to Gemini format
      const geminiMessages = convertToGeminiMessages(
        messages.concat(userMessage),
        systemPrompt
      );
      
      // Get response from Gemini API
      const responseText = await sendGeminiChatRequest(geminiMessages, apiKey);
      
      // Add assistant response to the chat
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get a response. Please try again.';
      
      // Add error message to the chat
      const errorMsg: AIMessage = {
        role: 'error',
        content: errorMessage,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMsg]);
      setError(errorMessage);
      toast.error('Chat error', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, apiKey, personaData]);
  
  const clearMessages = useCallback(() => {
    // Keep the welcome message if available
    const welcomeMessage = messages.find(m => m.role === 'assistant' && m.content.includes('Hello'));
    setMessages(welcomeMessage ? [welcomeMessage] : []);
  }, [messages]);
  
  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    setMessages
  };
};

export default useGeminiChat;
