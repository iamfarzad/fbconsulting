
import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import API_CONFIG from '@/config/apiConfig'; 
import { v4 as uuidv4 } from 'uuid'; 

// Define Message structure (can be moved to types later)
interface ProviderMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  // Add other relevant fields like files for display?
}

// Define WebSocket message format for outgoing messages
interface OutgoingWebSocketMessage {
  type: 'text_message' | 'multimodal_message';
  text?: string | null;
  files?: Array<{ mime_type: string; data: string; filename?: string }>; // Base64 data
  role?: string;
  enableTTS?: boolean;
}

// Define structure for incoming messages (simplified)
interface IncomingWebSocketMessage {
  type: string;
  content?: string;
  error?: string;
  status?: string;
  // Add fields for audio info if needed
  size?: number;
  format?: string;
}


interface GeminiContextType {
  sendMessage: (message: OutgoingWebSocketMessage) => Promise<void>; // Accept full message object
  messages: ProviderMessage[]; // Expose messages
  isConnected: boolean;
  isConnecting: boolean;
  isProcessing: boolean; // Add processing state
  error: string | null;
  resetError: () => void;
  reconnect: () => void;
  clearMessages: () => void; // Add clear messages function
  // TODO: Add audio state/controls if needed
}

const GeminiContext = createContext<GeminiContextType | null>(null);

export const useGemini = () => {
  const context = useContext(GeminiContext);
  if (!context) {
    throw new Error('useGemini must be used within a GeminiProvider');
  }
  return context;
};

interface GeminiProviderProps {
  children: ReactNode;
}

