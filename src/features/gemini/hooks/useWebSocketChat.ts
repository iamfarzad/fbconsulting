
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG } from '@/config/apiConfig';
import { AIMessage } from '../types/messageTypes';
import { v4 as uuidv4 } from 'uuid';

// Helper to generate unique client ID
const generateClientId = () => uuidv4().substring(0, 8);

export function useWebSocketChat() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [clientId] = useState(() => generateClientId());
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS || 3;
  const { toast } = useToast();
  
  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }
    
    try {
      setIsConnecting(true);
      setError(null);
      
      const wsUrl = `${API_CONFIG.WS_BASE_URL}/ws/${clientId}`;
      console.log(`Connecting to WebSocket: ${wsUrl}`);
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttempts.current = 0;
        
        toast({
          title: "Connected",
          description: "WebSocket connection established",
          duration: 3000,
        });
      };
      
      ws.onmessage = (event) => {
        try {
          // Handle binary data (audio chunks)
          if (event.data instanceof Blob) {
            console.log("Received audio chunk");
            
            // Set audio playing state
            setIsAudioPlaying(true);
            
            // In a real implementation, we would process the audio blob
            // For now, just simulate progress
            let progress = 0;
            const interval = setInterval(() => {
              progress += 5;
              if (progress <= 100) {
                setAudioProgress(progress);
              } else {
                clearInterval(interval);
                setIsAudioPlaying(false);
                setAudioProgress(0);
              }
            }, 100);
            
            return;
          }
          
          // Handle JSON messages
          const data = JSON.parse(event.data);
          console.log("WebSocket message:", data);
          
          switch (data.type) {
            case 'text':
              setMessages(prev => {
                // Check if we already have the latest assistant message
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.content.includes(data.content)) {
                  // Update the last message
                  return [
                    ...prev.slice(0, -1),
                    { ...lastMessage, content: data.content }
                  ];
                } else if (!lastMessage || lastMessage.role !== 'assistant') {
                  // Add a new message
                  return [...prev, {
                    role: 'assistant',
                    content: data.content,
                    timestamp: Date.now(),
                    id: `msg-${Date.now()}`
                  }];
                }
                return prev;
              });
              break;
              
            case 'complete':
              setIsLoading(false);
              break;
              
            case 'error':
              console.error("WebSocket error:", data.error);
              setError(data.error);
              setIsLoading(false);
              break;
              
            default:
              console.log("Unhandled message type:", data.type);
          }
        } catch (e) {
          console.error("Error parsing WebSocket message:", e);
        }
      };
      
      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        setError("WebSocket connection error");
        setIsConnecting(false);
        setIsConnected(false);
        
        toast({
          title: "Connection Error",
          description: "Failed to connect to the AI service",
          variant: "destructive",
        });
      };
      
      ws.onclose = (event) => {
        console.log("WebSocket closed:", event);
        setIsConnected(false);
        setIsConnecting(false);
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`);
          setTimeout(connect, 2000 * reconnectAttempts.current);
        } else {
          setError("WebSocket connection closed. Max reconnection attempts reached.");
          toast({
            title: "Connection Closed",
            description: "Connection to AI service lost",
            variant: "destructive",
          });
        }
      };
      
      wsRef.current = ws;
    } catch (e) {
      console.error("Error creating WebSocket:", e);
      setError("Failed to create WebSocket connection");
      setIsConnecting(false);
      setIsConnected(false);
    }
  }, [clientId, toast]);
  
  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);
  
  // Send a message
  const sendMessage = useCallback((content: string, enableTTS: boolean = true) => {
    if (!content.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error("Cannot send message:", !content.trim() ? "Empty message" : "WebSocket not connected");
      
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        setError("Not connected to AI service");
        connect(); // Try to reconnect
      }
      
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Add user message to local state
      const userMessage: AIMessage = {
        role: 'user',
        content,
        timestamp: Date.now(),
        id: `msg-${Date.now()}`
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Send message to WebSocket
      wsRef.current.send(JSON.stringify({
        type: 'text_message',
        text: content,
        enableTTS
      }));
    } catch (e) {
      console.error("Error sending message:", e);
      setError("Failed to send message");
      setIsLoading(false);
    }
  }, [connect]);
  
  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  // Stop audio playback
  const stopAudio = useCallback(() => {
    setIsAudioPlaying(false);
    setAudioProgress(0);
    
    // In a real implementation, we would stop the audio playback
    toast({
      title: "Audio Stopped",
      description: "Audio playback has been stopped",
      duration: 2000,
    });
  }, [toast]);
  
  // Connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);
  
  return {
    messages,
    isLoading,
    isConnected,
    isConnecting,
    isAudioPlaying,
    audioProgress,
    error,
    clientId,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
    stopAudio
  };
}

export type AIMessage = {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  id?: string;
};
