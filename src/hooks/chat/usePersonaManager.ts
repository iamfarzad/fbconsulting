
import { useEffect } from 'react';
import { AIMessage } from '@/services/chat/messageTypes';

interface UsePersonaManagerProps {
  personaData?: any;
  addMessage: (message: AIMessage) => void;
  messages: AIMessage[];
}

export const usePersonaManager = ({ personaData, addMessage, messages }: UsePersonaManagerProps) => {
  useEffect(() => {
    if (personaData && messages.length === 0) {
      try {
        const currentPersona = personaData.personaDefinitions[personaData.currentPersona];
        if (currentPersona) {
          addMessage({
            role: 'assistant',
            content: currentPersona.welcomeMessage || 'Hello! How can I help you today?',
            timestamp: Date.now()
          });
        }
      } catch (error) {
        console.error('Error initializing chat with persona:', error);
      }
    }
  }, [personaData, messages.length, addMessage]);

  const getSystemPrompt = () => {
    if (personaData) {
      try {
        const currentPersona = personaData.personaDefinitions[personaData.currentPersona];
        return currentPersona?.systemInstructions;
      } catch (error) {
        console.error('Error getting persona instructions:', error);
      }
    }
    return undefined;
  };

  return { getSystemPrompt };
};