export const GeminiProvider: React.FC<GeminiProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ProviderMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Track backend processing
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const clientIdRef = useRef<string>(uuidv4()); // Generate client ID once

  const connectWebSocket = useCallback(() => {
    // Prevent multiple connection attempts
    if (isConnecting || wsRef.current?.readyState === WebSocket.OPEN) return;

    if (reconnectTimeoutRef.current) window.clearTimeout(reconnectTimeoutRef.current);
    reconnectTimeoutRef.current = null;

    setIsConnecting(true);
    setError(null); // Clear previous errors on new attempt
    
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

      ws.onmessage = (event) => {
        try {
          if (event.data instanceof Blob) {
             console.log("[GeminiProvider] Received audio blob - handling needed.");
             // TODO: Implement audio handling logic (e.g., emitting an event, updating context state)
             return;
          }

          const data = JSON.parse(event.data) as IncomingWebSocketMessage;
          console.log("[GeminiProvider] Received message:", data);

          // Append/Update messages based on type
          if (data.type === 'text' && data.content) {
             setMessages(prev => {
               const lastMsg = prev[prev.length - 1];
               if (lastMsg?.role === 'assistant') {
                 // Append to last assistant message
                 const updated = [...prev];
                 updated[prev.length-1] = { ...lastMsg, content: data.content }; // Update content
                 return updated;
               } else {
                 // Add new assistant message
                 return [...prev, { id: uuidv4(), role: 'assistant', content: data.content, timestamp: Date.now() }];
               }
             });
          } else if (data.type === 'complete') {
             setIsProcessing(false);
          } else if (data.type === 'error' && data.error) {
             setError(data.error);
             setMessages(prev => [...prev, { id: uuidv4(), role: 'error', content: data.error!, timestamp: Date.now() }]);
             setIsProcessing(false);
             toast({ title: 'Server Error', description: data.error, variant: 'destructive' });
          } else if (data.type === 'audio_chunk_info'){
             // console.debug("Received audio info", data);
          } else if (data.type === 'pong') {
             // console.debug("Received pong from server");
          } else if (data.type !== 'server_ping') { // Ignore server pings in message logic
             console.warn("[GeminiProvider] Unhandled message type:", data.type);
          }

        } catch (e) {
          console.error('[GeminiProvider] Failed to parse message:', e, event.data);
        }
      };

      ws.onerror = (event) => {
        console.error('[GeminiProvider] WebSocket error:', event);
        setError('Connection error occurred.'); // Keep error concise for UI
        setIsConnected(false);
        setIsConnecting(false);
      };

      ws.onclose = (event) => {
        console.log(`[GeminiProvider] WebSocket closed (Code: ${event.code})`);
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;
        
        if (event.code !== 1000 && reconnectAttemptsRef.current < API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS) { // Don't auto-reconnect on normal close (1000)
          reconnectAttemptsRef.current++;
          const delay = API_CONFIG.WEBSOCKET.RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current - 1);
          console.log(`[GeminiProvider] Reconnecting attempt ${reconnectAttemptsRef.current} in ${delay}ms...`);
          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connectWebSocket();
          }, delay);
        } else if (event.code !== 1000) {
          setError('Failed to reconnect after multiple attempts.');
          toast({ title: "Connection Lost", description: "Could not reconnect.", variant: "destructive" });
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('[GeminiProvider] Error creating WebSocket:', err);
      setIsConnecting(false);
      setError('Failed to create WebSocket connection');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnecting]); // Only re-run if not already connecting

  const reconnect = useCallback(() => {
    console.log("[GeminiProvider] Manual reconnect triggered.");
    if (wsRef.current) {
      wsRef.current.close(1000, "Manual Reconnect"); // Close existing first
      wsRef.current = null;
    }
    reconnectAttemptsRef.current = 0; // Reset attempts for manual reconnect
    setError(null);
    connectWebSocket();
  }, [connectWebSocket]);

  // Initial connection and ping setup
  useEffect(() => {
    connectWebSocket(); // Attempt initial connection
    
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        try {
          // console.debug("[GeminiProvider] Sending ping");
          wsRef.current.send(JSON.stringify({ type: 'ping' }));
        } catch (e) {
          console.error('[GeminiProvider] Error sending ping:', e);
        }
      }
    }, API_CONFIG.DEFAULT_PING_INTERVAL);
    
    // Cleanup on unmount
    return () => {
      console.log("[GeminiProvider] Unmounting - cleaning up.");
      clearInterval(pingInterval);
      if (reconnectTimeoutRef.current) window.clearTimeout(reconnectTimeoutRef.current);
      wsRef.current?.close(1000, "Component Unmounted");
      wsRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // sendMessage now accepts the structured message
  const sendMessage = useCallback(async (message: OutgoingWebSocketMessage) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
       setError('Cannot send message: WebSocket not connected.');
       console.error('Cannot send message: WebSocket not connected.');
       // Optionally try reconnecting before throwing error
       // reconnect(); 
       throw new Error('WebSocket is not connected');
    }

    // Add user message optimistically to local state (if applicable)
    // This depends on whether the calling component manages its own display messages
    // Maybe GeminiProvider shouldn't manage the UI message list directly?
    // For now, let's assume the caller adds the user message.
    
    // We *do* set the processing state here
    setIsProcessing(true); 
    setError(null); // Clear previous errors

    return new Promise<void>((resolve, reject) => {
      try {
        console.log("[GeminiProvider] Sending message:", message);
        wsRef.current?.send(JSON.stringify(message));
        resolve(); // Resolve promise once message is sent
      } catch (error) {
        console.error('[GeminiProvider] Error sending message:', error);
        setError('Failed to send message');
        setIsProcessing(false); // Reset processing on send error
        reject(error);
      }
    });
  }, [/* Add dependencies like isConnected? Maybe not needed due to initial check */]);

  const resetError = useCallback(() => { setError(null); }, []);
  const clearMessages = useCallback(() => { 
    setMessages([]); 
    // TODO: Send reset signal to backend if necessary? 
  }, []);

  // Context value
  const value = {
    sendMessage,
    messages, // Provide the managed messages
    isConnected,
    isConnecting,
    isProcessing, // Provide processing state
    error,
    resetError,
    reconnect,
    clearMessages,
  };

  return (
    <GeminiContext.Provider value={value}>
      {children}
    </GeminiContext.Provider>
  );
};
