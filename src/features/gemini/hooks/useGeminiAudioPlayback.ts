
import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseGeminiAudioPlaybackOptions {
  onPlaybackComplete?: () => void;
  onPlaybackError?: (error: string) => void;
}

export function useGeminiAudioPlayback(options: UseGeminiAudioPlaybackOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioElementRef.current = new Audio();
      
      const audioElement = audioElementRef.current;
      
      // Set up event listeners
      audioElement.addEventListener('play', () => setIsPlaying(true));
      audioElement.addEventListener('pause', () => setIsPlaying(false));
      audioElement.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(100);
        if (options.onPlaybackComplete) {
          options.onPlaybackComplete();
        }
      });
      audioElement.addEventListener('timeupdate', () => {
        if (audioElement.duration) {
          setCurrentTime(audioElement.currentTime);
          setProgress((audioElement.currentTime / audioElement.duration) * 100);
        }
      });
      audioElement.addEventListener('durationchange', () => {
        setDuration(audioElement.duration);
      });
      audioElement.addEventListener('error', (e) => {
        const errorMessage = 'Audio playback error';
        setError(errorMessage);
        if (options.onPlaybackError) {
          options.onPlaybackError(errorMessage);
        }
      });
      
      // Clean up event listeners on unmount
      return () => {
        audioElement.pause();
        audioElement.src = '';
        audioElement.removeEventListener('play', () => setIsPlaying(true));
        audioElement.removeEventListener('pause', () => setIsPlaying(false));
        audioElement.removeEventListener('ended', () => {
          setIsPlaying(false);
          if (options.onPlaybackComplete) {
            options.onPlaybackComplete();
          }
        });
        audioElement.removeEventListener('timeupdate', () => {});
        audioElement.removeEventListener('durationchange', () => {});
        audioElement.removeEventListener('error', () => {});
      };
    }
  }, [options]);
  
  // Handle audio chunks
  const handleAudioChunk = useCallback((chunk: Blob) => {
    audioChunksRef.current.push(chunk);
  }, []);
  
  // Handle audio metadata
  const handleAudioMetadata = useCallback((metadata: {size: number}) => {
    // Handle metadata if needed
  }, []);
  
  // Play audio from accumulated chunks
  const playAudioChunks = useCallback(() => {
    if (audioChunksRef.current.length === 0) {
      if (options.onPlaybackError) {
        options.onPlaybackError('No audio data available');
      }
      return;
    }
    
    try {
      // Create a combined audio blob
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioElementRef.current) {
        audioElementRef.current.src = audioUrl;
        audioElementRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          if (options.onPlaybackError) {
            options.onPlaybackError('Failed to play audio');
          }
        });
      }
    } catch (error) {
      console.error('Error playing audio chunks:', error);
      setError('Failed to play audio');
      if (options.onPlaybackError) {
        options.onPlaybackError('Failed to play audio');
      }
    }
  }, [options]);
  
  // Stop audio playback
  const stopAudio = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  }, []);
  
  // Clear audio data
  const clearAudio = useCallback(() => {
    audioChunksRef.current = [];
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
    }
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
  }, []);
  
  return {
    handleAudioChunk,
    handleAudioMetadata,
    isPlaying,
    progress,
    error,
    duration,
    currentTime,
    playAudioChunks,
    stopAudio,
    clearAudio
  };
}

// Make sure to export the main hook
export default useGeminiAudioPlayback;
