
import { useState, useRef, useCallback } from 'react';

interface UseGeminiAudioPlaybackProps {
  onPlaybackError?: (error: string) => void;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
}

type AudioMetadata = {
  format: string;
  duration?: number;
  sampleRate?: number;
};

export interface AudioMessage {
  data: Blob | ArrayBuffer;
  metadata?: AudioMetadata;
}

export const DEFAULT_AUDIO_CONFIG = {
  volume: 1.0,
  autoPlay: true,
};

/**
 * Hook to handle Gemini audio playback
 */
export function useGeminiAudioPlayback({
  onPlaybackError,
  onPlaybackStart,
  onPlaybackEnd
}: UseGeminiAudioPlaybackProps = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioMetadata, setAudioMetadata] = useState<AudioMetadata | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Create audio element on first use
  const getAudioElement = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
        if (onPlaybackEnd) onPlaybackEnd();
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          const currentProgress = 
            (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(currentProgress);
        }
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        setError('Failed to play audio');
        setIsPlaying(false);
        if (onPlaybackError) onPlaybackError('Audio playback failed');
      });
    }
    
    return audioRef.current;
  }, [onPlaybackEnd, onPlaybackError]);
  
  // Handle incoming audio chunks
  const handleAudioChunk = useCallback((chunk: Blob) => {
    audioChunksRef.current.push(chunk);
  }, []);
  
  // Handle audio metadata
  const handleAudioMetadata = useCallback((metadata: AudioMetadata) => {
    setAudioMetadata(metadata);
  }, []);
  
  // Play audio from collected chunks
  const playAudioChunks = useCallback(() => {
    try {
      if (audioChunksRef.current.length === 0) {
        console.warn('No audio chunks to play');
        return false;
      }
      
      const audioBlob = new Blob(audioChunksRef.current, { 
        type: audioMetadata?.format || 'audio/mpeg' 
      });
      
      const audio = getAudioElement();
      audio.src = URL.createObjectURL(audioBlob);
      audio.volume = DEFAULT_AUDIO_CONFIG.volume;
      
      // Reset progress
      setProgress(0);
      
      const playPromise = audio.play();
      if (playPromise) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setError(null);
            if (onPlaybackStart) onPlaybackStart();
          })
          .catch(err => {
            console.error('Error playing audio:', err);
            setIsPlaying(false);
            setError('Failed to play audio: ' + err.message);
            if (onPlaybackError) onPlaybackError(err.message);
          });
      }
      
      return true;
    } catch (err) {
      console.error('Error in playAudioChunks:', err);
      setError('Failed to prepare audio for playback');
      if (onPlaybackError) onPlaybackError('Failed to prepare audio');
      return false;
    }
  }, [audioMetadata, getAudioElement, onPlaybackError, onPlaybackStart]);
  
  // Stop audio playback
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
      if (onPlaybackEnd) onPlaybackEnd();
    }
  }, [onPlaybackEnd]);
  
  // Clear all audio data
  const clearAudio = useCallback(() => {
    audioChunksRef.current = [];
    setAudioMetadata(null);
    stopAudio();
  }, [stopAudio]);
  
  return {
    isPlaying,
    progress,
    error,
    audioMetadata,
    handleAudioChunk,
    handleAudioMetadata,
    playAudioChunks,
    stopAudio,
    clearAudio
  };
}

export default useGeminiAudioPlayback;
