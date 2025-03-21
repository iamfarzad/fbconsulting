
import React, { useState, useMemo, useRef } from 'react';
import { CopilotKit } from '@copilotkit/react-core';

// Internal imports
import { usePersonaManagement } from '@/mcp/hooks/usePersonaManagement';
import { useGeminiAPI } from '@/hooks/useGeminiAPI';
import type { SpatialContext, VoiceConfig, AgenticConfig } from '@/services/copilot/types';
import { 
  useContextTracking,
  useVoiceInitialization,
  useApiKeyManagement,
  useSystemMessage,
  useAgenticConfig
} from './hooks';

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
  // Refs to prevent excessive re-renders
  const isInitializedRef = useRef(false);
  
  // Hooks for external data - only execute once
  const { personaData, setCurrentPage } = usePersonaManagement();
  const { apiKey: contextApiKey } = useGeminiAPI();

  // State hooks with initialization prevention
  const [spatialContext, setSpatialContext] = useState<SpatialContext | null>(null);

  // Only initialize tracking if not already done
  if (!isInitializedRef.current) {
    // Track context and user behavior - with debouncing built in
    useContextTracking(setCurrentPage, setSpatialContext);
    isInitializedRef.current = true;
  }

  // Custom hooks for different functionalities
  const { voiceConfig } = useVoiceInitialization(propVoice);
  const { apiKey } = useApiKeyManagement(propApiKey, contextApiKey);
  const { systemMessage } = useSystemMessage(personaData);
  const { agenticConfig } = useAgenticConfig(propAgentic);

  // Runtime URL for the CopilotKit
  const runtimeUrl = useMemo(() => 'http://localhost:3000', []);

  // Configure CopilotKit - memoize to prevent unnecessary recalculations
  const copilotConfig = useMemo(
    () => {
      if (!apiKey) return null;
      
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
    [
      runtimeUrl, 
      systemMessage, 
      voiceConfig, 
      spatialContext, 
      apiKey, 
      propModelName, 
      agenticConfig
    ]
  );

  // Early return if no API key to prevent unnecessary processing
  if (!apiKey) {
    return <>{children}</>;
  }

  // Only render CopilotKit if configuration is available
  return copilotConfig ? (
    <CopilotKit {...copilotConfig}>
      {children}
    </CopilotKit>
  ) : null;
};
