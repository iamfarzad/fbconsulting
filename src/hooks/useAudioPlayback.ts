import { useState, useCallback, useRef, useEffect } from 'react';
import { textToSpeech } from '@/services/gemini/audio';
import { DEFAULT_CONFIG } from '@/types/gemini';

export function useAudioPlayback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const generateAndPlayAudio = useCallback(async (text: string): Promise<void> => {
    try {
      setError(null);
      
      // Generate audio blob using Gemini TTS
      const audioBlob = await textToSpeech(text, DEFAULT_CONFIG);
      
      // Create audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      // Set up audio element event handlers
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setProgress(0);
      };
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(percentage);
        }
      };
      audioRef.current.onerror = () => {
        setError('Error playing audio');
        setIsPlaying(false);
        setProgress(0);
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
      console.error('Error generating/playing audio:', error);
      setError(error instanceof Error ? error.message : 'Error playing audio');
      setIsPlaying(false);
      setProgress(0);
    }
  }, []);

  return {
    isPlaying,
    progress,
    error,
    stopAudio,
    generateAndPlayAudio,
  };
}
