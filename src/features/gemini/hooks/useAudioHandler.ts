import { useState, useRef, useCallback } from 'react';

interface AudioHandlerOptions {
  autoPlay?: boolean;
  onPlaybackError?: (error: string) => void;
}

export function useAudioHandler({ 
  autoPlay = true,
  onPlaybackError 
}: AudioHandlerOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const audioContext = useRef<AudioContext | null>(null);
  const audioQueue = useRef<ArrayBuffer[]>([]);
  const audioSourceNode = useRef<AudioBufferSourceNode | null>(null);
  
  // Clear all audio data and stop playback
  const clearAudio = useCallback(() => {
    audioQueue.current = [];
    stopAudio();
  }, []);
  
  // Stop current audio playback
  const stopAudio = useCallback(() => {
    if (audioSourceNode.current) {
      try {
        audioSourceNode.current.stop();
        audioSourceNode.current.disconnect();
        audioSourceNode.current = null;
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
    }
    setIsPlaying(false);
    setProgress(0);
  }, []);
  
  // Initialize AudioContext if needed
  const getAudioContext = useCallback(() => {
    if (!audioContext.current) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContext.current = new AudioContext();
      } catch (error) {
        const errorMessage = 'Web Audio API is not supported in this browser';
        setError(errorMessage);
        if (onPlaybackError) onPlaybackError(errorMessage);
        return null;
      }
    }
    return audioContext.current;
  }, [onPlaybackError]);
  
  // Play the current audio queue
  const playAudioChunks = useCallback(async () => {
    const context = getAudioContext();
    if (!context) return;
    
    if (audioQueue.current.length === 0) {
      console.log('No audio chunks to play');
      return;
    }
    
    try {
      setIsPlaying(true);
      
      // Stop any current playback
      if (audioSourceNode.current) {
        audioSourceNode.current.stop();
        audioSourceNode.current.disconnect();
      }
      
      // Combine all audio chunks
      const combinedChunks = new Uint8Array(
        audioQueue.current.reduce((acc, chunk) => acc + chunk.byteLength, 0)
      );
      
      let offset = 0;
      audioQueue.current.forEach(chunk => {
        combinedChunks.set(new Uint8Array(chunk), offset);
        offset += chunk.byteLength;
      });
      
      // Decode audio data
      const audioBuffer = await context.decodeAudioData(combinedChunks.buffer);
      
      // Create and configure source node
      audioSourceNode.current = context.createBufferSource();
      audioSourceNode.current.buffer = audioBuffer;
      audioSourceNode.current.connect(context.destination);
      
      // Set up progress tracking
      const duration = audioBuffer.duration;
      const updateInterval = 100; // ms
      const progressInterval = setInterval(() => {
        if (!context) {
          clearInterval(progressInterval);
          return;
        }
        
        const currentTime = context.currentTime;
        const startTime = audioSourceNode.current?.startTime || 0;
        const elapsedTime = currentTime - startTime;
        const percent = Math.min(100, Math.floor((elapsedTime / duration) * 100));
        
        setProgress(percent);
        
        if (percent >= 100) {
          clearInterval(progressInterval);
          setIsPlaying(false);
          setProgress(0);
        }
      }, updateInterval);
      
      // Handle playback completion
      audioSourceNode.current.onended = () => {
        clearInterval(progressInterval);
        setIsPlaying(false);
        setProgress(0);
        audioSourceNode.current = null;
      };
      
      // Start playback
      audioSourceNode.current.start();
      audioSourceNode.current.startTime = context.currentTime;
      
      // Clear the queue after starting playback
      audioQueue.current = [];
      
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlaying(false);
      setProgress(0);
      
      const errorMessage = error instanceof Error ? error.message : 'Error playing audio';
      setError(errorMessage);
      if (onPlaybackError) onPlaybackError(errorMessage);
    }
  }, [getAudioContext, onPlaybackError]);
  
  // Handle audio chunk from WebSocket
  const handleAudioChunk = useCallback((chunk: ArrayBuffer) => {
    // Add chunk to queue
    audioQueue.current.push(chunk);
    
    // If autoPlay is enabled and not already playing, start playback
    if (autoPlay && !isPlaying) {
      playAudioChunks();
    }
  }, [autoPlay, isPlaying, playAudioChunks]);
  
  // Audio metadata handler (optional)
  const handleAudioMetadata = useCallback((metadata: any) => {
    // Handle any metadata about the audio if needed
    console.log('Audio metadata:', metadata);
  }, []);
  
  return {
    handleAudioChunk,
    handleAudioMetadata,
    isPlaying,
    progress,
    error,
    stopAudio,
    playAudioChunks,
    clearAudio
  };
}
