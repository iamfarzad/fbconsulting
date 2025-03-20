
import { useState, useCallback, useRef, useEffect } from 'react';
import { AIMessage } from '@/services/chat/messageTypes';
import { ChatFactory, ChatServiceType } from '@/services/chat/ChatFactory';
import { useSpeechRecognition } from './useSpeechRecognition';

interface UseEnhancedChatOptions {
  apiKey?: string;
  serviceType?: ChatServiceType;
  initialMessages?: AIMessage[];
  persistMessages?: boolean;
  storageKey?: string;
}

export function useEnhancedChat({
  apiKey,
  serviceType = ChatServiceType.MOCK,
  initialMessages = [],
  persistMessages = false,
  storageKey = 'enhanced-chat-messages'
}: UseEnhancedChatOptions = {}) {
  // Load initial messages from localStorage if enabled
  const loadInitialMessages = (): AIMessage[] => {
    if (!persistMessages) return initialMessages;
    
    try {
      const storedMessages = localStorage.getItem(storageKey);
      return storedMessages ? JSON.parse(storedMessages) : initialMessages;
    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
      return initialMessages;
    }
  };
  
  // State
  const [messages, setMessages] = useState<AIMessage[]>(loadInitialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Create chat service instance
  const chatServiceRef = useRef(
    apiKey 
      ? ChatFactory.createChatService(serviceType, { apiKey }) 
      : ChatFactory.createChatService(ChatServiceType.MOCK, { apiKey: 'mock-key' })
  );
  
  // Initialize voice recognition
  const { 
    isListening, 
    transcript, 
    toggleListening, 
    voiceError,
    isVoiceSupported
  } = useSpeechRecognition();
  
  // Save messages to localStorage when they change
  useEffect(() => {
    if (persistMessages) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, persistMessages, storageKey]);
  
  // Add a new message to the chat
  const addMessage = useCallback((role: AIMessage['role'], content: string, mediaItems?: AIMessage['mediaItems']) => {
    const newMessage: AIMessage = {
      role,
      content,
      timestamp: Date.now(),
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      mediaItems
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);
  
  // Send a message to the chat service
  const sendMessage = useCallback(async (content: string, images?: any[]) => {
    if (!content.trim() && (!images || images.length === 0)) return;
    
    // Reset any previous errors
    setError(null);
    
    // Add user message
    const mediaItems = images?.map(img => ({
      type: 'image' as const,
      data: img.data,
      url: img.preview,
      mimeType: img.mimeType,
      fileName: img.name,
      name: img.name
    }));
    
    addMessage('user', content, mediaItems);
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Send message to chat service
      let response;
      
      if (images && images.length > 0 && 'sendMultiModalMessage' in chatServiceRef.current) {
        const multimodalService = chatServiceRef.current as any;
        const imageData = images.map(img => ({
          data: img.data,
          mimeType: img.mimeType
        }));
        
        response = await multimodalService.sendMultiModalMessage(content, imageData);
      } else {
        response = await chatServiceRef.current.sendMessage(content);
      }
      
      // Add assistant response
      addMessage('assistant', response.text);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'An error occurred while sending your message.');
      addMessage('error', `Error: ${err.message || 'An unknown error occurred.'}`);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);
  
  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    chatServiceRef.current.clearHistory();
    
    if (persistMessages) {
      localStorage.removeItem(storageKey);
    }
  }, [persistMessages, storageKey]);
  
  // Handle voice input
  useEffect(() => {
    if (transcript && !isLoading) {
      sendMessage(transcript);
      // Stop listening after sending the message
      if (isListening) {
        toggleListening();
      }
    }
  }, [transcript, isLoading, sendMessage, isListening, toggleListening]);
  
  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    isListening,
    toggleListening,
    voiceError,
    isVoiceSupported
  };
}
