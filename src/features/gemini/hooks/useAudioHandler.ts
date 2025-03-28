
import { useState, useCallback, useRef, useEffect } from 'react';

interface UseAudioHandlerOptions {
  autoPlay?: boolean;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
  onPlaybackError?: (error: string) => void;
}

export function useAudioHandler({
  autoPlay = true,
  onPlaybackStart,
  onPlaybackEnd,
  onPlaybackError
}: UseAudioHandlerOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // References for audio handling
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<ArrayBuffer[]>([]);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const isDecodingRef = useRef<boolean>(false);
  const playbackQueueRef = useRef<AudioBuffer[]>([]);
  const currentStartTimeRef = useRef<number>(0);
  const playbackStartTimeRef = useRef<number>(0);
  
  // Clear all audio data
  const clearAudio = useCallback(() => {
    audioBuffersRef.current = [];
    playbackQueueRef.current = [];
    setProgress(0);
    
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
        audioSourceRef.current.disconnect();
        audioSourceRef.current = null;
      } catch (error) {
        console.error('Error stopping audio source:', error);
      }
    }
    
    setIsPlaying(false);
  }, []);
  
  // Stop current audio playback
  const stopAudio = useCallback(() => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
        audioSourceRef.current.disconnect();
        audioSourceRef.current = null;
        setIsPlaying(false);
        if (onPlaybackEnd) onPlaybackEnd();
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
    }
  }, [onPlaybackEnd]);
  
  // Handle incoming audio chunk
  const handleAudioChunk = useCallback((chunk: ArrayBuffer) => {
    if (!chunk || chunk.byteLength === 0) return;
    
    // Add to buffer
    audioBuffersRef.current.push(chunk);
    
    // If autoplay and not already playing or decoding, start decoding and playing
    if (autoPlay && !isPlaying && !isDecodingRef.current) {
      processAudioChunks();
    }
  }, [autoPlay, isPlaying]);
  
  // Process audio chunks and play them
  const processAudioChunks = useCallback(async () => {
    if (isDecodingRef.current || audioBuffersRef.current.length === 0) return;
    
    try {
      isDecodingRef.current = true;
      
      // Initialize AudioContext if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      // Get the chunk to process
      const chunk = audioBuffersRef.current.shift();
      if (!chunk) {
        isDecodingRef.current = false;
        return;
      }
      
      // Decode audio data
      const audioBuffer = await audioContextRef.current.decodeAudioData(chunk);
      playbackQueueRef.current.push(audioBuffer);
      
      // If not playing, start playback
      if (!isPlaying) {
        startPlayback();
      }
      
    } catch (error) {
      console.error('Error processing audio chunk:', error);
      setError(`Audio playback error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      if (onPlaybackError) onPlaybackError(`Error processing audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      isDecodingRef.current = false;
      
      // If more chunks are available, process them
      if (audioBuffersRef.current.length > 0) {
        processAudioChunks();
      }
    }
  }, [isPlaying, onPlaybackError]);
  
  // Start audio playback
  const startPlayback = useCallback(() => {
    if (!audioContextRef.current || playbackQueueRef.current.length === 0) return;
    
    try {
      // If already playing, do nothing
      if (isPlaying && audioSourceRef.current) return;
      
      const nextBuffer = playbackQueueRef.current.shift();
      if (!nextBuffer) return;
      
      // Create new source
      const source = audioContextRef.current.createBufferSource();
      source.buffer = nextBuffer;
      source.connect(audioContextRef.current.destination);
      
      // Set up ended handler to play next buffer
      source.onended = () => {
        if (playbackQueueRef.current.length > 0) {
          startPlayback();
        } else {
          setIsPlaying(false);
          setProgress(100);
          if (onPlaybackEnd) onPlaybackEnd();
        }
      };
      
      // Start playback
      source.start();
      audioSourceRef.current = source;
      setIsPlaying(true);
      setProgress(0);
      
      // Track start time for progress calculation
      currentStartTimeRef.current = audioContextRef.current.currentTime;
      playbackStartTimeRef.current = Date.now();
      
      if (onPlaybackStart) onPlaybackStart();
      
      // Start progress tracking
      trackProgress(nextBuffer.duration);
      
    } catch (error) {
      console.error('Error starting audio playback:', error);
      setError(`Audio playback error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      if (onPlaybackError) onPlaybackError(`Error playing audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Try the next buffer
      if (playbackQueueRef.current.length > 0) {
        startPlayback();
      }
    }
  }, [isPlaying, onPlaybackStart, onPlaybackEnd, onPlaybackError]);
  
  // Track playback progress
  const trackProgress = useCallback((duration: number) => {
    if (!isPlaying) return;
    
    const intervalId = setInterval(() => {
      if (!audioContextRef.current || !isPlaying) {
        clearInterval(intervalId);
        return;
      }
      
      const elapsed = (Date.now() - playbackStartTimeRef.current) / 1000;
      const calculatedProgress = Math.min(100, (elapsed / duration) * 100);
      
      setProgress(calculatedProgress);
      
      if (calculatedProgress >= 100) {
        clearInterval(intervalId);
      }
    }, 100);
    
    return () => clearInterval(intervalId);
  }, [isPlaying]);
  
  // Handle audio metadata
  const handleAudioMetadata = useCallback((metadata: { duration?: number; format?: string }) => {
    // Just log for now, we may need this later
    console.log('Received audio metadata:', metadata);
  }, []);
  
  // Play already buffered audio chunks
  const playAudioChunks = useCallback(() => {
    if (audioBuffersRef.current.length > 0 && !isPlaying) {
      processAudioChunks();
    }
  }, [isPlaying, processAudioChunks]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [stopAudio]);
  
  return {
    isPlaying,
    progress,
    error,
    handleAudioChunk,
    handleAudioMetadata,
    stopAudio,
    playAudioChunks,
    clearAudio
  };
}
