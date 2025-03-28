
import { useState, useCallback, useRef, useEffect } from 'react';

interface UseAudioHandlerOptions {
  autoPlay?: boolean;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
  onPlaybackError?: (error: string) => void;
}

export function useAudioHandler(options: UseAudioHandlerOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const shouldAutoPlayRef = useRef(options.autoPlay !== false);

  // Initialize audio element on mount
  useEffect(() => {
    audioRef.current = new Audio();
    
    // Configure audio element
    const audioEl = audioRef.current;
    
    audioEl.onplay = () => {
      setIsPlaying(true);
      if (options.onPlaybackStart) options.onPlaybackStart();
    };
    
    audioEl.onpause = () => {
      setIsPlaying(false);
    };
    
    audioEl.onended = () => {
      setIsPlaying(false);
      setProgress(0);
      if (options.onPlaybackEnd) options.onPlaybackEnd();
    };
    
    audioEl.ontimeupdate = () => {
      if (audioEl.duration) {
        const percentage = (audioEl.currentTime / audioEl.duration) * 100;
        setProgress(percentage);
      }
    };
    
    audioEl.onerror = (e) => {
      const errorMsg = `Audio playback error: ${e}`;
      setError(errorMsg);
      setIsPlaying(false);
      if (options.onPlaybackError) options.onPlaybackError(errorMsg);
    };
    
    // Clean up on unmount
    return () => {
      stopAudio();
      if (audioEl.src) {
        URL.revokeObjectURL(audioEl.src);
      }
    };
  }, [options]);

  // Handle audio chunks
  const handleAudioChunk = useCallback((chunk: ArrayBuffer) => {
    try {
      const blob = new Blob([chunk], { type: 'audio/mpeg' });
      audioChunksRef.current.push(blob);
      
      // Auto-play if enabled and this is the first chunk
      if (shouldAutoPlayRef.current && audioChunksRef.current.length === 1) {
        playAudioChunks();
      }
    } catch (error) {
      console.error('Error processing audio chunk:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error processing audio';
      setError(errorMsg);
      if (options.onPlaybackError) options.onPlaybackError(errorMsg);
    }
  }, [options]);

  // Play audio chunks
  const playAudioChunks = useCallback(() => {
    if (audioChunksRef.current.length === 0) {
      const errorMsg = 'No audio chunks available to play';
      setError(errorMsg);
      if (options.onPlaybackError) options.onPlaybackError(errorMsg);
      return;
    }

    try {
      // Create a combined blob from all chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
      
      // Create a URL for the blob
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // If there's an existing URL, revoke it to prevent memory leaks
      if (audioRef.current && audioRef.current.src) {
        URL.revokeObjectURL(audioRef.current.src);
      }
      
      // Set the source of the audio element to the new URL
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          const errorMsg = error instanceof Error ? error.message : 'Unknown error playing audio';
          setError(errorMsg);
          if (options.onPlaybackError) options.onPlaybackError(errorMsg);
        });
      }
    } catch (error) {
      console.error('Error playing audio chunks:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error playing audio';
      setError(errorMsg);
      if (options.onPlaybackError) options.onPlaybackError(errorMsg);
    }
  }, [options]);

  // Stop audio playback
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // Clear audio data
  const clearAudio = useCallback(() => {
    audioChunksRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      if (audioRef.current.src) {
        URL.revokeObjectURL(audioRef.current.src);
        audioRef.current.src = '';
      }
    }
    setIsPlaying(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    handleAudioChunk,
    isPlaying,
    progress,
    error,
    playAudioChunks,
    stopAudio,
    clearAudio
  };
}
