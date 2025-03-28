
import { useState, useRef, useCallback, useEffect } from 'react';

interface UseGeminiAudioPlaybackProps {
  onPlaybackError?: (error: string) => void;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
}

/**
 * Hook to manage audio playback for Gemini TTS responses
 */
export function useGeminiAudioPlayback({
  onPlaybackError,
  onPlaybackStart,
  onPlaybackEnd
}: UseGeminiAudioPlaybackProps = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioQueue = useRef<Blob[]>([]);
  const audioContext = useRef<AudioContext | null>(null);
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  
  // Clear the audio queue and stop playback
  const clearAudio = useCallback(() => {
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current = null;
    }
    
    audioQueue.current = [];
    setIsPlaying(false);
    setProgress(0);
  }, []);
  
  // Stop audio playback
  const stopAudio = useCallback(() => {
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current = null;
      setIsPlaying(false);
    }
  }, []);
  
  // Handle a new audio chunk received from WebSocket
  const handleAudioChunk = useCallback((chunk: ArrayBuffer) => {
    try {
      // Convert ArrayBuffer to Blob
      const blob = new Blob([chunk], { type: 'audio/mp3' });
      
      // Add to queue
      audioQueue.current.push(blob);
      
      // If not currently playing, start playback
      if (!isPlaying) {
        playAudioChunks();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error processing audio';
      setError(errorMessage);
      if (onPlaybackError) onPlaybackError(errorMessage);
    }
  }, [isPlaying, onPlaybackError]);
  
  // Handle audio metadata information
  const handleAudioMetadata = useCallback((_metadata: any) => {
    // Currently not used, but could handle sample rate, etc
  }, []);
  
  // Play audio chunks from the queue
  const playAudioChunks = useCallback(() => {
    if (audioQueue.current.length === 0) {
      setIsPlaying(false);
      if (onPlaybackEnd) onPlaybackEnd();
      return;
    }
    
    try {
      // Create audio element if needed
      if (!currentAudio.current) {
        currentAudio.current = new Audio();
        
        // Setup event listeners
        currentAudio.current.onended = () => {
          // Play next chunk when current one ends
          currentAudio.current = null;
          playAudioChunks();
        };
        
        currentAudio.current.ontimeupdate = () => {
          if (currentAudio.current) {
            const progress = (currentAudio.current.currentTime / currentAudio.current.duration) * 100;
            setProgress(progress);
          }
        };
        
        currentAudio.current.onerror = (e) => {
          const errorMessage = `Audio playback error: ${e}`;
          setError(errorMessage);
          if (onPlaybackError) onPlaybackError(errorMessage);
          currentAudio.current = null;
          setIsPlaying(false);
        };
      }
      
      // Get the next chunk from the queue
      const nextChunk = audioQueue.current.shift();
      if (!nextChunk) return;
      
      // Create object URL and play
      const audioUrl = URL.createObjectURL(nextChunk);
      currentAudio.current.src = audioUrl;
      
      const playPromise = currentAudio.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            if (onPlaybackStart) onPlaybackStart();
          })
          .catch(err => {
            const errorMessage = `Failed to play audio: ${err.message}`;
            setError(errorMessage);
            if (onPlaybackError) onPlaybackError(errorMessage);
            currentAudio.current = null;
            setIsPlaying(false);
          });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error playing audio';
      setError(errorMessage);
      if (onPlaybackError) onPlaybackError(errorMessage);
      setIsPlaying(false);
    }
  }, [onPlaybackStart, onPlaybackEnd, onPlaybackError]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current = null;
      }
      
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);
  
  return {
    isPlaying,
    progress,
    error,
    handleAudioChunk,
    handleAudioMetadata,
    stopAudio,
    playAudioChunks,
    clearAudio
  };
}

export default useGeminiAudioPlayback;
