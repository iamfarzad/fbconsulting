<<<<<<< HEAD
import React, {
  useState,
  useEffect,
  useMemo,
  createContext,
  useContext,
} from 'react';
import { useLocation } from 'react-router-dom';
import { CopilotKit } from '@copilotkit/react-core';
=======
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { CopilotKit } from '@copilotkit/react-core';

// Internal imports
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
import { usePersonaManagement } from '@/mcp/hooks/usePersonaManagement';
import { toast } from '@/components/ui/use-toast';
import { useGeminiAPI } from '@/hooks/useGeminiAPI';
import { ConnectionStatusIndicator } from '../ui/ConnectionStatusIndicator';
<<<<<<< HEAD
import {
  formatErrorMessage,
  logDetailedError,
  categorizeError,
} from '@/utils/errorHandling';
import type {
  SpatialContext,
  VoiceConfig,
  Message,
  CopilotConfig as CopilotConfigType,
} from '../types';
import {
  useContextTracking,
} from './hooks';

=======
import { formatErrorMessage, logDetailedError, categorizeError } from '@/utils/errorHandling';
import type { 
  SpatialContext, 
  VoiceConfig, 
  Message,
  CopilotConfig as CopilotConfigType
} from '../types';

// Basic Copilot Context for toggle functionality
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
interface CopilotContextType {
  enabled: boolean;
  toggleCopilot: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

<<<<<<< HEAD
const CopilotContext = createContext<CopilotContextType | undefined>(
  undefined
);
=======
const CopilotContext = createContext<CopilotContextType | undefined>(undefined);
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248

export const useCopilot = () => {
  const context = useContext(CopilotContext);
  if (context === undefined) {
    throw new Error('useCopilot must be used within a CopilotProvider');
  }
  return context;
};

interface CopilotProviderProps {
  children: React.ReactNode;
<<<<<<< HEAD
  apiKey?: string;
  modelName?: string;
  voice?: VoiceConfig;
  agentic?: AgenticConfig;
}

export const CopilotProvider: React.FC<CopilotProviderProps> = ({
  children,
  apiKey: propApiKey,
  modelName: propModelName,
  voice: propVoice,
  agentic: propAgentic,
}) => {
  const [enabled, setEnabled] = useState(false);
  const toggleCopilot = () => setEnabled((prev) => !prev);

  const { personaData, setCurrentPage } = usePersonaManagement();
  const location = useLocation();
  const { apiKey, isLoading } = useGeminiAPI();

  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [spatialContext, setSpatialContext] = useState<SpatialContext | null>(
    null
  );
  const [connectionStatus, setConnectionStatus] = useState<
    'idle' | 'connecting' | 'connected' | 'error'
  >('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const publicApiKey = useMemo(() => apiKey || '', [apiKey]);
=======
}

export const CopilotProvider: React.FC<CopilotProviderProps> = ({ children }) => {
  // Basic toggle state
  const [enabled, setEnabled] = useState(false);
  const toggleCopilot = () => setEnabled(prev => !prev);

  // Hooks for external data
  const { personaData } = usePersonaManagement();
  const location = useLocation();
  const { apiKey, isLoading } = useGeminiAPI();

  // State hooks
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [spatialContext, setSpatialContext] = useState<SpatialContext | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Memoized values
  const publicApiKey = useMemo(() => {
    return apiKey || '';
  }, [apiKey]);
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248

  const systemMessage = useMemo(() => {
    if (!personaData?.personaDefinitions || !personaData.currentPersona) {
      return '';
    }

<<<<<<< HEAD
    const personaDetails =
      personaData.personaDefinitions[personaData.currentPersona];
=======
    const personaDetails = personaData.personaDefinitions[personaData.currentPersona];
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
    if (!personaDetails) return '';

    return `
      You are Farzad AI Assistant, an AI consultant built into the landing page of F.B Consulting. 
      Currently using the "${personaDetails.name}" persona.
      
      Tone: ${personaDetails.tone}
      
      Focus Areas:
<<<<<<< HEAD
      ${personaDetails.focusAreas.map((area) => `- ${area}`).join('\n')}
=======
      ${personaDetails.focusAreas.map(area => `- ${area}`).join('\n')}
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
      
      Additional Context:
      - User Role: ${personaData.userRole || 'Unknown'}
      - User Industry: ${personaData.userIndustry || 'Unknown'}
      - User Technical Level: ${personaData.userTechnicalLevel || 'beginner'}
      - Current Page: ${personaData.currentPage || '/'}
      
      Remember to adjust your responses based on the user's technical level and industry context.
    `;
  }, [personaData]);

<<<<<<< HEAD
  useContextTracking(setCurrentPage, setSpatialContext);

  useEffect(() => {
    const initVoice = async () => {
      if ('speechSynthesis' in window) {
        try {
          let voices = window.speechSynthesis.getVoices();

          if (voices.length === 0) {
            await new Promise<void>((resolve) => {
              const voicesChangedHandler = () => {
                voices = window.speechSynthesis.getVoices();
                window.speechSynthesis.removeEventListener(
                  'voiceschanged',
                  voicesChangedHandler
                );
                resolve();
              };
              window.speechSynthesis.addEventListener(
                'voiceschanged',
                voicesChangedHandler
              );
              setTimeout(resolve, 1000);
            });
          }

          setVoiceEnabled(voices.length > 0);
        } catch (error) {
          console.error('Error initializing voice synthesis:', error);
          setVoiceEnabled(false);
        }
      } else {
        console.warn('Speech synthesis not supported');
        setVoiceEnabled(false);
      }
    };

    initVoice();
  }, []);

  useEffect(() => {
    if (!spatialContext) {
      const currentPath = location.pathname;
      const pageName = currentPath === '/' ? 'home' : currentPath.substring(1);

      setSpatialContext({
        pageSection: pageName,
        elementType: 'page',
        interactionType: 'navigation',
        userBehavior: 'active',
        timestamp: Date.now(),
      });
    }
  }, [location, spatialContext]);

  const copilotConfig = useMemo<CopilotConfigType>(() => {
    if (!apiKey) return null;

    return {
      apiKey: publicApiKey,
      options: {
        model: propModelName || 'gemini-2.0-flash-001',
=======
  const copilotConfig = useMemo<CopilotConfigType>(
    () => ({
      apiKey: publicApiKey,
      options: {
        model: 'gemini-2.0-flash-001',
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
        temperature: 0.7,
        maxTokens: 2048,
        initialMessages: [
          {
            role: 'system',
            content: systemMessage,
<<<<<<< HEAD
            timestamp: Date.now(),
          } as Message,
        ],
        voice: voiceEnabled
          ? {
              enabled: true,
              voice: 'Charon',
              pitch: 1,
              rate: 1,
            }
          : undefined,
        spatialContext,
=======
            timestamp: Date.now()
          } as Message
        ],
        voice: voiceEnabled ? {
          enabled: true,
          voice: 'Charon',
          pitch: 1,
          rate: 1
        } : undefined,
        spatialContext: spatialContext,
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
        agentic: {
          proactiveAssistance: true,
          learningEnabled: true,
          contextAwareness: true,
<<<<<<< HEAD
          behaviorPatterns: [
            'page_navigation',
            'content_interaction',
            'form_interaction',
          ],
        },
      },
    };
  }, [systemMessage, voiceEnabled, spatialContext, publicApiKey]);

  useEffect(() => {
    if (!enabled) return;
=======
          behaviorPatterns: ['page_navigation', 'content_interaction', 'form_interaction']
        }
      }
    }),
    [systemMessage, voiceEnabled, spatialContext, publicApiKey]
  );

  // Initialize and validate API key
  useEffect(() => {
    if (!enabled) return; // Don't connect if copilot is disabled
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248

    if (isLoading) {
      setConnectionStatus('connecting');
      return;
    }
<<<<<<< HEAD

=======
    
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
    if (!apiKey) {
      setConnectionStatus('error');
      setConnectionError('API key not found');
      toast({
        title: 'AI Configuration Error',
        description: 'API key not found. Please check your configuration.',
<<<<<<< HEAD
        variant: 'destructive',
=======
        variant: 'destructive'
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
      });
    } else {
      const testConnection = async () => {
        try {
          setConnectionStatus('connecting');
<<<<<<< HEAD

          const response = await fetch(
            'https://generativelanguage.googleapis.com/v1/models?key=' + apiKey
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              `API connection failed: ${response.status} ${response.statusText}${
                errorData.error
                  ? ` - ${errorData.error.message || ''}`
                  : ''
              }`
            );
          }

=======
          
          const response = await fetch('https://generativelanguage.googleapis.com/v1/models?key=' + apiKey);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API connection failed: ${response.status} ${response.statusText}${
              errorData.error ? ` - ${errorData.error.message || ''}` : ''
            }`);
          }
          
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
          setConnectionStatus('connected');
          setConnectionError(null);
        } catch (error) {
          logDetailedError(error, {
            component: 'CopilotProvider',
            apiKeyLength: apiKey?.length,
<<<<<<< HEAD
            apiKeyPresent: !!apiKey,
          });

          setConnectionStatus('error');
          const errorMessage = formatErrorMessage(error);
          setConnectionError(errorMessage);

          const errorCategory = categorizeError(error);
          let toastTitle = 'API Connection Error';
          let toastDescription =
            'Failed to connect to the Gemini API. Please check your network connection.';

          if (errorCategory === 'auth') {
            toastTitle = 'API Key Error';
            toastDescription =
              'Invalid or expired API key. Please check your API key configuration.';
          }

          toast({
            title: toastTitle,
            description: toastDescription,
            variant: 'destructive',
          });
        }
      };

=======
            apiKeyPresent: !!apiKey
          });
          
          setConnectionStatus('error');
          const errorMessage = formatErrorMessage(error);
          setConnectionError(errorMessage);
          
          const errorCategory = categorizeError(error);
          let toastTitle = 'API Connection Error';
          let toastDescription = 'Failed to connect to the Gemini API. Please check your network connection.';
          
          if (errorCategory === 'auth') {
            toastTitle = 'API Key Error';
            toastDescription = 'Invalid or expired API key. Please check your API key configuration.';
          }
          
          toast({
            title: toastTitle,
            description: toastDescription,
            variant: 'destructive'
          });
        }
      };
      
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
      testConnection();
    }
  }, [apiKey, isLoading, enabled]);

<<<<<<< HEAD
  const showConnectionStatus =
    connectionStatus === 'error' || connectionStatus === 'connecting';

=======
  // Voice synthesis initialization
  useEffect(() => {
    if (!enabled) return; // Don't initialize voice if copilot is disabled

    const initVoice = async () => {
      if ('speechSynthesis' in window) {
        try {
          let voices = window.speechSynthesis.getVoices();
          
          if (voices.length === 0) {
            await new Promise<void>(resolve => {
              const voicesChangedHandler = () => {
                voices = window.speechSynthesis.getVoices();
                window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
                resolve();
              };
              window.speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
              setTimeout(resolve, 1000);
            });
          }
          
          const charonVoice = voices.find(voice => voice.name.includes('Charon'));
          setVoiceEnabled(voices.length > 0);
        } catch (error) {
          console.error('Error initializing voice synthesis:', error);
          setVoiceEnabled(false);
        }
      } else {
        console.warn('Speech synthesis not supported in this browser');
        setVoiceEnabled(false);
      }
    };

    initVoice();
  }, [enabled]);

  // Spatial context tracking
  useEffect(() => {
    if (!enabled) return; // Don't track context if copilot is disabled

    if (!spatialContext) {
      const currentPath = location.pathname;
      const pageName = currentPath === '/' ? 'home' : currentPath.substring(1);
      
      setSpatialContext({
        pageSection: pageName,
        elementType: 'page',
        interactionType: 'navigation',
        userBehavior: 'active',
        timestamp: Date.now()
      });
    }
  }, [location, spatialContext, enabled]);

  const showConnectionStatus = connectionStatus === 'error' || connectionStatus === 'connecting';

  // Provide the combined context value
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
  const contextValue = {
    enabled,
    toggleCopilot,
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting',
<<<<<<< HEAD
    error: connectionError,
=======
    error: connectionError
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
  };

  return (
    <CopilotContext.Provider value={contextValue}>
      {showConnectionStatus && enabled && (
<<<<<<< HEAD
        <ConnectionStatusIndicator
=======
        <ConnectionStatusIndicator 
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
          status={connectionStatus}
          error={connectionError}
          onRetry={() => setConnectionStatus('connecting')}
        />
      )}
<<<<<<< HEAD

      {enabled && connectionStatus === 'connected' && apiKey ? (
        <CopilotKit {...copilotConfig}>{children}</CopilotKit>
=======
      
      {(enabled && connectionStatus === 'connected' && apiKey) ? (
        <CopilotKit {...copilotConfig}>
          {children}
        </CopilotKit>
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
      ) : (
        children
      )}
    </CopilotContext.Provider>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
