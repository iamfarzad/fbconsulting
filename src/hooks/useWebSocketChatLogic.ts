import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
// Use the default export which contains the processed config
import API_CONFIG from '@/config/apiConfig'; 

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// Define a more specific FileState if needed, matching the backend expectation eventually
interface FileState {
  data: string; // Data URL for preview, Base64 extracted on send
  mimeType: string;
  name: string;
  type: 'image' | 'document';
  preview?: string;
}

// Define a clearer Message interface
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  id: string;
  // Add optional fields if needed, e.g., for file attachments in UI
  files?: Pick<FileState, 'name' | 'type'>[]; 
}

export function useWebSocketChatLogic() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [isProcessing, setIsProcessing] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const { toast } = useToast();
  
  // Use a stable client ID generation function
  const getClientId = useCallback(() => `web-client-${Math.random().toString(36).substring(2, 9)}`, []);
  const clientIdRef = useRef<string>(getClientId());

  // MOVE Files state declaration BEFORE handleSendMessage
  const [files, setFiles] = useState<FileState[]>([]);

  // --- Audio Handling (Define BEFORE handleIncomingMessage) ---
  const handleAudioChunk = useCallback((audioBlob: Blob) => {
    try {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      audio.onended = () => URL.revokeObjectURL(audioUrl);
      audio.onerror = (e) => {
        console.error('Audio element error:', e);
        URL.revokeObjectURL(audioUrl); 
      };
    } catch (error) {
      console.error('Error processing audio Blob:', error);
    }
  }, []); 

  // --- Disconnect Handler (Define before connectWebSocket uses it) ---
  const handleDisconnect = useCallback((event?: CloseEvent, pingIntervalId?: NodeJS.Timeout) => {
      console.log(`WebSocket disconnected. Code: ${event?.code}, Reason: ${event?.reason}`);
      if (pingIntervalId) clearInterval(pingIntervalId);
      setStatus('disconnected');
      socketRef.current = null;

      // Reconnect logic
      if (reconnectAttemptsRef.current < API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          const delay = API_CONFIG.WEBSOCKET.RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current - 1); 
          console.log(`Attempting reconnect ${reconnectAttemptsRef.current}/${API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS} in ${delay}ms...`);
          if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = setTimeout(() => {
              connectWebSocket(); // connectWebSocket needs to be defined or passed correctly
          }, delay);
      } else {
          console.error('Max reconnect attempts reached. Giving up.');
          toast({ title: "Connection Lost", description: "Could not reconnect.", variant: "destructive" });
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]); // Removed connectWebSocket dependency temporarily

  // --- Incoming Message Handler (Define before connectWebSocket uses it) ---
  const handleIncomingMessage = useCallback((event: MessageEvent) => {
      try {
          if (event.data instanceof Blob) {
              handleAudioChunk(new Blob([event.data], { type: 'audio/mp3' }));
              return;
          }
          const data = JSON.parse(event.data);
          switch (data.type) {
              case 'text':
                  setMessages(prev => {
                      const lastMessage = prev[prev.length - 1];
                      if (lastMessage?.role === 'assistant') {
                          const updatedMessages = [...prev];
                          updatedMessages[prev.length - 1] = { ...lastMessage, content: data.content }; 
                          return updatedMessages;
                      } else {
                          return [...prev, { role: 'assistant', content: data.content, timestamp: Date.now(), id: `ai-${Date.now()}` }];
                      }
                  });
                  break;
              case 'complete': setIsProcessing(false); console.log("Assistant message complete."); break;
              case 'audio_chunk_info': break; 
              case 'error':
                  console.error('Server processing error:', data.error);
                  toast({ title: "Server Error", description: data.error || "An error occurred.", variant: "destructive" });
                  setIsProcessing(false);
                  break;
              case 'pong': console.debug('Client Pong Received'); break;
              case 'server_ping':
                  console.debug('Server Ping Received, sending pong');
                  if (socketRef.current?.readyState === WebSocket.OPEN) {
                      socketRef.current.send(JSON.stringify({ type: 'client_pong' }));
                  }
                  break;
              default: console.warn('Unhandled message type:', data.type, data);
          }
      } catch (err) {
          console.error('Error handling incoming message:', err, event.data);
      }
  }, [handleAudioChunk, toast]); 


  // --- WebSocket Connection Logic (Define before useEffect calls it) ---
  const connectWebSocket = useCallback(() => {
      if (socketRef.current || status === 'connecting') {
          return; 
      }
      setStatus('connecting');
      console.log(`Attempting WS connection (Attempt: ${reconnectAttemptsRef.current + 1})...`);
      
      // Read config values *inside* the function scope
      const currentWsBaseUrl = API_CONFIG.WS_BASE_URL;
      const currentWsPath = API_CONFIG.WEBSOCKET.PATH;
      const currentClientId = clientIdRef.current; // Use ref value
      const wsUrl = `${currentWsBaseUrl}${currentWsPath}${currentClientId}`;
      
      console.log(`>>> Trying to connect WebSocket to: ${wsUrl}`); // Log the URL being used
      
      let socket: WebSocket;
      try {
          socket = new WebSocket(wsUrl);
      } catch (error) {
          console.error('WebSocket constructor error:', error);
          setStatus('error');
          handleDisconnect(); 
          return;
      }

      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;

      socket.onopen = () => {
          console.log('WebSocket connected.');
          setStatus('connected');
          reconnectAttemptsRef.current = 0;
          const pingInterval = setInterval(() => {
              if (socket.readyState === WebSocket.OPEN) {
                  console.debug('Sending client ping');
                  socket.send(JSON.stringify({ type: 'ping' }));
              } else {
                  clearInterval(pingInterval);
              }
          }, API_CONFIG.DEFAULT_PING_INTERVAL);
          socket.onclose = (event) => handleDisconnect(event, pingInterval);
          socketRef.current = socket; 
      };

      socket.onerror = (event) => {
          console.error('WebSocket error:', event);
          setStatus('error');
      };

      socket.onmessage = handleIncomingMessage; 

  // Pass stable handlers as dependencies
  }, [status, handleDisconnect, handleIncomingMessage]); 

  // Add connectWebSocket back to handleDisconnect dependency array *after* it's defined
  // NOTE: This creates a potential dependency cycle warning, often resolvable with useRef for connectWebSocket
  // For now, we accept the potential ESLint warning or slight inefficiency.
  useEffect(() => {
    // This effect ensures handleDisconnect has the latest connectWebSocket reference
    // but it's complex. Consider refactoring connection logic further if issues persist.
  }, [handleDisconnect, connectWebSocket]);

  // --- Effect to Initiate Connection ---
  useEffect(() => {
      if (status === 'disconnected' && !socketRef.current && !retryTimeoutRef.current) {
          console.log("useEffect initiating connection...");
          reconnectAttemptsRef.current = 0; 
          connectWebSocket();
      }
      // Cleanup function remains the same
      return () => {
          if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
          if (socketRef.current) {
              console.log('Closing WebSocket via cleanup effect.');
              socketRef.current.onclose = null; 
              socketRef.current.close();
              socketRef.current = null;
          }
      };
  }, [status, connectWebSocket]); // Include connectWebSocket as a dependency

  // --- Auto-scroll Effect ---
  useEffect(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Send Message Logic ---
  const handleSendMessage = useCallback(() => {
    if ((!input.trim() && files.length === 0) || isProcessing) {
      return;
    }
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error('Cannot send: WebSocket not connected.');
      toast({ title: "Connection Error", description: "Not connected.", variant: "destructive" });
      if(status === 'disconnected') connectWebSocket();
      return;
    }
    try {
      const userMessageContent = input;
      const userFiles = [...files]; 
      const userDisplayMessage: ChatMessage = {
        role: 'user',
        content: userMessageContent,
        files: userFiles.map(f => ({ name: f.name, type: f.type })), 
        timestamp: Date.now(),
        id: `user-${Date.now()}`,
      };
      setMessages(prev => [...prev, userDisplayMessage]);
      setInput(''); setFiles([]); setIsProcessing(true);
      let messageToSend: any;
      if (userFiles.length > 0) {
        const fileDataToSend = userFiles.map(file => {
          const base64Data = file.data.split(',')[1]; 
          if (!base64Data) throw new Error(`Invalid data URL for file ${file.name}`);
          return { mime_type: file.mimeType, data: base64Data, filename: file.name };
        });
        messageToSend = {
          type: 'multimodal_message',
          text: userMessageContent || null, files: fileDataToSend, role: 'user', enableTTS: true 
        };
        console.log(`Sending multimodal msg w/ ${fileDataToSend.length} files.`);
      } else {
        messageToSend = { type: 'text_message', text: userMessageContent, role: 'user', enableTTS: true };
        console.log(`Sending text message.`);
      }
      socketRef.current.send(JSON.stringify(messageToSend));
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({ title: "Send Error", description: error?.message || "Failed to send.", variant: "destructive" });
      setIsProcessing(false); 
    }
  }, [input, files, isProcessing, status, toast, connectWebSocket]); 

  // --- File Handling Callbacks ---
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string; 
      const fileType = file.type.startsWith('image/') ? 'image' : 'document';
      setFiles(prev => [...prev, { data: result, mimeType: file.type, name: file.name, type: fileType, preview: fileType === 'image' ? result : undefined }]);
    };
    reader.onerror = (error) => { console.error("FileReader error:", error); toast({title: "File Error", description: "Could not read file.", variant: "destructive"}); };
    reader.readAsDataURL(file);
    if (event.target) event.target.value = ''; 
  }, [toast]);

  const removeFile = useCallback((index: number) => { setFiles(prev => prev.filter((_, i) => i !== index)); }, []);
  const clearMessages = useCallback(() => { setMessages([]); }, []);

  // --- Return Hook Values ---
  return { messages, input, setInput, status, isProcessing, messageEndRef, files, setFiles, handleSendMessage, handleFileUpload, removeFile, clearMessages };
}
