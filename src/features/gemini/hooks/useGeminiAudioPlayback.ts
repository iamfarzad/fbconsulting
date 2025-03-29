
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseGeminiAudioPlaybackProps {
  onPlaybackError?: (error: string) => void;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
}

/**
 * Hook to handle audio playback from the Gemini API
 */
export function useGeminiAudioPlayback({
  onPlaybackError,
  onPlaybackStart,
  onPlaybackEnd
}: UseGeminiAudioPlaybackProps = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioSourceRef = useRef<string | null>(null);
  
  // Cleanup audio resources
  useEffect(() => {
    return () => {
      clearAudio();
    };
  }, []);
  
  // Handle an audio chunk from the WebSocket (ArrayBuffer)
  const handleAudioChunk = useCallback((chunk: ArrayBuffer) => {
    try {
      // Convert ArrayBuffer to Blob
      const blob = new Blob([chunk], { type: 'audio/mpeg' });
      audioChunksRef.current.push(blob);
      
      // If this is the first chunk and we're not already playing, start playback
      if (audioChunksRef.current.length === 1 && !isPlaying) {
        playAudioChunks();
      }
    } catch (err) {
      const errorMessage = `Failed to process audio chunk: ${err instanceof Error ? err.message : 'Unknown error'}`;
      console.error(errorMessage);
      setError(errorMessage);
      if (onPlaybackError) onPlaybackError(errorMessage);
    }
  }, [isPlaying, onPlaybackError]);
  
  // Handle audio metadata (not used yet)
  const handleAudioMetadata = useCallback((_metadata: any) => {
    // Future: Handle metadata like duration, format, etc.
  }, []);
  
  // Play concatenated audio chunks
  const playAudioChunks = useCallback(() => {
    try {
      if (audioChunksRef.current.length === 0) {
        return;
      }
      
      // Revoke previous URL to prevent memory leaks
      if (audioSourceRef.current) {
        URL.revokeObjectURL(audioSourceRef.current);
      }
      
      // Create a new audio element if needed
      if (!audioRef.current) {
        audioRef.current = new Audio();
        
        // Set up audio event listeners
        audioRef.current.addEventListener('play', () => {
          setIsPlaying(true);
          if (onPlaybackStart) onPlaybackStart();
        });
        
        audioRef.current.addEventListener('ended', () => {
          setIsPlaying(false);
          setProgress(100);
          if (onPlaybackEnd) onPlaybackEnd();
        });
        
        audioRef.current.addEventListener('timeupdate', () => {
          if (audioRef.current) {
            const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(Math.round(percentage));
          }
        });
        
        audioRef.current.addEventListener('error', (e) => {
          const errorMessage = `Audio playback error: ${e.type}`;
          console.error(errorMessage, e);
          setError(errorMessage);
          setIsPlaying(false);
          if (onPlaybackError) onPlaybackError(errorMessage);
        });
      }
      
      // Combine chunks into a single blob
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
      audioSourceRef.current = URL.createObjectURL(audioBlob);
      
      // Set the source and play
      audioRef.current.src = audioSourceRef.current;
      audioRef.current.play().catch(err => {
        const errorMessage = `Could not play audio: ${err.message}`;
        console.error(errorMessage);
        setError(errorMessage);
        setIsPlaying(false);
        if (onPlaybackError) onPlaybackError(errorMessage);
      });
      
    } catch (err) {
      const errorMessage = `Failed to play audio: ${err instanceof Error ? err.message : 'Unknown error'}`;
      console.error(errorMessage);
      setError(errorMessage);
      setIsPlaying(false);
      if (onPlaybackError) onPlaybackError(errorMessage);
    }
  }, [onPlaybackError, onPlaybackStart, onPlaybackEnd]);
  
  // Stop audio playback
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
    }
  }, []);
  
  // Clear all audio resources
  const clearAudio = useCallback(() => {
    stopAudio();
    
    // Clear audio chunks
    audioChunksRef.current = [];
    
    // Revoke object URL
    if (audioSourceRef.current) {
      URL.revokeObjectURL(audioSourceRef.current);
      audioSourceRef.current = null;
    }
    
    // Clear error
    setError(null);
  }, [stopAudio]);
  
  return {
    isPlaying,
    progress,
    error,
    handleAudioChunk,
    handleAudioMetadata,
    playAudioChunks,
    stopAudio,
    clearAudio
  };
}

export default useGeminiAudioPlayback;
