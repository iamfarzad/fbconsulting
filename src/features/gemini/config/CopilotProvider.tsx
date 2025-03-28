import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { CopilotKit } from '@copilotkit/react-core';

// Internal imports
import { toast } from '@/components/ui/use-toast';
import { usePersonaManagement } from '@/mcp/hooks/usePersonaManagement';
import ConnectionStatusIndicator from '@/components/ui/ConnectionStatusIndicator';
import { formatErrorMessage, logDetailedError, categorizeError } from '@/utils/errorHandling';
import { useGeminiAPI } from '@/providers/GeminiAPIProvider';
import type { SpatialContext, VoiceConfig, Message, CopilotConfig } from '@/features/gemini/types';
import { ChatMessage } from '@/features/gemini/types/chat';

// Basic Copilot Context for toggle functionality
interface CopilotContextType {
  enabled: boolean;
  toggleCopilot: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  isOpen: boolean;
  openCopilot: () => void;
  closeCopilot: () => void;
  activeProvider: string;
  setActiveProvider: (provider: string) => void;
  chatHistory: Record<string, ChatMessage[]>;
  addMessageToHistory: (provider: string, message: ChatMessage) => void;
  clearChatHistory: (provider: string) => void;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export const useCopilot = () => {
  const context = useContext(CopilotContext);
  if (context === undefined) {
    throw new Error('useCopilot must be used within a CopilotProvider');
  }
  return context;
};

interface CopilotProviderProps {
  children: React.ReactNode;
}

export const CopilotProvider: React.FC<CopilotProviderProps> = ({ children }) => {
  // Basic toggle state
  const [enabled, setEnabled] = useState(false);
  const toggleCopilot = () => setEnabled(prev => !prev);

  // Hooks for external data
  const { personaData } = usePersonaManagement();
  const location = useLocation();
  const { apiKey } = useGeminiAPI();
  const [isLoading, setIsLoading] = useState(false);

  // State hooks
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [spatialContext, setSpatialContext] = useState<SpatialContext | null>(null);
  type InternalConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error' | 'disconnected';
  type ConnectionStatusIndicatorType = 'connected' | 'connecting' | 'disconnected';
  
  const [connectionStatus, setConnectionStatus] = useState<InternalConnectionStatus>('idle');
  
  const getIndicatorStatus = (status: InternalConnectionStatus): ConnectionStatusIndicatorType => {
    switch (status) {
      case 'connected':
        return 'connected';
      case 'connecting':
        return 'connecting';
      case 'idle':
      case 'error':
      case 'disconnected':
        return 'disconnected';
    }
  };
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeProvider, setActiveProvider] = useState<string>('gemini');
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({
    gemini: [],
    openai: [],
    anthropic: [],
  });

  const openCopilot = () => setIsOpen(true);
  const closeCopilot = () => setIsOpen(false);

  const addMessageToHistory = (provider: string, message: ChatMessage) => {
    setChatHistory(prev => {
      // Ensure we have an array for this provider
      const providerHistory = Array.isArray(prev[provider]) ? [...prev[provider]] : [];
      
      return {
        ...prev,
        [provider]: [...providerHistory, message],
      };
    });
  };

  const clearChatHistory = (provider: string) => {
    setChatHistory(prev => ({
      ...prev,
      [provider]: [],
    }));
  };

  // Memoized values
  const publicApiKey = useMemo(() => {
    return apiKey || '';
  }, [apiKey]);

  const systemMessage = useMemo(() => {
    if (!personaData?.personaDefinitions || !personaData.currentPersona) {
      return '';
    }

    const personaDetails = personaData.personaDefinitions[personaData.currentPersona];
    if (!personaDetails) return '';

    return `
      You are Farzad AI Assistant, an AI consultant built into the landing page of F.B Consulting. 
      Currently using the "${personaDetails.name}" persona.
      
      Tone: ${personaDetails.tone}
      
      Focus Areas:
      ${personaDetails.focusAreas.map(area => `- ${area}`).join('\n')}
      
      Additional Context:
      - User Role: ${personaData.userRole || 'Unknown'}
      - User Industry: ${personaData.userIndustry || 'Unknown'}
      - User Technical Level: ${personaData.userTechnicalLevel || 'beginner'}
      - Current Page: ${personaData.currentPage || '/'}
      
      Remember to adjust your responses based on the user's technical level and industry context.
    `;
  }, [personaData]);

