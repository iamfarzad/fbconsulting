
import { useMemo } from 'react';
import { SpatialContext } from '@/components/copilot/types';
import type { AIMessage as Message } from '@/features/gemini/types';

/**
 * Hook to generate Copilot configuration based on current state
 */
export function useCopilotConfig(
  apiKey: string,
  systemMessage: string,
  voiceEnabled: boolean,
  spatialContext: SpatialContext | null
) {
  const copilotConfig = useMemo(() => ({
    apiKey: apiKey,
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
  }), [systemMessage, voiceEnabled, spatialContext, apiKey]);

  return copilotConfig;
}
