
import { useState, useEffect } from 'react';

/**
 * Hook to initialize voice capabilities for Copilot
 */
export function useVoiceSetup(enabled: boolean) {
  const [voiceEnabled, setVoiceEnabled] = useState(false);

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

  return { voiceEnabled };
}
