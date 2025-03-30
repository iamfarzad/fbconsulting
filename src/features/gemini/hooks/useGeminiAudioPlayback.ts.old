import { useState, useCallback } from 'react';

export function useGeminiAudioPlayback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  
  // Initialize or resume AudioContext
  const initAudioContext = useCallback(() => {
    if (!audioContext) {
      const context = new AudioContext();
      setAudioContext(context);
      return context;
    }
    
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  }, [audioContext]);

  // Handle audio chunk from the provider
  const handleAudioChunk = useCallback((chunk: ArrayBuffer) => {
    if (!chunk || chunk.byteLength === 0) return;
    
    try {
      const context = initAudioContext();
      setIsPlaying(true);
      
      context.decodeAudioData(chunk, (buffer) => {
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        source.start(0);
        
        source.onended = () => {
          setIsPlaying(false);
        };
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  }, [initAudioContext]);

  // Stop audio playback
  const stopAudio = useCallback(() => {
    if (audioContext) {
      audioContext.suspend();
    }
    setIsPlaying(false);
  }, [audioContext]);

  return {
    isPlaying,
    handleAudioChunk,
    stopAudio
  };
}

export default useGeminiAudioPlayback;
