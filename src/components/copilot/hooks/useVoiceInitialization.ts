
import { useState, useMemo } from 'react';
import type { VoiceConfig } from '@/services/copilot/types';

/**
 * Hook for initializing voice configuration
 */
export const useVoiceInitialization = (propVoice?: VoiceConfig) => {
  // Initialize voice configuration state with useMemo to properly handle dependencies
  const voiceConfig = useMemo(() => propVoice, [propVoice]);
  
  return { voiceConfig };
};
