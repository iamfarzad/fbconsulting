import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseGeminiAudioPlaybackProps {
  onPlaybackStart?: () => void;
  onPlaybackComplete?: () => void;
  onPlaybackError?: (error: string) => void;
}

interface AudioMetadata {
  totalSize: number;
  chunkSize: number;
}

/**
 * Hook to manage audio playback for Gemini services with improved streaming support
 */
export function useGeminiAudioPlayback({
  onPlaybackStart,
  onPlaybackComplete,
  onPlaybackError
}: UseGeminiAudioPlaybackProps = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const metadataRef = useRef<AudioMetadata | null>(null);
  const receivedBytesRef = useRef<number>(0);

  // Initialize AudioContext
  useEffect(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || 
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch (e) {
        console.error('Failed to create AudioContext:', e);
        setError('Failed to initialize audio system');
        if (onPlaybackError) {
          onPlaybackError('Failed to initialize audio system');
        }
      }
    }
    return () => {
      audioContextRef.current?.close();
    };
  }, [onPlaybackError]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    
    setIsPlaying(false);
    setProgress(0);
    audioChunksRef.current = [];
    metadataRef.current = null;
    receivedBytesRef.current = 0;
  }, []);

  // Handle audio metadata
  const handleAudioMetadata = useCallback((metadata: { total_size: number; chunk_size: number }) => {
    metadataRef.current = {
      totalSize: metadata.total_size,
      chunkSize: metadata.chunk_size
    };
    receivedBytesRef.current = 0;
    audioChunksRef.current = [];
  }, []);

  // Handle audio chunk
  const handleAudioChunk = useCallback((chunk: Blob) => {
    if (!metadataRef.current) {
      console.error('Received audio chunk without metadata');
      return;
    }

    audioChunksRef.current.push(chunk);
    receivedBytesRef.current += chunk.size;
    
    // Update progress
    const progress = (receivedBytesRef.current / metadataRef.current.totalSize) * 100;
    setProgress(Math.min(progress, 100));
    
    // If we have all the chunks, start playback automatically
    if (receivedBytesRef.current >= metadataRef.current.totalSize) {
      playAudioChunks();
    }
  }, []);

  // Play audio from chunks
  const playAudioChunks = useCallback(async () => {
    if (!audioContextRef.current || audioChunksRef.current.length === 0) {
      return;
    }

    try {
      // Combine all chunks into one blob
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

      // Resume audio context if suspended (browsers require user gesture)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Stop any currently playing audio
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      }

      sourceNodeRef.current = audioContextRef.current.createBufferSource();
      sourceNodeRef.current.buffer = audioBuffer;
      sourceNodeRef.current.connect(audioContextRef.current.destination);

      sourceNodeRef.current.onended = () => {
        setIsPlaying(false);
        setProgress(100);
        if (onPlaybackComplete) {
          onPlaybackComplete();
        }
      };

      setIsPlaying(true);
      if (onPlaybackStart) {
        onPlaybackStart();
      }
      
      sourceNodeRef.current.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
      setError(error instanceof Error ? error.message : 'Error playing audio');
      if (onPlaybackError) {
        onPlaybackError(error instanceof Error ? error.message : 'Error playing audio');
      }
    }
  }, [onPlaybackStart, onPlaybackComplete, onPlaybackError]);

  // Stop audio playback
  const stopAudio = useCallback(() => {
    cleanup();
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    isPlaying,
    error,
    progress,
    handleAudioChunk,
    handleAudioMetadata,
    playAudioChunks,
    stopAudio,
    clearAudio: cleanup
  };
}

export default useGeminiAudioPlayback;
