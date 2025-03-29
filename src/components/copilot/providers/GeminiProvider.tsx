
import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import API_CONFIG from '@/config/apiConfig'; 
import { v4 as uuidv4 } from 'uuid'; 

// --- Types --- (Consider moving to a shared types file)
interface ProviderMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  // Add other relevant fields like files for display?
}

interface OutgoingWebSocketMessage {
  type: 'text_message' | 'multimodal_message';
  text?: string | null;
  files?: Array<{ mime_type: string; data: string; filename?: string }>; // Base64 data
  role?: string;
  enableTTS?: boolean;
}

interface IncomingWebSocketMessage {
  type: string;
  content?: string;
  error?: string;
  status?: string;
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
// ---

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
    if (isConnecting || wsRef.current?.readyState === WebSocket.OPEN) return;
    if (reconnectTimeoutRef.current) window.clearTimeout(reconnectTimeoutRef.current);
    reconnectTimeoutRef.current = null;
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

      ws.onmessage = (event) => {
        try {
          if (event.data instanceof Blob) {
             console.log("[GeminiProvider] Received audio blob - handling needed.");
             // TODO: Implement audio handling
             return;
          }
          const data = JSON.parse(event.data) as IncomingWebSocketMessage;
          console.log("[GeminiProvider] Received message:", data);

          // --- Message Handling Logic --- 
          setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            if (data.type === 'text' && data.content) {
              if (lastMsg?.role === 'assistant' && !contextIsProcessing /* Avoid appending to old message if new one started */) {
                // Append to last assistant message content if still processing same response
                // Best practice: Backend should send message IDs to reliably update.
                // Simple approach for now: Update the last assistant message.
                const updated = [...prev];
                updated[prev.length-1] = { ...lastMsg, content: data.content }; 
                return updated;
              } else {
                // Add new assistant message
                return [...prev, { id: uuidv4(), role: 'assistant', content: data.content, timestamp: Date.now() }];
              }
            } else if (data.type === 'error' && data.error) {
               return [...prev, { id: uuidv4(), role: 'error', content: data.error, timestamp: Date.now() }];
            }
            // Return previous state if message type isn't handled for display
            return prev; 
          });
          // --- End Message Handling --- 

          // --- State Update Logic --- 
          if (data.type === 'complete') {
             setIsProcessing(false);
          } else if (data.type === 'error' && data.error) {
             setError(data.error);
             setIsProcessing(false);
             toast({ title: 'Server Error', description: data.error, variant: 'destructive' });
          } else if (data.type === 'pong') {
            // console.debug("Received pong from server");
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
          reconnectTimeoutRef.current = window.setTimeout(() => { reconnectTimeoutRef.current = null; connectWebSocket(); }, delay);
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
  }, [isConnecting]); 

  const reconnect = useCallback(() => {
    console.log("[GeminiProvider] Manual reconnect triggered.");
    if (wsRef.current) wsRef.current.close(1000, "Manual Reconnect");
    reconnectAttemptsRef.current = 0;
    setError(null);
    setIsProcessing(false); // Reset processing on reconnect
    connectWebSocket();
  }, [connectWebSocket]);

  // Initial connection and ping setup
  useEffect(() => {
    connectWebSocket();
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        try { wsRef.current.send(JSON.stringify({ type: 'ping' })); }
        catch (e) { console.error('[GeminiProvider] Error sending ping:', e); }
      }
    }, API_CONFIG.DEFAULT_PING_INTERVAL);
    return () => {
      console.log("[GeminiProvider] Unmounting.");
      clearInterval(pingInterval);
      if (reconnectTimeoutRef.current) window.clearTimeout(reconnectTimeoutRef.current);
      wsRef.current?.close(1000, "Component Unmounted");
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // sendMessage now accepts the structured message
  const sendMessage = useCallback(async (message: OutgoingWebSocketMessage) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
       setError('Cannot send: WebSocket not connected.');
       console.error('Cannot send: WebSocket not connected.');
       reconnect(); // Attempt reconnect
       throw new Error('WebSocket is not connected');
    }
    setIsProcessing(true); 
    setError(null); 
    return new Promise<void>((resolve, reject) => {
      try {
        console.log("[GeminiProvider] Sending message:", message);
        wsRef.current?.send(JSON.stringify(message));
        resolve(); 
      } catch (error) {
        console.error('[GeminiProvider] Error sending message:', error);
        setError('Failed to send message');
        setIsProcessing(false); 
        reject(error);
      }
    });
  // Add dependencies that affect sending logic
  }, [reconnect]); 

  const resetError = useCallback(() => { setError(null); }, []);
  const clearMessages = useCallback(() => { setMessages([]); }, []);

  // Context value
  const value: GeminiContextType = {
    sendMessage,
    messages, 
    isConnected,
    isConnecting,
    isProcessing, 
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
