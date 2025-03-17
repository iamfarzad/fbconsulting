
import { useState, useCallback, useRef } from 'react';
import { useGeminiAPI } from '@/App';
import { PersonaData } from '@/mcp/protocols/personaManagement';
import { convertToGeminiMessages, sendGeminiChatRequest, GeminiMessage } from '@/services/gemini/geminiService';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
}

export interface UseGeminiChatOptions {
  personaData: PersonaData;
  initialMessages?: AIMessage[];
}

export function useGeminiChat({ personaData, initialMessages = [] }: UseGeminiChatOptions) {
  const { apiKey } = useGeminiAPI();
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Generate system prompt based on persona data
  const getSystemPrompt = useCallback(() => {
    const currentPersona = personaData.currentPersona;
    const personaDetails = personaData.personaDefinitions[currentPersona];
    
    return `
      You are Farzad AI Assistant, an AI consultant built into the landing page of F.B Consulting. 
      Currently using the "${personaDetails.name}" persona.
      
      Tone: ${personaDetails.tone}
      
      Focus Areas:
      ${personaDetails.focusAreas.map(area => `- ${area}`).join('\n')}
      
      Additional Context:
      - User Role: ${personaData.userRole || 'Unknown'}
      - User Industry: ${personaData.userIndustry || 'Unknown'}
      - User Technical Level: ${personaData.userTechnicalLevel || 'beginner'}
      - Current Page: ${personaData.currentPage || '/'}
      
      Remember to adjust your responses based on the user's technical level and industry context.
    `;
  }, [personaData]);

  // Append a message to the chat
  const appendMessage = useCallback((message: { content: string; role: 'user' | 'assistant' | 'system' | 'error' }) => {
    const newMessage: AIMessage = {
      ...message,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // If it's a user message, generate a response
    if (message.role === 'user') {
      generateResponse([...messages, newMessage]);
    }
    
    return newMessage;
  }, [messages]);
  
  // Generate a response from Gemini API
  const generateResponse = useCallback(async (currentMessages: AIMessage[]) => {
    if (!apiKey) {
      appendMessage({
        role: 'error',
        content: 'Gemini API key is not available. Please check your configuration.'
      });
      return;
    }
    
    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    
    try {
      // Convert messages to Gemini format
      const geminiMessages = convertToGeminiMessages(currentMessages, getSystemPrompt());
      
      // Send request to Gemini API
      const response = await sendGeminiChatRequest(geminiMessages, apiKey);
      
      // Add the response to messages
      appendMessage({
        role: 'assistant',
        content: response
      });
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        appendMessage({
          role: 'error',
          content: `Error: ${error.message}`
        });
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [apiKey, appendMessage, getSystemPrompt]);
  
  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  return {
    messages,
    isLoading,
    appendMessage,
    clearMessages
  };
}
