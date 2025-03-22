
import { useState, useEffect, useRef, useCallback } from 'react';
import { useCopilotChat } from '@copilotkit/react-core';
import { usePersonaManagement } from '@/mcp/hooks/usePersonaManagement';
import { GoogleGenAIChatService, getChatService, ChatMessage, GoogleGenAIChatServiceConfig } from '@/services/chat/googleGenAIService';
import { LeadInfo } from '@/services/lead/leadExtractor';
import { useToast } from './use-toast';
import { useLocation } from 'react-router-dom';
import useGeminiAPI from '@/hooks/useGeminiAPI';
import { PersonaData, PersonaType } from '@/mcp/protocols/personaManagement/types';
import { formatErrorMessage, logDetailedError, categorizeError } from '@/utils/errorHandling';

interface UseUnifiedChatOptions {
  useCopilotKit?: boolean;
  apiKey?: string;
  modelName?: string;
}

export function useUnifiedChat(options: UseUnifiedChatOptions = {}) {
  const { useCopilotKit = false, apiKey, modelName } = options;
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showMessages, setShowMessages] = useState(true);
  const [suggestedResponse, setSuggestedResponse] = useState<string | null>(null);
  const [chatService, setChatService] = useState<GoogleGenAIChatService | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Voice input integration
  const {
    isListening,
    transcript,
    toggleListening,
    isTranscribing,
    voiceError
  } = useVoiceInput(
    (value) => setInputValue(value),
    () => handleSend()
  );

  // Initialize chat service
  useEffect(() => {
    let isMounted = true;

    const initializeChat = async () => {
      try {
        if (!apiKey) {
          setConnectionStatus('error');
          setConnectionError('API key not found');
          return;
        }

        setConnectionStatus('connecting');
        
        // Trim any whitespace from the API key
        const trimmedApiKey = apiKey.trim();
        
        if (!trimmedApiKey) {
          setConnectionStatus('error');
          setConnectionError('API key is empty');
          toast({
            title: 'Configuration Error',
            description: 'API key is empty. Please check your settings.',
            variant: 'destructive',
          });
          return;
        }

        // Create service configuration
        const serviceConfig: GoogleGenAIChatServiceConfig = {
          apiKey: trimmedApiKey,
          modelName: 'gemini-2.0-flash',
          temperature: 0.9,
          maxOutputTokens: 2048,
          topP: 1.0,
          topK: 1
        };

        // Log service creation attempt (without sensitive data)
        console.log('Creating chat service with config:', {
          modelName: serviceConfig.modelName,
          temperature: serviceConfig.temperature,
          maxOutputTokens: serviceConfig.maxOutputTokens,
          topP: serviceConfig.topP,
          topK: serviceConfig.topK
        });

        // Create service
        const service = await getChatService(serviceConfig);
        if (!service) {
          setConnectionStatus('error');
          setConnectionError('Failed to create chat service instance');
          throw new Error('Failed to create chat service instance');
        }

        // Test connection with retries
        console.log('Testing connection...');
        let connectionTest = false;
        let retryCount = 0;
        const maxRetries = 3;
        let lastError: any = null;
        
        while (!connectionTest && retryCount < maxRetries) {
          try {
            connectionTest = await service.testConnection();
            if (!connectionTest) {
              retryCount++;
              console.log(`Connection test failed, retry ${retryCount}/${maxRetries}`);
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } catch (error) {
            lastError = error;
            retryCount++;
            logDetailedError(error, {
              attempt: retryCount,
              maxRetries,
              model: serviceConfig.modelName
            });
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        if (!connectionTest) {
          setConnectionStatus('error');
          const errorMessage = lastError ? formatErrorMessage(lastError) : 'Connection test failed after multiple attempts';
          setConnectionError(errorMessage);
          throw new Error(errorMessage);
        }

        // Only proceed if component is still mounted
        if (isMounted) {
          setChatService(service);
          setConnectionStatus('connected');
          setConnectionError(null);
        }
      } catch (error) {
        logDetailedError(error, {
          component: 'useUnifiedChat',
          apiKeyPresent: !!apiKey,
          apiKeyLength: apiKey?.length
        });
        
        if (isMounted) {
          setConnectionStatus('error');
          const errorMessage = formatErrorMessage(error);
          setConnectionError(errorMessage);
          
          const errorCategory = categorizeError(error);
          let toastTitle = 'Chat Service Error';
          let toastDescription = errorMessage;
          
          if (errorCategory === 'api') {
            toastTitle = 'API Connection Error';
            toastDescription = 'Failed to connect to the Gemini API. Please check your network connection.';
          } else if (errorCategory === 'auth') {
            toastTitle = 'API Key Error';
            toastDescription = 'Invalid or expired API key. Please check your API key configuration.';
          }
          
          toast({
            title: toastTitle,
            description: toastDescription,
            variant: 'destructive',
          });
        }
      }
    };

    initializeChat();

    return () => {
      isMounted = false;
    };
  }, [apiKey, toast]);

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
    updateMessages();
  }, [personaData, chatService]);

  // Calculate container height based on content
  const calculateContainerHeight = () => {
    if (containerRef.current && typeof window !== 'undefined') {
      const vh = window.innerHeight;
      const maxHeight = Math.min(vh * 0.7, 600);
      containerRef.current.style.maxHeight = `${maxHeight}px`;
    }
  };

  // Update container height on window resize
  useEffect(() => {
    calculateContainerHeight();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', calculateContainerHeight);
      return () => window.removeEventListener('resize', calculateContainerHeight);
    }
  }, []);

  // Show messages container when first message is sent
  useEffect(() => {
    if (messages.length > 1 && !showMessages) { // > 1 to account for system message
      setShowMessages(true);
    }
  }, [messages.length, showMessages]);

  // Extract current page from path
  const getCurrentPage = (): string | undefined => {
    if (currentPath === '/') return 'home';
    return currentPath.substring(1); // Remove leading slash
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };

  // Add a user message
  const addUserMessage = (content: string) => {
    const newMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // If using CopilotKit, also send message there
    if (useCopilotKit && !copilotChat.isLoading) {
      // Use type assertion to match the expected type
      copilotChat.appendMessage({
        type: 'user-message',
        payload: { content }
      } as any);
    }
  };

  // Add an assistant message
  const addAssistantMessage = (content: string) => {
    const newMessage: ChatMessage = {
      role: 'assistant',
      content,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  // Send a message
  const handleSend = async () => {
    if (!inputValue.trim()) {
      toast({
        title: 'Message is empty',
        description: 'Please enter a message before sending.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      setIsLoading(true);
      
      // Create user message
      const userMessage: AIMessage = {
        role: 'user',
        content: inputValue,
        timestamp: Date.now(),
      };
      
      // Add user message to state
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      
      // In a real implementation, this would call the chat service
      // For now, we'll use a mock response
      setTimeout(() => {
        const botMessage: AIMessage = {
          role: 'assistant',
          content: `This is a response to: ${userMessage.content}`,
          timestamp: Date.now(),
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  // Clear all messages
  const handleClear = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    showMessages,
    suggestedResponse,
    containerRef,
    isFullScreen,
    toggleFullScreen,
    handleSend,
    handleClear,
    setIsFullScreen,
    setShowMessages,
    // Voice-related properties
    isListening,
    transcript,
    toggleListening,
    isTranscribing,
    voiceError,
    chatService,
    connectionStatus,
    connectionError,
    retryConnection: () => {
      setChatService(null);
      setConnectionStatus('idle');
      setConnectionError(null);
    },
    addUserMessage,
    addAssistantMessage
  };
}

export default useUnifiedChat;
