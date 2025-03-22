
import { useState, useCallback, useEffect } from 'react';

interface UseGeminiAudioPlaybackOptions {
  onPlaybackComplete?: () => void;
  onPlaybackError?: (error: Error) => void;
}

/**
 * Hook for managing audio playback from Gemini API
 */
const useGeminiAudioPlayback = (options: UseGeminiAudioPlaybackOptions = {}) => {
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Clean up audio element on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        URL.revokeObjectURL(audioElement.src);
      }
    };
  }, [audioElement]);

  // Play audio blob
  const playAudio = useCallback(async (audioBlob: Blob) => {
    try {
      setError('');
      setAudioData(audioBlob);
      
      // Create URL for audio blob
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create and configure audio element
      const audio = new Audio(audioUrl);
      setAudioElement(audio);
      
      // Set up event listeners
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(100);
        options.onPlaybackComplete?.();
        URL.revokeObjectURL(audioUrl);
      });
      
      audio.addEventListener('error', (e) => {
        const error = new Error(`Audio playback error: ${e.type}`);
        setError(error.message);
        setIsPlaying(false);
        options.onPlaybackError?.(error);
        URL.revokeObjectURL(audioUrl);
      });
      
      audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
          const progressValue = (audio.currentTime / audio.duration) * 100;
          setProgress(progressValue);
        }
      });
      
      // Start playback
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown audio playback error';
      setError(errorMessage);
      options.onPlaybackError?.(new Error(errorMessage));
      setIsPlaying(false);
    }
  }, [options]);

  // Stop audio playback
  const stopAudio = useCallback(() => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
      
      if (audioElement.src) {
        URL.revokeObjectURL(audioElement.src);
      }
    }
  }, [audioElement]);

  return {
    isPlaying,
    error,
    progress,
    playAudio,
    stopAudio
  };
};

export default useGeminiAudioPlayback;
