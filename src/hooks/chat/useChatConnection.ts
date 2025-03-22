
import { useState, useEffect, useCallback } from 'react';
import { GoogleGenAIChatService, getChatService, GoogleGenAIChatServiceConfig } from '@/services/chat/googleGenAIService';
import { useToast } from '@/hooks/use-toast';
import { formatErrorMessage, logDetailedError, categorizeError } from '@/utils/errorHandling';
import { PersonaData } from '@/mcp/protocols/personaManagement/types';

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error';

interface UseChatConnectionOptions {
  apiKey?: string;
  modelName?: string;
  autoConnect?: boolean;
}

export function useChatConnection(options: UseChatConnectionOptions = {}) {
  const { apiKey, modelName, autoConnect = true } = options;
  const [chatService, setChatService] = useState<GoogleGenAIChatService | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();

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
          modelName: modelName || 'gemini-2.0-flash',
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
          component: 'useChatConnection',
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

    if (autoConnect) {
      initializeChat();
    }

    return () => {
      isMounted = false;
    };
  }, [apiKey, modelName, toast, autoConnect]);

  // Initialize chat with persona data
  const initializeWithPersona = useCallback(async (personaData: PersonaData) => {
    try {
      if (chatService) {
        await chatService.initializeChat(personaData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error initializing chat with persona:', error);
      return false;
    }
  }, [chatService]);

  // Retry connection
  const retryConnection = useCallback(() => {
    setChatService(null);
    setConnectionStatus('idle');
    setConnectionError(null);
  }, []);

  return {
    chatService,
    connectionStatus,
    connectionError,
    retryConnection,
    initializeWithPersona
  };
}
