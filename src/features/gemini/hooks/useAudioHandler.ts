
import { useState, useRef, useCallback, useEffect } from 'react';

interface UseAudioHandlerProps {
  autoPlay?: boolean;
  onPlaybackError?: (error: string) => void;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
}

export function useAudioHandler({
  autoPlay = true,
  onPlaybackError,
  onPlaybackStart,
  onPlaybackEnd
}: UseAudioHandlerProps = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const audioContext = useRef<AudioContext | null>(null);
  const audioQueue = useRef<ArrayBuffer[]>([]);
  const audioBuffers = useRef<AudioBuffer[]>([]);
  const audioSource = useRef<AudioBufferSourceNode | null>(null);
  const startTime = useRef<number>(0);
  const duration = useRef<number>(0);
  const requestRef = useRef<number | null>(null);
  const processingChunk = useRef(false);
  
  // Initialize audio context
  const initAudioContext = useCallback(() => {
    if (!audioContext.current) {
      try {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.error('Failed to create AudioContext:', error);
        setError('Your browser does not support audio playback');
        if (onPlaybackError) onPlaybackError('Your browser does not support audio playback');
      }
    }
    return audioContext.current;
  }, [onPlaybackError]);
  
  // Process audio chunk - decode and add to buffer queue
  const processAudioChunk = useCallback(async (chunk: ArrayBuffer) => {
    if (processingChunk.current) return;
    processingChunk.current = true;
    
    try {
      const context = initAudioContext();
      if (!context) return;
      
      // Store the raw chunk for playback
      audioQueue.current.push(chunk);
      
      // If we're not playing and autoPlay is true, start playing
      if (!isPlaying && autoPlay && audioQueue.current.length === 1) {
        playAudioChunks();
      }
    } catch (error) {
      console.error('Error processing audio chunk:', error);
      setError(`Error processing audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
      if (onPlaybackError) onPlaybackError(`Error processing audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      processingChunk.current = false;
    }
  }, [isPlaying, autoPlay, initAudioContext, onPlaybackError]);
  
  // Handle new audio chunk
  const handleAudioChunk = useCallback((chunk: ArrayBuffer) => {
    // If the AudioContext is suspended, resume it on user interaction
    if (audioContext.current?.state === 'suspended') {
      audioContext.current.resume();
    }
    
    processAudioChunk(chunk);
  }, [processAudioChunk]);
  
  // Play all audio chunks in the queue
  const playAudioChunks = useCallback(async () => {
    if (isPlaying || audioQueue.current.length === 0) return;
    
    try {
      const context = initAudioContext();
      if (!context) return;
      
      // Resume context if suspended - needed for some browsers
      if (context.state === 'suspended') {
        await context.resume();
      }
      
      setIsPlaying(true);
      if (onPlaybackStart) onPlaybackStart();
      
      // Decode each chunk and create a sequence of audio buffers
      audioBuffers.current = [];
      for (const chunk of audioQueue.current) {
        try {
          const audioBuffer = await context.decodeAudioData(chunk.slice(0));
          audioBuffers.current.push(audioBuffer);
        } catch (error) {
          console.error('Error decoding audio data:', error);
        }
      }
      
      // If we have no valid buffers, exit
      if (audioBuffers.current.length === 0) {
        setIsPlaying(false);
        setError('No valid audio data to play');
        if (onPlaybackError) onPlaybackError('No valid audio data to play');
        return;
      }
      
      // Calculate total duration
      duration.current = audioBuffers.current.reduce((total, buffer) => total + buffer.duration, 0);
      startTime.current = context.currentTime;
      
      // Play each buffer in sequence
      let currentStartTime = context.currentTime;
      
      audioBuffers.current.forEach((buffer, index) => {
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        
        if (index === 0) {
          audioSource.current = source;
        }
        
        source.start(currentStartTime);
        currentStartTime += buffer.duration;
        
        // Set an onended handler for the last buffer
        if (index === audioBuffers.current.length - 1) {
          source.onended = () => {
            setIsPlaying(false);
            setProgress(1); // 100% complete
            if (onPlaybackEnd) onPlaybackEnd();
          };
        }
      });
      
      // Start progress tracking
      requestRef.current = requestAnimationFrame(updateProgress);
    } catch (error) {
      console.error('Error playing audio chunks:', error);
      setIsPlaying(false);
      setError(`Failed to play audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
      if (onPlaybackError) onPlaybackError(`Failed to play audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [isPlaying, initAudioContext, onPlaybackStart, onPlaybackError, onPlaybackEnd]);
  
  // Stop current audio playback
  const stopAudio = useCallback(() => {
    if (!isPlaying) return;
    
    try {
      if (audioSource.current) {
        audioSource.current.onended = null;
        audioSource.current.stop();
        audioSource.current = null;
      }
      
      if (audioContext.current) {
        // Stop all active sources
        audioBuffers.current.forEach((_, index) => {
          const source = audioContext.current?.createBufferSource();
          if (source) source.stop();
        });
      }
      
      // Stop animation frame
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      
      setIsPlaying(false);
      if (onPlaybackEnd) onPlaybackEnd();
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }, [isPlaying, onPlaybackEnd]);
  
  // Clear all audio data
  const clearAudio = useCallback(() => {
    stopAudio();
    audioQueue.current = [];
    audioBuffers.current = [];
    setProgress(0);
    setError(null);
  }, [stopAudio]);
  
  // Update progress during playback
  const updateProgress = useCallback(() => {
    if (!audioContext.current || !isPlaying) return;
    
    const currentTime = audioContext.current.currentTime - startTime.current;
    const totalDuration = duration.current;
    
    if (totalDuration > 0) {
      const progressValue = Math.min(currentTime / totalDuration, 1);
      setProgress(progressValue);
    }
    
    if (currentTime < totalDuration) {
      requestRef.current = requestAnimationFrame(updateProgress);
    } else {
      setProgress(1);
      setIsPlaying(false);
    }
  }, [isPlaying]);
  
  // Process audio metadata
  const handleAudioMetadata = useCallback((metadata: any) => {
    console.log('Audio metadata received:', metadata);
    // You can set duration or other metadata properties here
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, [stopAudio]);
  
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

export default useAudioHandler;
