
import { useState, useEffect } from 'react';

/**
 * Hook for setting up voice capabilities
 */
export function useVoiceSetup(enabled: boolean) {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  
  useEffect(() => {
    if (!enabled) return;
    
    // Check if speech synthesis is available in the browser
    const isSpeechSupported = 'speechSynthesis' in window;
    setVoiceSupported(isSpeechSupported);
    
    // Enable voice only if speech synthesis is supported
    setVoiceEnabled(isSpeechSupported);
    
    // Log voice support status
    if (isSpeechSupported) {
      console.log('Voice capabilities are supported in this browser');
    } else {
      console.log('Voice capabilities are not supported in this browser');
    }
    
    return () => {
      // Clean up voice resources if needed
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [enabled]);
  
  return { voiceEnabled, voiceSupported };
}
