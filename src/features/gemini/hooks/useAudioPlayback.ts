
import { useState, useRef, useCallback, useEffect } from 'react';

interface UseAudioPlaybackOptions {
  autoPlay?: boolean;
  onPlaybackError?: (error: string) => void;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
}

export function useAudioPlayback(options: UseAudioPlaybackOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioChunksRef = useRef<ArrayBuffer[]>([]);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize AudioContext on first interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (err) {
        const errorMsg = 'Could not initialize audio context. Audio playback is not supported.';
        setError(errorMsg);
        if (options.onPlaybackError) {
          options.onPlaybackError(errorMsg);
        }
      }
    }
    return audioContextRef.current;
  }, [options]);

  // Function to handle received audio chunks
  const handleAudioChunk = useCallback((chunk: ArrayBuffer) => {
    audioChunksRef.current.push(chunk);
    
    // Auto-play the first chunk if enabled and not already playing
    if (options.autoPlay && !isPlaying && audioChunksRef.current.length === 1) {
      playAudioChunks();
    }
  }, [options.autoPlay, isPlaying]);

  // Function to play received audio chunks
  const playAudioChunks = useCallback(async () => {
    if (audioChunksRef.current.length === 0) {
      return;
    }

    try {
      const audioContext = initAudioContext();
      if (!audioContext) return;

      // Combine all chunks into a single buffer
      const combinedLength = audioChunksRef.current.reduce((acc, chunk) => acc + chunk.byteLength, 0);
      const combinedBuffer = new Uint8Array(combinedLength);
      
      let offset = 0;
      for (const chunk of audioChunksRef.current) {
        combinedBuffer.set(new Uint8Array(chunk), offset);
        offset += chunk.byteLength;
      }

      // Decode the audio data
      setIsPlaying(true);
      if (options.onPlaybackStart) {
        options.onPlaybackStart();
      }

      const audioBuffer = await audioContext.decodeAudioData(combinedBuffer.buffer);
      
      // Create and connect audio source
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      // Store reference to stop later if needed
      audioSourceRef.current = source;
      
      // Set up ended event
      source.onended = () => {
        setIsPlaying(false);
        setProgress(1);
        audioSourceRef.current = null;
        if (options.onPlaybackEnd) {
          options.onPlaybackEnd();
        }
      };

      // Track progress
      const startTime = audioContext.currentTime;
      const duration = audioBuffer.duration;
      
      const progressInterval = setInterval(() => {
        if (audioContext.state === 'running') {
          const elapsed = audioContext.currentTime - startTime;
          const progressValue = Math.min(elapsed / duration, 1);
          setProgress(progressValue);
          
          if (progressValue >= 1) {
            clearInterval(progressInterval);
          }
        }
      }, 100);

      // Start playback
      source.start();
    } catch (err) {
      const errorMsg = `Error playing audio: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(errorMsg);
      setIsPlaying(false);
      if (options.onPlaybackError) {
        options.onPlaybackError(errorMsg);
      }
    }
  }, [initAudioContext, options]);

  // Function to stop audio playback
  const stopAudio = useCallback(() => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
        setIsPlaying(false);
      } catch (err) {
        console.error('Error stopping audio:', err);
      }
    }
  }, []);

  // Function to clear audio chunks
  const clearAudio = useCallback(() => {
    stopAudio();
    audioChunksRef.current = [];
    setProgress(0);
  }, [stopAudio]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [stopAudio]);

  return {
    isPlaying,
    progress,
    error,
    handleAudioChunk,
    playAudioChunks,
    stopAudio,
    clearAudio
  };
}
