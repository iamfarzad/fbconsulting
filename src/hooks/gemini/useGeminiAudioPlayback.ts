
import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseGeminiAudioPlaybackProps {
  onPlaybackStart?: () => void;
  onPlaybackComplete?: () => void;
  onPlaybackError?: (error: string) => void;
}

/**
 * Hook to manage audio playback for Gemini services
 */
export function useGeminiAudioPlayback({
  onPlaybackStart,
  onPlaybackComplete,
  onPlaybackError
}: UseGeminiAudioPlaybackProps = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || 
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch (e) {
        console.error('Failed to create AudioContext:', e);
        setError('Failed to initialize audio system');
        if (onPlaybackError) {
          onPlaybackError('Failed to initialize audio system');
        }
      }
    }
    return () => {
      audioContextRef.current?.close();
    };
  }, [onPlaybackError]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    
    setIsPlaying(false);
    setProgress(0);
  }, []);

  // Play audio from blob
  const playAudio = useCallback(async (audioBlob: Blob) => {
    try {
      // Clean up any existing audio
      cleanup();
      
      // Create URL for the blob
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create audio element
      if (!audioRef.current) {
        audioRef.current = new Audio();
        
        audioRef.current.addEventListener('timeupdate', () => {
          if (audioRef.current) {
            const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(currentProgress);
          }
        });
        
        audioRef.current.addEventListener('ended', () => {
          setIsPlaying(false);
          setProgress(100);
          if (onPlaybackComplete) {
            onPlaybackComplete();
          }
        });
        
        audioRef.current.addEventListener('error', (e) => {
          const errorMessage = 'Error playing audio';
          setError(errorMessage);
          if (onPlaybackError) {
            onPlaybackError(errorMessage);
          }
        });
      }
      
      // Set source and play
      audioRef.current.src = audioUrl;
      
      // Play audio
      const playPromise = audioRef.current.play();
      if (playPromise) {
        await playPromise;
        setIsPlaying(true);
        if (onPlaybackStart) {
          onPlaybackStart();
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error playing audio';
      setError(errorMessage);
      if (onPlaybackError) {
        onPlaybackError(errorMessage);
      }
    }
  }, [cleanup, onPlaybackStart, onPlaybackComplete, onPlaybackError]);

  // Stop audio playback
  const stopAudio = useCallback(() => {
    cleanup();
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    isPlaying,
    error,
    progress,
    playAudio,
    stopAudio,
  };
}

export default useGeminiAudioPlayback;
