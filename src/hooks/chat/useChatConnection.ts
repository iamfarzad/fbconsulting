import { useState, useEffect } from 'react';
import { GoogleGenAIChatService, GoogleGenAIChatServiceConfig } from '@/services/chat/googleGenAIService';
import { logDetailedError } from '@/utils/errorHandling';
import { PersonaData } from '@/mcp/protocols/personaManagement/types';

export interface UseChatConnectionOptions {
  apiKey?: string;
  modelName?: string;
  onError?: (error: Error) => void;
}

export function useChatConnection({ 
  apiKey, 
  modelName = 'gemini-2.0-flash',
  onError
}: UseChatConnectionOptions) {
  const [chatService, setChatService] = useState<GoogleGenAIChatService | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const initializeWithPersona = async (personaData: PersonaData) => {
    if (chatService) {
      await chatService.initializeChat(personaData);
    }
  };

  const retryConnection = () => {
    setChatService(null);
    setConnectionStatus('idle');
    setConnectionError(null);
  };

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
        
        const serviceConfig: GoogleGenAIChatServiceConfig = {
          apiKey: apiKey.trim(),
          modelName: modelName,
          temperature: 0.9,
          maxOutputTokens: 2048,
          topP: 1.0,
          topK: 1
        };

        const service = new GoogleGenAIChatService(serviceConfig);
        const isConnected = await service.testConnection();

        if (!isConnected) {
          throw new Error('Failed to connect to chat service');
        }

        if (isMounted) {
          setChatService(service);
          setConnectionStatus('connected');
          setConnectionError(null);
        }
      } catch (error) {
        logDetailedError(error, {
          component: 'useChatConnection',
          apiKeyPresent: !!apiKey
        });

        if (isMounted) {
          setConnectionStatus('error');
          setConnectionError(error instanceof Error ? error.message : 'Unknown error');
          if (onError && error instanceof Error) {
            onError(error);
          }
        }
      }
    };

    initializeChat();

    return () => {
      isMounted = false;
    };
  }, [apiKey, modelName, onError]);

  return {
    chatService,
    connectionStatus,
    connectionError,
    retryConnection,
    initializeWithPersona
  };
}