  const copilotConfig = useMemo<CopilotConfig>(
    () => ({
      apiKey: publicApiKey,
      options: {
        model: 'gemini-2.0-flash-001',
        temperature: 0.7,
        maxTokens: 2048,
        initialMessages: [
          {
            role: 'system',
            content: systemMessage,
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
        agentic: {
          proactiveAssistance: true,
          learningEnabled: true,
          contextAwareness: true,
          behaviorPatterns: ['page_navigation', 'content_interaction', 'form_interaction']
        }
      }
    }),
    [systemMessage, voiceEnabled, spatialContext, publicApiKey]
  );

  // Initialize and validate API key
  useEffect(() => {
    if (!enabled) return; // Don't connect if copilot is disabled

    if (!apiKey) {
      setConnectionStatus('error');
      setConnectionError('API key not found');
      toast({
        title: 'AI Configuration Error',
        description: 'API key not found. Please check your configuration.',
        variant: 'destructive'
      });
    } else {
      const testConnection = async () => {
        try {
          setIsLoading(true);
          setConnectionStatus('connecting');
          
          const response = await fetch('https://generativelanguage.googleapis.com/v1/models?key=' + apiKey);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API connection failed: ${response.status} ${response.statusText}${
              errorData.error ? ` - ${errorData.error.message || ''}` : ''
            }`);
          }
          
          setConnectionStatus('connected');
          setConnectionError(null);
          setIsLoading(false);
        } catch (error) {
          logDetailedError(error, {
            component: 'CopilotProvider',
            apiKeyLength: apiKey?.length,
            apiKeyPresent: !!apiKey
          });
          
          setConnectionStatus('error');
          const errorMessage = formatErrorMessage(error);
          setConnectionError(errorMessage);
          setIsLoading(false);
          
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
      
      testConnection();
    }
  }, [apiKey, isLoading, enabled]);

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
  const contextValue = {
    enabled,
    toggleCopilot,
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting',
    error: connectionError,
    isOpen,
    openCopilot,
    closeCopilot,
    activeProvider,
    setActiveProvider,
    chatHistory,
    addMessageToHistory,
    clearChatHistory,
  };

  // Error handling for WebSocket connection failures
  useEffect(() => {
    if (connectionStatus === 'error' && connectionError) {
      console.error('WebSocket connection error:', connectionError);
    }
  }, [connectionStatus, connectionError]);

  // Error handling for resource loading failures
  useEffect(() => {
    const handleResourceError = (event: Event) => {
      console.error('Resource loading error:', event);
    };

    window.addEventListener('error', handleResourceError);

    return () => {
      window.removeEventListener('error', handleResourceError);
    };
  }, []);

  // Error handling for THREE.WebGLRenderer context lost error
  useEffect(() => {
    const handleContextLost = (event: Event) => {
      console.error('THREE.WebGLRenderer context lost:', event);
    };

    window.addEventListener('webglcontextlost', handleContextLost);

    return () => {
      window.removeEventListener('webglcontextlost', handleContextLost);
    };
  }, []);

  return (
    <CopilotContext.Provider value={contextValue}>
      {showConnectionStatus && enabled && (
        <ConnectionStatusIndicator 
          status={getIndicatorStatus(connectionStatus)}
        />
      )}
      
      {(enabled && connectionStatus === 'connected' && apiKey) ? (
        <CopilotKit {...copilotConfig}>
          {children}
        </CopilotKit>
      ) : (
        children
      )}
    </CopilotContext.Provider>
  );
};
