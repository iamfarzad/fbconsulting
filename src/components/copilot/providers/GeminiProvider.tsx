import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useToast } from '../../../hooks/use-toast';
import API_CONFIG from '../../../config/apiConfig';
import { v4 as uuidv4 } from 'uuid'; 

// --- Types ---
interface ProviderMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
}

interface AudioOptions {
  voice_name?: string;
  language_code?: string;
}

interface OutgoingWebSocketMessage { 
  type: 'text_message' | 'multimodal_message'; 
  text?: string | null; 
  files?: Array<{ mime_type: string; data: string; filename?: string }>; 
  role?: string; 
  enableTTS?: boolean; 
  audioOptions?: AudioOptions;
}

interface IncomingWebSocketMessage { 
  type: string; 
  content?: string; 
  error?: string; 
  status?: string; 
  size?: number; 
  format?: string; 
  audio?: ArrayBuffer;
}

interface GeminiContextType { 
  sendMessage: (message: OutgoingWebSocketMessage) => Promise<void>; 
  messages: ProviderMessage[]; 
  isConnected: boolean; 
  isConnecting: boolean; 
  isProcessing: boolean;
  isPlaying: boolean;
  error: string | null; 
  resetError: () => void; 
  reconnect: () => void; 
  clearMessages: () => void;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  isRecording: boolean;
  stopAudio: () => void;
}

const GeminiContext = createContext<GeminiContextType | null>(null);

export const useGemini = () => {
  const context = useContext(GeminiContext);
  if (!context) throw new Error('useGemini must be used within a GeminiProvider');
  return context;
};

interface GeminiProviderProps { children: ReactNode; }

export const GeminiProvider: React.FC<GeminiProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ProviderMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const clientIdRef = useRef<string>(uuidv4());
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Function declarations first
  const sendMessage = useCallback(async (message: OutgoingWebSocketMessage) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError('Not connected');
      reconnect();
      throw new Error('WS not connected');
    }
    setIsProcessing(true);
    setError(null);
    return new Promise<void>((res, rej) => {
      try {
        console.log("[GeminiProvider] Sending:", message);
        wsRef.current?.send(JSON.stringify(message));
        res();
      } catch (e) {
        console.error('Send Error:', e);
        setError('Failed to send');
        setIsProcessing(false);
        rej(e);
      }
    });
  }, []);

  // Audio Context Initialization
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    } else if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // Handle incoming audio chunks
  const handleAudioChunk = useCallback((chunk: ArrayBuffer) => {
    if (!chunk || chunk.byteLength === 0) return;

    try {
      const context = initAudioContext();
      setIsPlaying(true);

      context.decodeAudioData(chunk, (buffer) => {
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        source.start(0);

        source.onended = () => {
          setIsPlaying(false);
        };
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  }, [initAudioContext]);

  // Stop audio playback
  const stopAudio = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.suspend();
    }
    setIsPlaying(false);
  }, []);

  // Start audio recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });

      mediaRecorder.addEventListener('stop', async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        try {
          const arrayBuffer = await audioBlob.arrayBuffer();
          const base64Audio = btoa(
            new Uint8Array(arrayBuffer).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          );

          await sendMessage({
            type: 'multimodal_message',
            files: [{
              mime_type: 'audio/wav',
              data: base64Audio,
              filename: 'recording.wav'
            }]
          });
        } catch (error) {
          console.error('Error processing recording:', error);
          setError('Failed to process recording');
        }
        stream.getTracks().forEach(track => track.stop());
      });

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to start recording');
    }
  }, [sendMessage]);

  // Stop audio recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    if (isConnecting || wsRef.current?.readyState === WebSocket.OPEN) return;
    if (reconnectTimeoutRef.current) window.clearTimeout(reconnectTimeoutRef.current);
    
    setIsConnecting(true);
    setError(null);
    
    const wsUrl = `${API_CONFIG.WS_BASE_URL}${API_CONFIG.WEBSOCKET.PATH}${clientIdRef.current}`;
    console.log('[GeminiProvider] Connecting to:', wsUrl);
    
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('[GeminiProvider] WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = async (event) => {
        try {
          if (event.data instanceof Blob) {
            const arrayBuffer = await event.data.arrayBuffer();
            handleAudioChunk(arrayBuffer);
            return;
          }

          const data = JSON.parse(event.data) as IncomingWebSocketMessage;
          console.log('[GeminiProvider] Received message:', data);

          if (data.audio) {
            handleAudioChunk(data.audio);
            return;
          }

          setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            if (data.type === 'text' && data.content) {
              if (lastMsg?.role === 'assistant' && isProcessing) {
                const updated = [...prev];
                updated[prev.length-1] = { ...lastMsg, content: data.content };
                return updated;
              } else {
                setIsProcessing(true);
                return [...prev, { id: uuidv4(), role: 'assistant', content: data.content, timestamp: Date.now() }];
              }
            } else if (data.type === 'error' && data.error) {
              return [...prev, { id: uuidv4(), role: 'error', content: data.error, timestamp: Date.now() }];
            }
            return prev;
          });

          if (data.type === 'complete') {
            setIsProcessing(false);
          } else if (data.type === 'error' && data.error) {
            setError(data.error);
            setIsProcessing(false);
            toast({
              title: 'Server Error',
              description: data.error,
              variant: 'destructive'
            });
          }
        } catch (e) {
          console.error('[GeminiProvider] Failed to parse message:', e, event.data);
        }
      };

      ws.onerror = (event) => {
        console.error('[GeminiProvider] WebSocket error:', event);
        setError('Connection error occurred.');
        setIsConnected(false);
        setIsConnecting(false);
      };

      ws.onclose = (event) => {
        console.log(`[GeminiProvider] WebSocket closed (Code: ${event.code})`);
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;

        if (event.code !== 1000 && reconnectAttemptsRef.current < API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          const delay = API_CONFIG.WEBSOCKET.RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current - 1);
          console.log(`[GeminiProvider] Reconnecting attempt ${reconnectAttemptsRef.current} in ${delay}ms...`);
          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connectWebSocket();
          }, delay);
        } else if (event.code !== 1000) {
          setError('Failed to reconnect.');
          toast({
            title: 'Connection Lost',
            description: 'Could not reconnect.',
            variant: 'destructive'
          });
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('[GeminiProvider] Error creating WebSocket:', err);
      setIsConnecting(false);
      setError('Failed to create WebSocket');
    }
  }, [isConnecting, isProcessing, handleAudioChunk, toast]);

  const reconnect = useCallback(() => {
    console.log('[GeminiProvider] Manual reconnect.');
    if (wsRef.current) wsRef.current.close(1000);
    reconnectAttemptsRef.current = 0;
    setError(null);
    setIsProcessing(false);
    connectWebSocket();
  }, [connectWebSocket]);

  useEffect(() => {
    connectWebSocket();
    const ping = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, API_CONFIG.DEFAULT_PING_INTERVAL);

    return () => {
      clearInterval(ping);
      if (reconnectTimeoutRef.current) window.clearTimeout(reconnectTimeoutRef.current);
      wsRef.current?.close(1000);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [connectWebSocket]);

  const resetError = useCallback(() => setError(null), []);
  const clearMessages = useCallback(() => setMessages([]), []);

  const value: GeminiContextType = {
    sendMessage,
    messages,
    isConnected,
    isConnecting,
    isProcessing,
    isPlaying,
    isRecording,
    error,
    resetError,
    reconnect,
    clearMessages,
    startRecording,
    stopRecording,
    stopAudio
  };

  return (
    <GeminiContext.Provider value={value}>
      {children}
    </GeminiContext.Provider>
  );
};
