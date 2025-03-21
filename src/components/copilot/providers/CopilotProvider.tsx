import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { CopilotKit } from '@copilotkit/react-core';

// Internal imports
import { usePersonaManagement } from '@/mcp/hooks/usePersonaManagement';
import { toast } from '@/components/ui/use-toast';
import { useGeminiAPI } from '@/hooks/useGeminiAPI';
import { ConnectionStatusIndicator } from '../ui/ConnectionStatusIndicator';
import { formatErrorMessage, logDetailedError, categorizeError } from '@/utils/errorHandling';
import type { SpatialContext, VoiceConfig } from '@/services/copilot/types';
import { useContextTracking, useVoiceInitialization, useApiKeyManagement, useSystemMessage, useAgenticConfig } from './hooks';

interface CopilotProviderProps {
  children: React.ReactNode;
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
  agentic: propAgentic
}) => {
  // External data hooks - always call these at the top level
  const { personaData, setCurrentPage } = usePersonaManagement();
  const location = useLocation();
  const { apiKey, isLoading } = useGeminiAPI();

  // State hooks
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [spatialContext, setSpatialContext] = useState<SpatialContext | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Memoized values
  const publicApiKey = useMemo(() => apiKey || '', [apiKey]);

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

  // Track user behavior and page context
  useEffect(() => {
    // Initialize spatial context if needed
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
      return; // Exit early as we just initialized
    }
    
    let lastInteractionTime = Date.now();
    let inactivityTimeout: NodeJS.Timeout;

    const trackUserBehavior = (event: MouseEvent | KeyboardEvent) => {
      try {
        const currentTime = Date.now();
        lastInteractionTime = currentTime;

        // Clear any existing inactivity timeout
        clearTimeout(inactivityTimeout);

        // Set new inactivity timeout
        inactivityTimeout = setTimeout(() => {
          setSpatialContext(prev => prev ? {
            ...prev,
            userBehavior: 'inactive',
            timestamp: Date.now()
          } : null);
        }, 30000); // 30 seconds of inactivity

        // Determine interaction type
        let interactionType = 'unknown';
        let elementType = 'unknown';
        
        try {
          // Safely get the target element
          const target = event.target as HTMLElement;
          elementType = target?.tagName?.toLowerCase() || 'unknown';
          
          if (event instanceof MouseEvent) {
            if (elementType === 'button') {
              interactionType = 'button_click';
            } else if (elementType === 'input' || elementType === 'textarea') {
              interactionType = 'form_interaction';
            } else if (elementType === 'a') {
              interactionType = 'link_click';
            } else {
              interactionType = 'mouse_movement';
            }
          } else if (event instanceof KeyboardEvent) {
            interactionType = 'keyboard_input';
          }
        } catch (targetError) {
          console.error('Error accessing event target:', targetError);
        }
        
        setSpatialContext(prev => prev ? {
          ...prev,
          userBehavior: 'active',
          interactionType,
          elementType,
          timestamp: currentTime
        } : null);
      } catch (error) {
        console.error('Error in trackUserBehavior:', error);
      }
    };

    window.addEventListener('mousemove', trackUserBehavior);
    window.addEventListener('click', trackUserBehavior);
    window.addEventListener('keypress', trackUserBehavior);

    return () => {
      window.removeEventListener('mousemove', trackUserBehavior);
      window.removeEventListener('click', trackUserBehavior);
      window.removeEventListener('keypress', trackUserBehavior);
      clearTimeout(inactivityTimeout);
    };
  }, [location, spatialContext]);

  // Always call useContextTracking unconditionally at the top level
  useContextTracking(setCurrentPage, setSpatialContext);

  // Initialize voice synthesis
  useEffect(() => {
    const initVoice = async () => {
      if ('speechSynthesis' in window) {
        try {
          // First check if voices are already loaded
          let voices = window.speechSynthesis.getVoices();
          
          if (voices.length === 0) {
            // If voices aren't loaded yet, wait for them
            await new Promise<void>(resolve => {
              const voicesChangedHandler = () => {
                voices = window.speechSynthesis.getVoices();
                window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
                resolve();
              };
              window.speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
              
              // Set a timeout just in case the event never fires
              setTimeout(resolve, 1000);
            });
          }
          
          // Look for the Charon voice or enable with any available voice
          const charonVoice = voices.find(voice => voice.name.includes('Charon'));
          setVoiceEnabled(voices.length > 0); // Enable if any voices are available
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
  }, []);

  const copilotConfig = useMemo(
    () => {
      if (!apiKey) return null;
      
      return {
        apiKey: publicApiKey,
        options: {
          model: propModelName || 'gemini-2.0-flash-001',
          temperature: 0.7,
          maxTokens: 2048,
          initialMessages: [
            {
              role: 'system' as const,
              content: systemMessage
            }
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
      };
    },
    [systemMessage, voiceEnabled, spatialContext, publicApiKey]
  );

  // Initialize and validate API key
  useEffect(() => {
    if (isLoading) {
      setConnectionStatus('connecting');
      return; // Wait until loading is complete
    }
    
    if (!apiKey) {
      setConnectionStatus('error');
      setConnectionError('API key not found');
      toast({
        title: 'AI Configuration Error',
        description: 'API key not found. Please check your configuration.',
        variant: 'destructive'
      });
    } else {
      // Test connection to the API
      const testConnection = async () => {
        try {
          setConnectionStatus('connecting');
          
          // Simple test to verify API key works
          const response = await fetch('https://generativelanguage.googleapis.com/v1/models?key=' + apiKey);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API connection failed: ${response.status} ${response.statusText}${
              errorData.error ? ` - ${errorData.error.message || ''}` : ''
            }`);
          }
          
          setConnectionStatus('connected');
          setConnectionError(null);
        } catch (error) {
          logDetailedError(error, {
            component: 'CopilotProvider',
            apiKeyLength: apiKey?.length,
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
      
      testConnection();
    }
  }, [apiKey, isLoading]);

  // Only show status indicator when there is an error or connecting
  const showConnectionStatus = connectionStatus === 'error' || connectionStatus === 'connecting';

  return (
    <>
      {showConnectionStatus && (
        <ConnectionStatusIndicator 
          status={connectionStatus}
          error={connectionError}
          onRetry={() => {
            // Reset connection status and trigger a new connection test
            setConnectionStatus('connecting');
            // This will trigger the useEffect that tests the connection
          }}
        />
      )}
      
      {(connectionStatus === 'connected' && apiKey) ? (
        <CopilotKit {...copilotConfig}>
          {children}
        </CopilotKit>
      ) : (
        children
      )}
    </>
  );
};
