
import { useState, useRef, useCallback, useEffect } from 'react';

interface UseGeminiAudioPlaybackOptions {
  onPlaybackError?: (error: string) => void;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
}

export function useGeminiAudioPlayback(options: UseGeminiAudioPlaybackOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioChunksRef = useRef<ArrayBuffer[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Handle audio metadata
  const handleAudioMetadata = useCallback((_: any) => {
    // Not implemented yet, will handle audio metadata in the future
    console.log('Audio metadata received');
  }, []);

  // Handle audio chunks
  const handleAudioChunk = useCallback((buffer: ArrayBuffer) => {
    if (buffer.byteLength === 0) {
      console.warn('Received empty audio chunk');
      return;
    }
    
    audioChunksRef.current.push(buffer);
    
    // If not currently playing, play the first chunk
    if (!isPlaying && audioChunksRef.current.length === 1) {
      playAudioChunks();
    }
  }, [isPlaying]);

  // Play audio chunks
  const playAudioChunks = useCallback(async () => {
    if (audioChunksRef.current.length === 0) {
      console.log('No audio chunks to play');
      return;
    }
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      // Stop any existing playback
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping an already stopped source
        }
      }
      
      // Concatenate all chunks into a single buffer
      const totalLength = audioChunksRef.current.reduce((acc, chunk) => acc + chunk.byteLength, 0);
      const combinedBuffer = new Uint8Array(totalLength);
      let offset = 0;
      
      for (const chunk of audioChunksRef.current) {
        combinedBuffer.set(new Uint8Array(chunk), offset);
        offset += chunk.byteLength;
      }
      
      // Decode the audio data
      const audioBuffer = await audioContextRef.current.decodeAudioData(combinedBuffer.buffer);
      
      // Play the audio
      audioSourceRef.current = audioContextRef.current.createBufferSource();
      audioSourceRef.current.buffer = audioBuffer;
      audioSourceRef.current.connect(audioContextRef.current.destination);
      
      durationRef.current = audioBuffer.duration;
      startTimeRef.current = audioContextRef.current.currentTime;
      
      setIsPlaying(true);
      setProgress(0);
      
      if (options.onPlaybackStart) {
        options.onPlaybackStart();
      }
      
      // Start progress tracking
      updateProgress();
      
      audioSourceRef.current.onended = () => {
        setIsPlaying(false);
        setProgress(100);
        audioSourceRef.current = null;
        
        if (options.onPlaybackEnd) {
          options.onPlaybackEnd();
        }
        
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      };
      
      audioSourceRef.current.start();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown audio playback error';
      console.error('Audio playback error:', errorMessage);
      setError(errorMessage);
      setIsPlaying(false);
      
      if (options.onPlaybackError) {
        options.onPlaybackError(errorMessage);
      }
    }
  }, [options]);

  // Update progress during playback
  const updateProgress = useCallback(() => {
    if (!audioContextRef.current || !isPlaying || durationRef.current <= 0) {
      return;
    }
    
    const elapsed = audioContextRef.current.currentTime - startTimeRef.current;
    const progressPercent = Math.min(100, Math.round((elapsed / durationRef.current) * 100));
    
    setProgress(progressPercent);
    
    if (progressPercent < 100) {
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    }
  }, [isPlaying]);

  // Stop audio playback
  const stopAudio = useCallback(() => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
      } catch (e) {
        // Ignore errors when stopping an already stopped source
      }
    }
    
    setIsPlaying(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (options.onPlaybackEnd) {
      options.onPlaybackEnd();
    }
  }, [options]);

  // Clear audio data
  const clearAudio = useCallback(() => {
    stopAudio();
    audioChunksRef.current = [];
    setProgress(0);
  }, [stopAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping an already stopped source
        }
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);

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
