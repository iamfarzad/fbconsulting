import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG } from '@/config/api';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  id: string;
}

export function useWebSocketChatLogic() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [isProcessing, setIsProcessing] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Generate a client ID that persists for the session
  const clientIdRef = useRef<string>(`web-client-${Math.random().toString(36).substring(2, 9)}`);

  // Handle audio data from the server
  const handleAudioChunk = useCallback((audioBlob: Blob) => {
    try {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      
      // Clean up the audio URL when done
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  }, []);

  // Set up WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      setStatus('connecting');
      
      try {
        const wsUrl = `${API_CONFIG.WS_BASE_URL}/ws/${clientIdRef.current}`;
        const socket = new WebSocket(wsUrl);
        
        socket.onopen = () => {
          console.log('WebSocket connected');
          setStatus('connected');
          // Start regular pings to keep the connection alive
          const pingInterval = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ type: 'ping' }));
            }
          }, 30000); // 30 second ping

          // Store the interval ID in the ref so we can clear it on disconnect
          socketRef.current = socket;
          
          // Clean up the interval when the socket closes
          socket.onclose = () => {
            clearInterval(pingInterval);
            setStatus('disconnected');
            socketRef.current = null;
          };
        };
        
        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          setStatus('error');
          toast({
            title: "Connection Error",
            description: "Failed to connect to chat service. Please try again later.",
            variant: "destructive",
          });
        };
        
        socket.onmessage = (event) => {
          try {
            // Handle binary data (audio chunks)
            if (event.data instanceof Blob) {
              handleAudioChunk(event.data);
              return;
            }
            
            // Handle JSON data
            const data = JSON.parse(event.data);
            console.log('Received message:', data);
            
            switch (data.type) {
              case 'text':
                setMessages(prev => {
                  // Find the last assistant message or create a new one
                  const lastAssistantIndex = [...prev].reverse().findIndex(m => m.role === 'assistant');
                  
                  if (lastAssistantIndex >= 0) {
                    const newMessages = [...prev];
                    const actualIndex = prev.length - 1 - lastAssistantIndex;
                    newMessages[actualIndex] = {
                      ...newMessages[actualIndex],
                      content: data.content,
                    };
                    return newMessages;
                  } else {
                    // If no existing assistant message, create a new one
                    return [...prev, {
                      role: 'assistant',
                      content: data.content,
                      timestamp: Date.now(),
                      id: `ai-${Date.now()}`,
                    }];
                  }
                });
                break;
                
              case 'complete':
                setIsProcessing(false);
                break;
                
              case 'error':
                console.error('Server error:', data.error);
                toast({
                  title: "Error",
                  description: data.error || "An error occurred while processing your request.",
                  variant: "destructive",
                });
                setIsProcessing(false);
                break;
                
              case 'pong':
                // Ping response received, connection is alive
                console.log('Ping acknowledged');
                break;
                
              case 'server_ping':
                // Server is checking if we're still connected, respond with any message
                socket.send(JSON.stringify({ type: 'client_pong' }));
                break;
                
              default:
                console.log('Unhandled message type:', data.type);
            }
          } catch (err) {
            console.error('Error parsing message:', err, event.data);
          }
        };
      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        setStatus('error');
        toast({
          title: "Connection Error",
          description: "Failed to initialize chat connection.",
          variant: "destructive",
        });
      }
    };
    
    if (!socketRef.current) {
      connectWebSocket();
    }
    
    // Clean up WebSocket on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [toast, handleAudioChunk]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = useCallback(() => {
    if ((!input.trim() && !files.length) || isProcessing || status !== 'connected') {
      return;
    }
    
    try {
      // Add user message to the UI
      const userMessage = {
        role: 'user' as const,
        content: input,
        timestamp: Date.now(),
        id: `user-${Date.now()}`,
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsProcessing(true);
      
      // Prepare message for WebSocket
      if (files.length > 0) {
        // Send as multimodal message
        const fileData = files.map(file => ({
          mime_type: file.mimeType,
          data: file.data,
          filename: file.name
        }));
        
        const message = {
          type: 'multimodal_message',
          text: input,
          files: fileData,
          role: 'user',
          enableTTS: true
        };
        
        socketRef.current?.send(JSON.stringify(message));
      } else {
        // Send as text-only message
        const message = {
          type: 'text_message',
          text: input,
          role: 'user',
          enableTTS: true
        };
        
        socketRef.current?.send(JSON.stringify(message));
      }
      
      // Clear input and files after sending
      setInput('');
      clearFiles();
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  }, [input, isProcessing, status, files, toast]);

  // Files state
  const [files, setFiles] = useState<Array<{data: string, mimeType: string, name: string, type: string, preview?: string}>>([]);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const fileType = file.type.startsWith('image/') ? 'image' : 'document';
        
        setFiles(prev => [...prev, {
          data: result,
          mimeType: file.type,
          name: file.name,
          type: fileType,
          preview: fileType === 'image' ? result : undefined
        }]);
      };
      reader.readAsDataURL(file);
    }
    // Reset the input value so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  }, []);

  // Remove file
  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Clear all files
  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    input,
    setInput,
    status,
    isProcessing,
    messageEndRef,
    files,
    handleSendMessage,
    handleFileUpload,
    removeFile,
    clearFiles,
    clearMessages
  };
}
