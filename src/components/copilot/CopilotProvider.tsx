
import React, { useState, useMemo } from 'react';
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
  // Hooks for external data
  const { personaData, setCurrentPage } = usePersonaManagement();
  const { apiKey: contextApiKey } = useGeminiAPI();

  // State hooks
  const [spatialContext, setSpatialContext] = useState<SpatialContext | null>(null);

  // Custom hooks for different functionalities
  const { voiceConfig } = useVoiceInitialization(propVoice);
  const { apiKey } = useApiKeyManagement(propApiKey, contextApiKey);
  const { systemMessage } = useSystemMessage(personaData);
  const { agenticConfig } = useAgenticConfig(propAgentic);

  // Track context and user behavior
  useContextTracking(setCurrentPage, setSpatialContext);

  // Runtime URL for the CopilotKit
  const runtimeUrl = useMemo(() => 'http://localhost:3000', []);

  // Configure CopilotKit
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

  if (!apiKey) {
    return <>{children}</>;
  }

  return copilotConfig ? (
    <CopilotKit {...copilotConfig}>
      {children}
    </CopilotKit>
  ) : null;
};
