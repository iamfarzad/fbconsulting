
import { useState } from 'react';
import type { VoiceConfig } from '@/services/copilot/types';

/**
 * Hook for initializing voice configuration
 */
export const useVoiceInitialization = (propVoice?: VoiceConfig) => {
  // Initialize voice configuration state
  const [voiceConfig] = useState<VoiceConfig | undefined>(propVoice);
  
  return { voiceConfig };
};
