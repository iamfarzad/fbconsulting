import React, { createContext, useContext, useState, useEffect } from 'react';
import { getChatService } from '@/services/chat/googleGenAIService';

// Define chat message interface
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Define the context interface
interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
}

// Create the context with default values
const ChatContext = createContext<ChatContextType>({
  messages: [],
  isLoading: false,
  sendMessage: async () => {},
  clearMessages: () => {},
});

// Hook for using the chat context
export const useChatContext = () => useContext(ChatContext);

// Provider component for the chat context
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize chat service
  const chatService = getChatService();
  
  // Function to send a message
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Create a new user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    // Add the user message to the chat
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Convert messages to format expected by chat service
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      // Get response from AI
      const response = await chatService.sendMessage(content, chatHistory);
      
      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      // Add the assistant message to the chat
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to clear all messages
  const clearMessages = () => {
    setMessages([]);
  };
  
  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};
