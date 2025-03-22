
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/services/chat/googleGenAIService';
import { useToast } from '@/hooks/use-toast';
import { PersonaData } from '@/mcp/protocols/personaManagement/types';

interface UseChatMessagesOptions {
  chatService: any;
  personaData?: PersonaData;
}

export function useChatMessages({ chatService, personaData }: UseChatMessagesOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedResponse, setSuggestedResponse] = useState<string | null>(null);
  const { toast } = useToast();

  // Update messages when persona changes
  useEffect(() => {
    const updateMessages = async () => {
      try {
        if (chatService && personaData) {
          await chatService.initializeChat(personaData);
          const history = chatService.getHistory();
          setMessages(history);
        }
      } catch (error) {
        console.error('Error updating messages with persona change:', error);
        // Don't update messages if there's an error
      }
    };
    
    if (chatService) {
      updateMessages();
    }
  }, [personaData, chatService]);

  // Add a user message
  const addUserMessage = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  // Add an assistant message
  const addAssistantMessage = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      role: 'assistant',
      content,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) {
      toast({
        title: 'Message is empty',
        description: 'Please enter a message before sending.',
        variant: 'destructive',
      });
      return null;
    }
    
    if (!chatService) {
      toast({
        title: 'Service not ready',
        description: 'Chat service is not initialized.',
        variant: 'destructive',
      });
      return null;
    }
    
    try {
      setIsLoading(true);
      
      // Create user message
      const userMessage = addUserMessage(content);
      
      // In a real implementation, this would call the chat service
      const response = await chatService.sendMessage(content);
      const botMessage = addAssistantMessage(response);
      
      return botMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [chatService, addUserMessage, addAssistantMessage, toast]);

  // Clear all messages
  const clearMessages = useCallback(() => {
    if (chatService) {
      chatService.clearHistory();
    }
    setMessages([]);
  }, [chatService]);

  return {
    messages,
    isLoading,
    suggestedResponse,
    sendMessage,
    addUserMessage,
    addAssistantMessage,
    clearMessages
  };
}
