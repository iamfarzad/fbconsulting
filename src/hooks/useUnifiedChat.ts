/**
 * Unified Chat Hook
 * Combines CopilotKit and custom chat functionality with Google GenAI
 */

import { useState, useEffect, useRef } from 'react';
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
  autoInitialize?: boolean;
}

export function useUnifiedChat(options: UseUnifiedChatOptions = {}) {
  const {
    useCopilotKit: useCopilotKitOption = true,
    autoInitialize = true
  } = options;

  // State
  const [showMessages, setShowMessages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestedResponse, setSuggestedResponse] = useState<string | null>(null);
  const [chatService, setChatService] = useState<GoogleGenAIChatService | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Hooks
  const { toast } = useToast();
  const location = useLocation();
  const currentPath = location.pathname;
  const { personaData } = usePersonaManagement();
  const copilotChat = useCopilotChat();
  const { apiKey } = useGeminiAPI();

  // Define default persona
  const defaultPersona: PersonaData = {
    currentPersona: 'general' as PersonaType,
    personaDefinitions: {
      general: {
        name: 'AI Assistant',
        description: 'General assistant providing helpful information',
        tone: 'Friendly, approachable, informative',
        focusAreas: ['General information', 'Basic guidance'],
        samplePhrases: ['I\'d be happy to help you.']
      },
      strategist: {
        name: 'AI Strategy Advisor',
        description: 'Strategic advisor',
        tone: 'Business-oriented',
        focusAreas: ['Business strategy'],
        samplePhrases: ['Let\'s examine the strategy.']
      },
      technical: {
        name: 'Technical AI Expert',
        description: 'Technical expert',
        tone: 'Precise',
        focusAreas: ['Technical implementation'],
        samplePhrases: ['Here\'s the technical approach.']
      },
      consultant: {
        name: 'AI Consultant',
        description: 'Balanced advisor',
        tone: 'Helpful',
        focusAreas: ['Solution design'],
        samplePhrases: ['I recommend this approach.']
      }
    }
  };

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
    if (useCopilotKitOption && !copilotChat.isLoading) {
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
      // Add user message
      addUserMessage(inputValue);
      
      // Create mock lead info from conversation context
      const mockLeadInfo: LeadInfo = {
        interests: messages.filter(m => m.role !== 'system').map(m => m.content),
        stage: 'discovery'
      };
      
      let aiResponse: string = 'I apologize, but I couldn\'t generate a response at this time.';
      
      // If using CopilotKit, let it handle the response
      if (useCopilotKitOption && copilotChat) {
        try {
          // CopilotKit will handle the response automatically
          // We just need to wait for it
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Get the latest assistant message from CopilotKit
          // Access the messages safely with optional chaining
          const copilotMessages = (copilotChat as any)?.messages || [];
          const latestAssistantMessage = copilotMessages
            .filter((m: any) => m.role === 'assistant')
            .pop();
          
          if (latestAssistantMessage?.content) {
            aiResponse = latestAssistantMessage.content;
          }
        } catch (copilotError) {
          console.error('Error with CopilotKit:', copilotError);
          // Fall back to default response
        }
      } else if (chatService) {
        try {
          // Use our custom chat service
          aiResponse = await chatService.sendMessage(inputValue, mockLeadInfo);
        } catch (chatServiceError) {
          console.error('Error with chat service:', chatServiceError);
          // Fall back to default response
        }
      }
      
      // If not using CopilotKit or if we couldn't get a response from it,
      // add the assistant message manually
      if (!useCopilotKitOption) {
        addAssistantMessage(aiResponse);
      }
      
      // Generate a suggested response based on the AI's message
      const suggestedPrompt = generateSuggestedResponse(aiResponse, mockLeadInfo);
      if (suggestedPrompt) {
        setSuggestedResponse(suggestedPrompt);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error sending message',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setInputValue('');
      
      // Show messages container when first message is sent
      if (!showMessages) {
        setShowMessages(true);
      }
    }
  };

  // Clear messages
  const handleClear = async () => {
    if (chatService) {
      await chatService.clearHistory(personaData);
      const history = chatService.getHistory();
      setMessages(history);
    } else {
      setMessages([]);
    }
    
    // If using CopilotKit, clear its messages too
    if (useCopilotKitOption) {
      // CopilotKit doesn't have a clear method, so we'll have to reset the state
      // This is a workaround
    }
    
    setShowMessages(false);
    setSuggestedResponse(null);
    
    toast({
      title: 'Chat cleared',
      description: 'All messages have been removed.',
    });
  };

  // Generate a suggested response based on the AI's message and lead info
  const generateSuggestedResponse = (aiMessage: string, leadInfo: LeadInfo): string | null => {
    // If we don't have enough lead info yet, don't suggest anything
    if (!leadInfo || !leadInfo.stage) {
      return null;
    }
    
    // Check if the AI's message contains a question
    const containsQuestion = aiMessage.includes('?');
    if (!containsQuestion) {
      return null;
    }
    
    // Provide different suggestions based on lead stage
    switch (leadInfo.stage) {
      case 'discovery':
        return 'Tell me more about your AI needs';
      case 'qualification':
        return 'Yes, I\'d like to learn more';
      case 'interested':
        return 'I\'d like to schedule a consultation';
      case 'ready-to-book':
        return 'Next week would work for me';
      default:
        return null;
    }
  };

  return {
    showMessages,
    messages,
    isLoading,
    inputValue,
    setInputValue,
    suggestedResponse,
    containerRef,
    isFullScreen,
    toggleFullScreen,
    handleSend,
    handleClear,
    setIsFullScreen,
    addUserMessage,
    addAssistantMessage,
    chatService,
    connectionStatus,
    connectionError,
    retryConnection: () => {
      setChatService(null);
      setConnectionStatus('idle');
      setConnectionError(null);
    }
  };
}
