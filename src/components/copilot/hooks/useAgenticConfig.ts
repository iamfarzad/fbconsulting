
import { useMemo } from 'react';
import { AgenticConfig } from '@/services/copilot/types';

/**
 * Hook to process agentic configuration
 */
export function useAgenticConfig(propAgentic?: AgenticConfig) {
  const agenticConfig = useMemo(() => {
    return propAgentic || {
      proactiveAssistance: true,
      learningEnabled: true,
      contextAwareness: true,
      behaviorPatterns: ['page_navigation', 'content_interaction', 'form_interaction']
    };
  }, [propAgentic]);

  return { agenticConfig };
}
