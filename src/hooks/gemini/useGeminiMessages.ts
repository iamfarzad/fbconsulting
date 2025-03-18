
import { useState, useRef, useEffect } from 'react';
import { AIMessage } from '@/services/chat/messageTypes';

/**
 * Hook to manage Gemini chat message state
 */
export function useGeminiMessages(personaData: any) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Handle messages container scrolling
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Add welcome message based on persona
  useEffect(() => {
    if (personaData && messages.length === 0) {
      const persona = personaData.personaDefinitions[personaData.currentPersona];
      if (persona?.welcomeMessage) {
        setMessages([
          {
            role: 'assistant',
            content: persona.welcomeMessage,
            timestamp: Date.now()
          }
        ]);
      }
    }
  }, [personaData, messages.length]);

  const addMessage = (role: 'user' | 'assistant' | 'error', content: string) => {
    const newMessage: AIMessage = {
      role,
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    setIsLoading,
    addMessage,
    clearMessages,
    messagesEndRef
  };
}
