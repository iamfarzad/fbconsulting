
// Import the correct types and service
import { useState, useEffect } from 'react';
import { 
  GeminiChatService, 
  getChatService,
  ChatMessage as GenAIChatMessage
} from '@/services/chat/googleGenAIService';
import { AIMessage } from '@/services/chat/messageTypes';

// Local interface for chat messages to prevent naming conflicts
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export function useUnifiedChat(
  placeholderText: string = 'Ask me anything...',
  useCopilotKit: boolean = false
) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize chat service if not using CopilotKit
  useEffect(() => {
    if (!useCopilotKit) {
      // Initialize chat service
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      if (apiKey) {
        const chatService = getChatService({ apiKey });
        console.log('Chat service initialized');
      }
    }
  }, [useCopilotKit]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    try {
      // Add user message to state
      const userMessage: AIMessage = {
        role: 'user',
        content: message,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);
      
      // Mock response for now
      setTimeout(() => {
        const assistantMessage: AIMessage = {
          role: 'assistant',
          content: `This is a response to: ${message}`,
          timestamp: Date.now()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    handleSendMessage,
    placeholderText
  };
}
