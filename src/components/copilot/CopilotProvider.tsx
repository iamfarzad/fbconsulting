
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { CopilotKit } from '@copilotkit/react-core';

// Internal imports
import { usePersonaManagement } from '@/mcp/hooks/usePersonaManagement';
import { toast } from '@/components/ui/use-toast';
import { useGeminiAPI } from '@/hooks/useGeminiAPI';
import type { 
  SpatialContext, 
  VoiceConfig,
  AgenticConfig
} from '@/services/copilot/types';

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
  // Hooks for external data
  const { personaData, setCurrentPage } = usePersonaManagement();
  const location = useLocation();
  const { apiKey: contextApiKey } = useGeminiAPI();
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // State hooks
  const [voiceEnabled, setVoiceEnabled] = useState(propVoice?.enabled || false);
  const [spatialContext, setSpatialContext] = useState<SpatialContext | null>(null);

  // Determine which API key to use (prop > context > env)
  const apiKey = useMemo(() => {
    const key = propApiKey || contextApiKey || envApiKey || '';
    console.log('Using API Key:', key ? '✅ Found' : '❌ Not found');
    return key;
  }, [propApiKey, contextApiKey, envApiKey]);

  const runtimeUrl = useMemo(
    () => 'http://localhost:3000',
    []
  );

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
    let lastInteractionTime = Date.now();
    let inactivityTimeout: NodeJS.Timeout;

    const trackUserBehavior = (event: MouseEvent | KeyboardEvent) => {
      const currentTime = Date.now();
      lastInteractionTime = currentTime;

      // Clear any existing inactivity timeout
      clearTimeout(inactivityTimeout);

      // Set new inactivity timeout
      inactivityTimeout = setTimeout(() => {
        setSpatialContext(prev => ({
          ...prev!,
          userBehavior: 'inactive',
          timestamp: Date.now()
        }));
      }, 30000); // 30 seconds of inactivity

      // Determine interaction type
      let interactionType = 'unknown';
      if (event instanceof MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.tagName === 'BUTTON') {
          interactionType = 'button_click';
        } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          interactionType = 'form_interaction';
        } else if (target.tagName === 'A') {
          interactionType = 'link_click';
        } else {
          interactionType = 'mouse_movement';
        }
      } else if (event instanceof KeyboardEvent) {
        interactionType = 'keyboard_input';
      }
      
      setSpatialContext(prev => ({
        ...prev!,
        userBehavior: 'active',
        interactionType,
        elementType: (event.target as HTMLElement)?.tagName.toLowerCase() || 'unknown',
        timestamp: currentTime
      }));
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
  }, []);

  // Initialize voice synthesis
  useEffect(() => {
    const initVoice = async () => {
      if ('speechSynthesis' in window) {
        await new Promise<void>(resolve => {
          window.speechSynthesis.onvoiceschanged = () => {
            const voices = window.speechSynthesis.getVoices();
            const charonVoice = voices.find(voice => voice.name.includes('Charon'));
            setVoiceEnabled(!!charonVoice);
            resolve();
          };
        });
      }
    };

    initVoice();
  }, []);

  // Process agentic configuration
  const agenticConfig = useMemo(() => {
    return propAgentic || {
      proactiveAssistance: true,
      learningEnabled: true,
      contextAwareness: true,
      behaviorPatterns: ['page_navigation', 'content_interaction', 'form_interaction']
    };
  }, [propAgentic]);

  // Process voice configuration
  const voiceConfig = useMemo(() => {
    if (!voiceEnabled && !propVoice?.enabled) return undefined;
    
    return propVoice || {
      enabled: voiceEnabled,
      voice: 'Charon',
      pitch: 1,
      rate: 1
    };
  }, [voiceEnabled, propVoice]);

  const copilotConfig = useMemo(
    () => {
      return {
        publicApiKey: apiKey,
        baseUrl: runtimeUrl,
        chatOptions: {
          initialMessages: [
            {
              role: 'system' as const,
              content: systemMessage
            }
          ],
          model: propModelName || 'gemini-2.0-flash-001',
          temperature: 0.7,
          maxTokens: 2048,
          topP: 0.95,
          topK: 40,
          voice: voiceConfig,
          spatialContext: spatialContext,
          agentic: agenticConfig
        }
      };
    },
    [runtimeUrl, systemMessage, voiceConfig, spatialContext, apiKey, propModelName, agenticConfig]
  );

  // Initialize API key
  useEffect(() => {
    console.log('Direct env var:', import.meta.env.VITE_GEMINI_API_KEY);
    console.log('API Key from hook:', apiKey);
    
    if (!apiKey) {
      toast({
        title: 'AI Configuration Error',
        description: 'API key not found. Please check your configuration.',
        variant: 'destructive'
      });
    }
  }, [apiKey]);

  useEffect(() => {
    const currentPath = location.pathname;
    const pageName = currentPath === '/' ? 'home' : currentPath.substring(1);
    setCurrentPage(pageName);

    // Initialize spatial context
    setSpatialContext({
      pageSection: pageName,
      elementType: 'page',
      interactionType: 'navigation',
      userBehavior: 'active',
      timestamp: Date.now()
    });
  }, [location.pathname, setCurrentPage]);

  // Update spatial context on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;

        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
          setSpatialContext(prev => ({
            ...prev!,
            pageSection: section.id || 'unknown',
            elementType: 'section',
            interactionType: 'scroll',
            timestamp: Date.now()
          }));
          break; // Exit after finding the first matching section
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!apiKey) {
    return <>{children}</>;
  }

  return copilotConfig ? (
    <CopilotKit {...copilotConfig}>
      {children}
    </CopilotKit>
  ) : null;
};
