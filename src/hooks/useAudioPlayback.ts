
import { useState, useCallback, useRef, useEffect } from 'react';

interface UseAudioPlaybackOptions {
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
  onPlaybackError?: (error: string) => void;
}

export function useAudioPlayback(options: UseAudioPlaybackOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (audioRef.current.src) {
        URL.revokeObjectURL(audioRef.current.src);
      }
    }
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const playAudio = useCallback(async (audioBlob: Blob): Promise<void> => {
    try {
      stopAudio();
      setError(null);
      
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      // Set up audio element event handlers
      audioRef.current.onplay = () => {
        setIsPlaying(true);
        if (options.onPlaybackStart) {
          options.onPlaybackStart();
        }
      };
      
      audioRef.current.onpause = () => setIsPlaying(false);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setProgress(0);
        if (options.onPlaybackEnd) {
          options.onPlaybackEnd();
        }
      };
      
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(percentage);
        }
      };
      
      audioRef.current.onerror = (e) => {
        const errorMessage = `Error playing audio: ${e}`;
        setError(errorMessage);
        setIsPlaying(false);
        if (options.onPlaybackError) {
          options.onPlaybackError(errorMessage);
        }
      };

      // Create object URL for the audio blob
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // If there was a previous URL, revoke it
      if (audioRef.current.src) {
        URL.revokeObjectURL(audioRef.current.src);
      }
      
      // Set the new URL and play
      audioRef.current.src = audioUrl;
      await audioRef.current.play();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error playing audio';
      console.error('Error playing audio:', errorMessage);
      setError(errorMessage);
      setIsPlaying(false);
      if (options.onPlaybackError) {
        options.onPlaybackError(errorMessage);
      }
    }
  }, [options, stopAudio]);

  const addAudioChunk = useCallback((chunk: Blob) => {
    audioChunksRef.current.push(chunk);
  }, []);

  const playAudioChunks = useCallback(async () => {
    if (audioChunksRef.current.length === 0) {
      const errorMessage = 'No audio chunks available to play';
      setError(errorMessage);
      if (options.onPlaybackError) {
        options.onPlaybackError(errorMessage);
      }
      return;
    }

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
      await playAudio(audioBlob);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error playing audio chunks';
      setError(errorMessage);
      if (options.onPlaybackError) {
        options.onPlaybackError(errorMessage);
      }
    }
  }, [playAudio, options]);

  const clearAudioChunks = useCallback(() => {
    audioChunksRef.current = [];
  }, []);

  return {
    isPlaying,
    progress,
    error,
    stopAudio,
    playAudio,
    addAudioChunk,
    playAudioChunks,
    clearAudioChunks
  };
}

export default useAudioPlayback;
