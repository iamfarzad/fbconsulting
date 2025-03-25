import { useState, useCallback, useRef, useEffect } from 'react';

interface AudioPlaybackOptions {
  onStart?: () => void;
  onStop?: () => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

export interface GeminiAudioService {
  playText: (text: string) => Promise<void>;
  stopPlayback: () => void;
  isPlaying: boolean;
  progress: number;
  error: Error | null;
}

export function useGeminiAudio(options?: AudioPlaybackOptions): GeminiAudioService {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setIsPlaying(false);
    setProgress(0);
    options?.onStop?.();
  }, [options]);

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, [stopPlayback]);

  const playText = useCallback(async (text: string) => {
    try {
      if (!text || text.trim() === '') {
        throw new Error('Text is required for audio playback');
      }

      // Stop any ongoing playback
      stopPlayback();
      
      setIsPlaying(true);
      setError(null);
      setProgress(0);
      options?.onStart?.();
      
      // Create abort controller for fetch
      abortControllerRef.current = new AbortController();
      
      // This connects to the /api/gemini/audio endpoint we saw in the codebase
      const response = await fetch('/api/gemini/audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          config: {
            voice: 'Charon' // Default voice, could be configurable
          }
        }),
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Audio API error: ${response.status} - ${errorText}`);
      }
      
      // Get audio blob from response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create and configure audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.addEventListener('timeupdate', () => {
        const currentProgress = audio.currentTime / audio.duration;
        setProgress(currentProgress);
        options?.onProgress?.(currentProgress);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(1);
        options?.onStop?.();
        URL.revokeObjectURL(audioUrl); // Clean up
      });
      
      audio.addEventListener('error', (e) => {
        const audioError = new Error(`Audio playback error: ${e}`);
        setError(audioError);
        setIsPlaying(false);
        options?.onError?.(audioError);
        URL.revokeObjectURL(audioUrl); // Clean up
      });
      
      // Start playback
      await audio.play();
      
    } catch (err) {
      const playError = err instanceof Error ? err : new Error(String(err));
      setError(playError);
      setIsPlaying(false);
      options?.onError?.(playError);
      console.error('Audio playback error:', playError);
    }
  }, [options, stopPlayback]);

  return {
    playText,
    stopPlayback,
    isPlaying,
    progress,
    error
  };
}
