
import { useState, useEffect } from 'react';
import { VoiceConfig } from '@/services/copilot/types';

/**
 * Hook to initialize voice synthesis capabilities
 */
export function useVoiceInitialization(propVoice?: VoiceConfig) {
  const [voiceEnabled, setVoiceEnabled] = useState(propVoice?.enabled || false);

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

  // Process voice configuration
  const voiceConfig = (() => {
    if (!voiceEnabled && !propVoice?.enabled) return undefined;
    
    return propVoice || {
      enabled: voiceEnabled,
      voice: 'Charon',
      pitch: 1,
      rate: 1
    };
  })();

  return { voiceEnabled, voiceConfig };
}
