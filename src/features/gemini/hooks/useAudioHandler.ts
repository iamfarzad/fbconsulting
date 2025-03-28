
import { useState, useRef, useCallback, useEffect } from 'react';

interface AudioHandlerOptions {
  autoPlay?: boolean;
  onPlaybackError?: (error: string) => void;
}

export function useAudioHandler(options: AudioHandlerOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const audioContext = useRef<AudioContext | null>(null);
  const audioQueue = useRef<ArrayBuffer[]>([]);
  const sourceNode = useRef<AudioBufferSourceNode | null>(null);
  const isProcessing = useRef(false);
  
  // Initialize audio context
  const initAudioContext = useCallback(() => {
    if (!audioContext.current) {
      try {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        const errorMessage = `Failed to create AudioContext: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMessage);
        setError(errorMessage);
        if (options.onPlaybackError) {
          options.onPlaybackError(errorMessage);
        }
      }
    }
    return audioContext.current;
  }, [options]);
  
  // Play a decoded audio buffer
  const playAudioBuffer = useCallback((audioBuffer: AudioBuffer) => {
    if (!audioContext.current) return;
    
    // Stop any currently playing audio
    if (sourceNode.current) {
      try {
        sourceNode.current.stop();
      } catch (e) {
        // Ignore errors from stopping already stopped sources
      }
    }
    
    try {
      // Create new source
      sourceNode.current = audioContext.current.createBufferSource();
      sourceNode.current.buffer = audioBuffer;
      sourceNode.current.connect(audioContext.current.destination);
      
      // Set up event handlers
      sourceNode.current.onended = () => {
        setIsPlaying(false);
        setProgress(100); // Mark as complete
        
        // Try to play the next chunk if there is one
        setTimeout(() => {
          processAudioQueue();
        }, 50);
      };
      
      // Play the audio
      sourceNode.current.start(0);
      setIsPlaying(true);
      setProgress(0);
      
      // Update progress while playing
      const duration = audioBuffer.duration;
      let startTime = audioContext.current.currentTime;
      
      const updateProgress = () => {
        if (!audioContext.current || !sourceNode.current) return;
        
        const elapsed = audioContext.current.currentTime - startTime;
        const progressPercent = Math.min((elapsed / duration) * 100, 100);
        
        setProgress(progressPercent);
        
        if (progressPercent < 100 && isPlaying) {
          requestAnimationFrame(updateProgress);
        }
      };
      
      requestAnimationFrame(updateProgress);
    } catch (error) {
      const errorMessage = `Error playing audio: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMessage);
      setIsPlaying(false);
      setError(errorMessage);
      if (options.onPlaybackError) {
        options.onPlaybackError(errorMessage);
      }
    }
  }, [isPlaying, options]);
  
  // Process audio chunks in the queue
  const processAudioQueue = useCallback(async () => {
    if (isProcessing.current || audioQueue.current.length === 0) {
      return;
    }
    
    const context = initAudioContext();
    if (!context) return;
    
    isProcessing.current = true;
    
    try {
      const audioData = audioQueue.current.shift();
      if (!audioData) {
        isProcessing.current = false;
        return;
      }
      
      // Decode the audio data
      const audioBuffer = await context.decodeAudioData(audioData.slice(0));
      playAudioBuffer(audioBuffer);
    } catch (error) {
      const errorMessage = `Error decoding audio: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMessage);
      setError(errorMessage);
      if (options.onPlaybackError) {
        options.onPlaybackError(errorMessage);
      }
    } finally {
      isProcessing.current = false;
    }
  }, [initAudioContext, playAudioBuffer, options]);
  
  // Handle new audio chunks
  const handleAudioChunk = useCallback((audioChunk: ArrayBuffer) => {
    if (!audioChunk || audioChunk.byteLength === 0) {
      console.warn('Received empty audio chunk');
      return;
    }
    
    audioQueue.current.push(audioChunk);
    
    // If not currently processing the queue, start
    if (!isProcessing.current && options.autoPlay !== false) {
      processAudioQueue();
    }
  }, [processAudioQueue, options.autoPlay]);
  
  // Stop audio playback
  const stopAudio = useCallback(() => {
    if (sourceNode.current) {
      try {
        sourceNode.current.stop();
        sourceNode.current = null;
      } catch (e) {
        // Ignore errors from stopping already stopped sources
      }
    }
    setIsPlaying(false);
  }, []);
  
  // Clear all audio
  const clearAudio = useCallback(() => {
    stopAudio();
    audioQueue.current = [];
    setProgress(0);
  }, [stopAudio]);
  
  // Resume audio context if needed (for autoplay policy)
  const resumeAudioContextIfNeeded = useCallback(() => {
    if (audioContext.current?.state === 'suspended') {
      audioContext.current.resume();
    }
  }, []);
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (sourceNode.current) {
        try {
          sourceNode.current.stop();
          sourceNode.current.disconnect();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
      
      if (audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
      }
    };
  }, []);
  
  return {
    handleAudioChunk,
    isPlaying,
    progress,
    error,
    stopAudio,
    clearAudio,
    resumeAudioContext: resumeAudioContextIfNeeded
  };
}
